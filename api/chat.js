export default async function handler(req, res) {
  // ✅ process.env works here — this runs on the server
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_MODEL   = 'gemma-4-26b-a4b-it';
  const AGENT_NAME     = 'Bellt Agent';

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    }
  );

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

  res.status(200).json({ reply });
}