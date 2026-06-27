(function () {
    /* ═══════════════════════════════════════════════════
       CONFIGURATION — Put your Gemini API key here
       ═══════════════════════════════════════════════════ */
    const GEMINI_API_KEY = 'AQ.Ab8RN6JW2pLSjkO3fiTeMYTuNucqixbkAIUKi3aNz45YOVsBvA';
    const GEMINI_MODEL = 'gemma-4-26b-a4b-it';
    const AGENT_NAME = 'Agent';

    const SYSTEM_PROMPT = `You are replying to messages on behalf of [Bellt Consult PLC].

== ABOUT Us ==
Name: Belltconsult PLC
Location: Addis Ababa, Ethiopia
Profession: Architectural Design and Consultancy
Specialty:Bellt Consult is a premier architecture consulting firm crafting visionary spaces across residential, commercial, interior, and urban scales located in Addis Ababa, Ethiopia.
Company: Bellt Consult is a multidisciplinary architecture and consulting firm working at the intersection of precision craft and visionary thinking. Founded in 2025, we operate across residential, commercial, interior, and urban scales, with offices in Addis Ababa, Mekelle, Jima, and all across ethiopia.
Every project is an inquiry — a rigorous investigation into site, program, material, and meaning. We believe the built environment has the power to shape how people feel, gather, and thrive.

== About Us ==
Architectural Design
Full-scope architecture from concept design through construction documentation. We craft buildings that stand as permanent contributions to their contexts.
Interior Design
Interior environments of precision and character — from material selection and spatial planning to bespoke furniture and lighting design.
Urban Planning
Masterplanning and urban design strategies that create coherent, livable, and resilient neighborhoods at the district and city scale.
Construction Consulting
Expert technical consulting across procurement, contractor management, quality assurance, and project delivery strategy.
3D Visualization
Photorealistic renders, immersive walkthroughs, and virtual reality presentations that communicate design intent with clarity and impact.
Vision: To become Ethiopia's most trusted and innovative architecture and construction company, creating sustainable, functional, and inspiring spaces that improve communities and contribute to the nation's development.
Mission: Our mission is to deliver exceptional architectural design and high-quality construction services by combining creativity, technical expertise, and modern building practices. We are committed to exceeding client expectations through integrity, professionalism, timely project delivery, and sustainable solutions that add lasting value to every project.
Logo meaning : Our logo shows our company name and the mission of our compay which is building the future Ethiopia.
Website: [belltconsult.com]
Email: [belltconsult@gmail.com]
Phone: [+251986363333]
Address : Addis Ababa,Ethiopia
Gurdshola, EtsehiwotEngedawork building
3rd floor, 305

Our Leadership
Our experienced leadership team guides Bellt Consult in fulfilling its mission of providing the best output..

Binyam Gebreegziabher Managing Director and Lead Architect +251 96 314 0629  Email:gbinyamg@gmail.com

Walelign Dejen Deputy Managing Director +251 93 069 6912  Email :wollt22@gmail.com

Bethelihem Tsegay Finance and Admin +251 91 108 7943
   
Communication Style Professional Compassionate,Hopeful,Respectful,Clear and concise,Encouraging but never pushy,Human-like and conversational`;

    /* ═══════════════════════════════════════════════════
       DOM References
       ═══════════════════════════════════════════════════ */
    const root = document.getElementById('cw-root');
    const trigger = document.getElementById('cw-trigger');
    const iconChat = document.getElementById('cw-icon-chat');
    const iconClose = document.getElementById('cw-icon-close');
    const window_ = document.getElementById('cw-window');
    const messages = document.getElementById('cw-messages');
    const welcome = document.getElementById('cw-welcome');
    const typing = document.getElementById('cw-typing');
    const input = document.getElementById('cw-input');
    const sendBtn = document.getElementById('cw-send');
    const clearBtn = document.getElementById('cw-clear-btn');
    const sugBtns = document.querySelectorAll('.cw-sug-btn');

    let conversationHistory = [];
    let isProcessing = false;

    /* ═══════════════════════════════════════════════════
       Toggle Chat Window
       ═══════════════════════════════════════════════════ */
    trigger.addEventListener('click', () => {
        const isOpen = root.classList.toggle('cw-open');
        iconChat.style.display = isOpen ? 'none' : 'block';
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
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

            const body = {
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: conversationHistory,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            };

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `API returned ${res.status}`);
            }

            const data = await res.json();
            const parts = data?.candidates?.[0]?.content?.parts || [];

            /* Extract only text parts, skip thought parts from the API response */
            let reply = '';
            for (const part of parts) {
                if (part.text && !part.thought) {
                    reply += part.text;
                }
            }

            /* Fallback: if no clean text found, grab first text regardless */
            if (!reply.trim() && parts.length > 0) {
                reply = parts.map(p => p.text || '').join('');
            }

            /* Strip any inline thinking tags the model may have included */
            reply = stripThinking(reply);

            if (!reply) throw new Error('Empty response from API');

            /* Store only the clean reply in history (no thinking) */
            conversationHistory.push({ role: 'model', parts: [{ text: reply }] });
            appendMessage('agent', reply);

        } catch (err) {
            console.error('ChatWidget Error:', err);
            const userMsg = GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY'
                ? 'Please set your Gemini API key in the script configuration.'
                : err.message;
            appendMessage('agent', userMsg, true);
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
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
})();