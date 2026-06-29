
(function() {
  /* ═══════════════════════════════════════════════════
     CONFIGURATION — Put your Gemini API key here
     ═══════════════════════════════════════════════════ */
  const AGENT_NAME = 'Bellt Agent'; // ✅ safe to keep here — not a secret
  const GEMINI_MODEL = 'gemma-4-26b-a4b-it';
    async function sendMessage(userMessage) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();
      return data.reply;
    }

  const SYSTEM_PROMPT = `You are a helpful, friendly customer support agent named ${AGENT_NAME}.
Respond concisely and clearly. Use markdown for formatting when appropriate (bold, lists, code).
If you don't know something, be honest about it. Keep responses focused and practical.`;

  /* ═══════════════════════════════════════════════════
     DOM References
     ═══════════════════════════════════════════════════ */
  const root       = document.getElementById('cw-root');
  const trigger    = document.getElementById('cw-trigger');
  const iconChat   = document.getElementById('cw-icon-chat');
  const iconClose  = document.getElementById('cw-icon-close');
  const window_    = document.getElementById('cw-window');
  const messages   = document.getElementById('cw-messages');
  const welcome    = document.getElementById('cw-welcome');
  const typing     = document.getElementById('cw-typing');
  const input      = document.getElementById('cw-input');
  const sendBtn    = document.getElementById('cw-send');
  const clearBtn   = document.getElementById('cw-clear-btn');
  const sugBtns    = document.querySelectorAll('.cw-sug-btn');

  let conversationHistory = [];
  let isProcessing = false;

  /* ═══════════════════════════════════════════════════
     Toggle Chat Window
     ═══════════════════════════════════════════════════ */
  trigger.addEventListener('click', () => {
    const isOpen = root.classList.toggle('cw-open');
    iconChat.style.display  = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
    if (isOpen) setTimeout(() => input.focus(), 350);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('cw-open')) {
      trigger.click();
    }
  });

  /* ═══════════════════════════════════════════════════
     Suggestion Buttons
     ═══════════════════════════════════════════════════ */
  sugBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.dataset.msg);
    });
  });

  /* ═══════════════════════════════════════════════════
     Input Handling
     ═══════════════════════════════════════════════════ */
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    sendBtn.disabled = input.value.trim().length === 0;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled && !isProcessing) sendMessage(input.value.trim());
    }
  });

  sendBtn.addEventListener('click', () => {
    if (!sendBtn.disabled && !isProcessing) sendMessage(input.value.trim());
  });

  /* ═══════════════════════════════════════════════════
     Send Message
     ═══════════════════════════════════════════════════ */
  function sendMessage(text) {
    if (!text || isProcessing) return;

    if (welcome) welcome.style.display = 'none';

    appendMessage('user', text);
    conversationHistory.push({ role: 'user', parts: [{ text }] });

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    callGemini();
  }

  /* ═══════════════════════════════════════════════════
     Append Message to DOM
     ═══════════════════════════════════════════════════ */
  function appendMessage(role, text, isError) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cw-msg ' + role + (isError ? ' cw-error' : '');

    const bubble = document.createElement('div');
    bubble.className = 'cw-bubble';
    bubble.innerHTML = formatMarkdown(text);

    const time = document.createElement('div');
    time.className = 'cw-msg-time';
    time.textContent = getTimeString();

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    messages.appendChild(wrapper);
    scrollToBottom();
  }

  /* ═══════════════════════════════════════════════════
     Strip thinking/reasoning from response
     ═══════════════════════════════════════════════════ */
  function stripThinking(text) {
    if (!text) return '';
    /* Remove <thinking>...</thinking> blocks (multiline) */
    let clean = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
    /* Remove <thought>...</thought> blocks (multiline) */
    clean = clean.replace(/<thought>[\s\S]*?<\/thought>/gi, '');
    /* Remove [Thinking: ...] inline patterns */
    clean = clean.replace(/\[Thinking:[^\]]*\]/gi, '');
    /* Remove leading "Thinking:" lines */
    clean = clean.replace(/^Thinking:\s*.*$/gim, '');
    /* Collapse multiple blank lines left behind */
    clean = clean.replace(/\n{3,}/g, '\n\n');
    return clean.trim();
  }

  /* ═══════════════════════════════════════════════════
     Call Gemini API
     ═══════════════════════════════════════════════════ */
async function callGemini() {
  isProcessing = true;
  typing.style.display = 'flex';
  scrollToBottom();

  try {
    // Grab the last message the user typed
    const lastMessage = conversationHistory[conversationHistory.length - 1].parts[0].text;

    // Call YOUR Vercel server, not Google
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: lastMessage })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Request failed');

    // Read the reply from YOUR server
    let reply = data.reply;
    reply = stripThinking(reply);
    
    if (!reply) throw new Error('Empty response from API');

    conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
    appendMessage('agent', reply);

  } catch (err) {
    console.error('ChatWidget Error:', err);
    appendMessage('agent', err.message, true);
  } finally {
    isProcessing = false;
    typing.style.display = 'none';
    input.focus();
  }
}

  /* ═══════════════════════════════════════════════════
     Clear Chat
     ═══════════════════════════════════════════════════ */
  clearBtn.addEventListener('click', () => {
    const msgs = messages.querySelectorAll('.cw-msg');
    msgs.forEach(m => m.remove());
    if (welcome) welcome.style.display = '';
    conversationHistory = [];
    input.focus();
  });

  /* ═══════════════════════════════════════════════════
     Helpers
     ═══════════════════════════════════════════════════ */
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatMarkdown(text) {
    let html = text
      .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        return '<pre>' + escapeHtml(code.trim()) + '</pre>';
      })
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
      .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    html = html.replace(/((<li>.*?<\/li>(\s*<br>)?)+)/g, '<ul>$1</ul>');
    html = html.replace(/<br><\/ul>/g, '</ul>');

    return '<p>' + html + '</p>';
  }

  function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
