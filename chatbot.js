(function () {
  const PSV_GREEN = "#1a7a4a";
  const PSV_GREEN_DARK = "#145e38";
  const PSV_GREEN_LIGHT = "#e8f5ee";

  // ── Styles ──────────────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #psv-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 60px; height: 60px; border-radius: 50%;
      background: ${PSV_GREEN}; border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, transform 0.2s;
      overflow: hidden; padding: 0;
    }
    #psv-chat-btn:hover { background: ${PSV_GREEN_DARK}; transform: scale(1.07); }
    #psv-chat-btn img.psv-btn-photo { display: none; }
    #psv-chat-btn svg { width: 28px; height: 28px; display: block; }

    #psv-chat-window {
      position: fixed; bottom: 100px; right: 28px; z-index: 9999;
      width: 360px; max-width: calc(100vw - 40px);
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex; flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden; transition: opacity 0.2s, transform 0.2s;
      height: 500px; max-height: calc(100vh - 140px);
    }
    #psv-chat-window.psv-hidden { opacity: 0; pointer-events: none; transform: translateY(12px); }

    #psv-chat-header {
      background: ${PSV_GREEN}; color: #fff;
      padding: 16px 18px; display: flex; align-items: center; gap: 12px;
      flex-shrink: 0;
    }
    #psv-chat-header .psv-avatar {
      width: 42px; height: 42px; border-radius: 50%;
      overflow: hidden; flex-shrink: 0;
      border: 2px solid rgba(255,255,255,0.4);
      background: rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center;
    }
    #psv-chat-header .psv-avatar img { display: none; }
    #psv-chat-header .psv-avatar .psv-initials {
      font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.9);
    }
    #psv-chat-header .psv-title { font-weight: 600; font-size: 15px; }
    #psv-chat-header .psv-subtitle { font-size: 12px; opacity: 0.85; margin-top: 1px; }
    #psv-chat-close {
      margin-left: auto; background: none; border: none; color: #fff;
      cursor: pointer; font-size: 22px; line-height: 1; padding: 0 2px;
      opacity: 0.8; transition: opacity 0.15s;
    }
    #psv-chat-close:hover { opacity: 1; }

    #psv-chat-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      scroll-behavior: smooth;
    }
    #psv-chat-messages::-webkit-scrollbar { width: 4px; }
    #psv-chat-messages::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

    .psv-msg {
      max-width: 85%; padding: 10px 14px; border-radius: 14px;
      font-size: 14px; line-height: 1.5; word-wrap: break-word;
    }
    .psv-msg.psv-bot {
      background: ${PSV_GREEN_LIGHT}; color: #1a2e23;
      border-bottom-left-radius: 4px; align-self: flex-start;
    }
    .psv-msg.psv-user {
      background: ${PSV_GREEN}; color: #fff;
      border-bottom-right-radius: 4px; align-self: flex-end;
    }
    .psv-msg a { color: inherit; text-decoration: underline; }

    .psv-typing {
      display: flex; gap: 5px; align-items: center;
      padding: 12px 14px; background: ${PSV_GREEN_LIGHT};
      border-radius: 14px; border-bottom-left-radius: 4px;
      align-self: flex-start;
    }
    .psv-typing span {
      width: 7px; height: 7px; background: ${PSV_GREEN};
      border-radius: 50%; animation: psv-bounce 1.2s infinite;
    }
    .psv-typing span:nth-child(2) { animation-delay: 0.2s; }
    .psv-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes psv-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    #psv-quick-replies {
      padding: 8px 16px 4px; display: flex; flex-wrap: wrap; gap: 7px;
      flex-shrink: 0;
    }
    .psv-qr {
      background: #fff; border: 1.5px solid ${PSV_GREEN};
      color: ${PSV_GREEN}; border-radius: 20px;
      padding: 5px 12px; font-size: 12.5px; cursor: pointer;
      transition: background 0.15s, color 0.15s; white-space: nowrap;
    }
    .psv-qr:hover { background: ${PSV_GREEN}; color: #fff; }

    #psv-chat-input-area {
      padding: 12px 14px; border-top: 1px solid #eee;
      display: flex; gap: 8px; flex-shrink: 0;
    }
    #psv-chat-input {
      flex: 1; border: 1.5px solid #ddd; border-radius: 22px;
      padding: 9px 14px; font-size: 14px; outline: none;
      transition: border-color 0.15s; resize: none;
      font-family: inherit; line-height: 1.4;
    }
    #psv-chat-input:focus { border-color: ${PSV_GREEN}; }
    #psv-chat-send {
      width: 40px; height: 40px; border-radius: 50%;
      background: ${PSV_GREEN}; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.15s;
    }
    #psv-chat-send:hover { background: ${PSV_GREEN_DARK}; }
    #psv-chat-send:disabled { background: #ccc; cursor: default; }
    #psv-chat-send svg { width: 18px; height: 18px; }
  `;
  document.head.appendChild(style);

  // ── HTML ────────────────────────────────────────────────────────────────────
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <button id="psv-chat-btn" aria-label="Ouvrir le chat PSV">
      <img class="psv-btn-photo" src="/Pierre%20Laberge%20PHD.png" alt="Pierre Laberge">
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>

    <div id="psv-chat-window" class="psv-hidden" role="dialog" aria-label="Assistant PSV">
      <div id="psv-chat-header">
        <div class="psv-avatar"><span class="psv-initials">PL</span></div>
        <div>
          <div class="psv-title">Pierre Laberge, Ph.D.</div>
          <div class="psv-subtitle">VP Sciences de la vente · PSV</div>
        </div>
        <button id="psv-chat-close" aria-label="Fermer">✕</button>
      </div>
      <div id="psv-chat-messages"></div>
      <div id="psv-quick-replies"></div>
      <div id="psv-chat-input-area">
        <textarea id="psv-chat-input" rows="1" placeholder="Posez votre question…" aria-label="Message"></textarea>
        <button id="psv-chat-send" aria-label="Envoyer">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // ── State ───────────────────────────────────────────────────────────────────
  const messages = [];
  let isOpen = false;
  let isLoading = false;
  let greeted = false;

  const chatWindow = document.getElementById("psv-chat-window");
  const chatMessages = document.getElementById("psv-chat-messages");
  const chatInput = document.getElementById("psv-chat-input");
  const chatSend = document.getElementById("psv-chat-send");
  const quickReplies = document.getElementById("psv-quick-replies");
  const chatBtn = document.getElementById("psv-chat-btn");
  const chatClose = document.getElementById("psv-chat-close");

  const QUICK_REPLIES = [
    "C'est quoi le PSV ?",
    "Différence Essentiel vs Stratégique",
    "Combien ça coûte ?",
    "Voir un exemple de rapport",
    "Comment commander ?",
  ];

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function addMessage(text, role) {
    const div = document.createElement("div");
    div.className = `psv-msg psv-${role}`;
    div.innerHTML = text.replace(/\n/g, "<br>").replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>'
    );
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "psv-typing";
    div.id = "psv-typing-indicator";
    div.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById("psv-typing-indicator");
    if (el) el.remove();
  }

  function showQuickReplies(replies) {
    quickReplies.innerHTML = "";
    replies.forEach((r) => {
      const btn = document.createElement("button");
      btn.className = "psv-qr";
      btn.textContent = r;
      btn.onclick = () => sendMessage(r);
      quickReplies.appendChild(btn);
    });
  }

  function clearQuickReplies() {
    quickReplies.innerHTML = "";
  }

  // ── Send message ─────────────────────────────────────────────────────────────
  async function sendMessage(text) {
    text = (text || chatInput.value).trim();
    if (!text || isLoading) return;

    chatInput.value = "";
    chatInput.style.height = "auto";
    clearQuickReplies();
    isLoading = true;
    chatSend.disabled = true;

    messages.push({ role: "user", content: text });
    addMessage(text, "user");
    showTyping();

    try {
      const res = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      const data = await res.json();
      hideTyping();

      if (data.reply) {
        messages.push({ role: "assistant", content: data.reply });
        addMessage(data.reply, "bot");
      } else {
        addMessage("Désolé, une erreur s'est produite. Réessayez ou écrivez-nous à info@psv-global.com", "bot");
      }
    } catch {
      hideTyping();
      addMessage("Impossible de joindre le serveur. Vérifiez votre connexion ou écrivez-nous à info@psv-global.com", "bot");
    }

    isLoading = false;
    chatSend.disabled = false;
    chatInput.focus();
  }

  // ── Open / Close ─────────────────────────────────────────────────────────────
  function openChat() {
    isOpen = true;
    chatWindow.classList.remove("psv-hidden");
    chatInput.focus();

    if (!greeted) {
      greeted = true;
      setTimeout(() => {
        addMessage("Bonjour ! 👋 Je suis l'assistant du <strong>PSV — Profil de Succès en Vente</strong>.<br><br>Comment puis-je vous aider aujourd'hui ?", "bot");
        showQuickReplies(QUICK_REPLIES);
      }, 300);
    }
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.add("psv-hidden");
  }

  // ── Events ───────────────────────────────────────────────────────────────────
  chatBtn.addEventListener("click", () => (isOpen ? closeChat() : openChat()));
  chatClose.addEventListener("click", closeChat);

  chatSend.addEventListener("click", () => sendMessage());
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  chatInput.addEventListener("input", () => {
    chatInput.style.height = "auto";
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + "px";
  });
})();
