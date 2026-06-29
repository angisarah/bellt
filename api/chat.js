export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL   = 'gemma-4-26b-a4b-it'; 
  const AGENT_NAME     = 'Bellt Agent';

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const { history, systemPrompt } = req.body;

  /* ═══ Ultra-aggressive thinking stripper ═══ */
  function stripThinking(text) {
    if (!text) return '';
    let clean = text;
    // Remove <think />, <thinking />, <thought /> blocks
    clean = clean.replace(/<(think|thinking|thought)>[\s\S]*?<\/(think|thinking|thought)>/gi, '');
    // Remove **Thinking:** or *Thought:* (markdown bold/italic)
    clean = clean.replace(/^(\*{1,2})(think|thinking|thought)(\*{1,2})[:\s]*.*$/gim, '');
    // Remove [Thinking: ...]
    clean = clean.replace(/\[(think|thinking|thought):[^\]]*\]/gi, '');
    // Remove plain "Thinking:" or "Thought:" at the start of any line
    clean = clean.replace(/^(think|thinking|thought):?\s*.*$/gim, '');
    // Clean up leftover blank lines
    clean = clean.replace(/\n{3,}/g, '\n\n');
    return clean.trim();
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: history,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `API returned ${response.status}`);
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    
    let reply = '';
    for (const part of parts) {
      if (part.text && !part.thought) reply += part.text;
    }

    // Strip any thinking that leaked into the text
    reply = stripThinking(reply);

    res.status(200).json({ reply: reply || 'No response' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}