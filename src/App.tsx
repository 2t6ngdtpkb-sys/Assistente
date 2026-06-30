import { useState, useRef, useEffect, useCallback } from "react";

/* ----------------------------- i18n ----------------------------- */

const LANGUAGES = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

const UI_TEXT = {
  it: {
    placeholder: "Scrivi un messaggio...",
    welcome: "Ciao. Sono Astra, la tua intelligenza artificiale personale. Come posso aiutarti oggi?",
    title: "AstraAI", newChat: "Nuova conversazione", today: "Oggi",
    advanced: "Astra Pro", advancedDesc: "Ragionamento avanzato per problemi complessi",
    deepResearch: "Ricerca approfondita", exportLabel: "Esporta conversazione",
    upgrade: "Passa a Pro", upgradeTitle: "Sblocca Astra Pro",
    upgradeBody: "Accedi al livello di ragionamento più avanzato di Astra: analisi più profonde, risposte più precise e priorità di elaborazione.",
    upgradeCta: "Attiva Astra Pro", maybeLater: "Forse più tardi",
    voiceCall: "Chiamata vocale", listening: "In ascolto...", speaking: "Sta rispondendo...",
    tapToSpeak: "Tocca per parlare", mutedLabel: "Microfono disattivato", endCall: "Termina chiamata", connecting: "Connessione...",
    proBadge: "PRO", error: "Segnale perso. Riprova la trasmissione.",
    micUnsupported: "Il riconoscimento vocale non è supportato su questo browser.",
    attach: "Allega file", generateImage: "Genera immagine", generatingImage: "Sto generando l'immagine...",
    removeAttachment: "Rimuovi allegato", attachError: "Impossibile caricare il file.",
    imageError: "Impossibile generare l'immagine.", imagePromptPlaceholder: "Descrivi l'immagine da generare...",
  },
  en: {
    placeholder: "Send a message...",
    welcome: "Hello. I'm Astra, your personal artificial intelligence. How can I help you today?",
    title: "AstraAI", newChat: "New conversation", today: "Today",
    advanced: "Astra Pro", advancedDesc: "Advanced reasoning for complex problems",
    deepResearch: "Deep research", exportLabel: "Export conversation",
    upgrade: "Upgrade to Pro", upgradeTitle: "Unlock Astra Pro",
    upgradeBody: "Get Astra's most advanced reasoning tier: deeper analysis, sharper answers, and priority processing.",
    upgradeCta: "Activate Astra Pro", maybeLater: "Maybe later",
    voiceCall: "Voice call", listening: "Listening...", speaking: "Responding...",
    tapToSpeak: "Tap to speak", mutedLabel: "Microphone muted", endCall: "End call", connecting: "Connecting...",
    proBadge: "PRO", error: "Connection lost. Please try again.",
    micUnsupported: "Speech recognition isn't supported in this browser.",
    attach: "Attach file", generateImage: "Generate image", generatingImage: "Generating image...",
    removeAttachment: "Remove attachment", attachError: "Couldn't upload the file.",
    imageError: "Couldn't generate the image.", imagePromptPlaceholder: "Describe the image to generate...",
  },
  es: {
    placeholder: "Envía un mensaje...",
    welcome: "Hola. Soy Astra, tu inteligencia artificial personal. ¿En qué puedo ayudarte hoy?",
    title: "AstraAI", newChat: "Nueva conversación", today: "Hoy",
    advanced: "Astra Pro", advancedDesc: "Razonamiento avanzado para problemas complejos",
    deepResearch: "Investigación profunda", exportLabel: "Exportar conversación",
    upgrade: "Pasar a Pro", upgradeTitle: "Desbloquea Astra Pro",
    upgradeBody: "Accede al nivel de razonamiento más avanzado de Astra: análisis más profundos, respuestas más precisas y procesamiento prioritario.",
    upgradeCta: "Activar Astra Pro", maybeLater: "Quizás más tarde",
    voiceCall: "Llamada de voz", listening: "Escuchando...", speaking: "Respondiendo...",
    tapToSpeak: "Toca para hablar", mutedLabel: "Micrófono silenciado", endCall: "Finalizar llamada", connecting: "Conectando...",
    proBadge: "PRO", error: "Señal perdida. Inténtalo de nuevo.",
    micUnsupported: "El reconocimiento de voz no es compatible con este navegador.",
  },
  fr: {
    placeholder: "Envoyez un message...",
    welcome: "Bonjour. Je suis Astra, votre intelligence artificielle personnelle. Comment puis-je vous aider aujourd'hui ?",
    title: "AstraAI", newChat: "Nouvelle conversation", today: "Aujourd'hui",
    advanced: "Astra Pro", advancedDesc: "Raisonnement avancé pour les problèmes complexes",
    deepResearch: "Recherche approfondie", exportLabel: "Exporter la conversation",
    upgrade: "Passer à Pro", upgradeTitle: "Débloquez Astra Pro",
    upgradeBody: "Accédez au niveau de raisonnement le plus avancé de Astra : analyses plus poussées, réponses plus précises et traitement prioritaire.",
    upgradeCta: "Activer Astra Pro", maybeLater: "Plus tard",
    voiceCall: "Appel vocal", listening: "À l'écoute...", speaking: "Répond...",
    tapToSpeak: "Touchez pour parler", mutedLabel: "Micro coupé", endCall: "Terminer l'appel", connecting: "Connexion...",
    proBadge: "PRO", error: "Signal perdu. Veuillez réessayer.",
    micUnsupported: "La reconnaissance vocale n'est pas prise en charge par ce navigateur.",
  },
  de: {
    placeholder: "Nachricht senden...",
    welcome: "Hallo. Ich bin Astra, deine persönliche künstliche Intelligenz. Wie kann ich dir heute helfen?",
    title: "AstraAI", newChat: "Neue Unterhaltung", today: "Heute",
    advanced: "Astra Pro", advancedDesc: "Erweitertes Reasoning für komplexe Probleme",
    deepResearch: "Tiefenrecherche", exportLabel: "Unterhaltung exportieren",
    upgrade: "Auf Pro upgraden", upgradeTitle: "Astra Pro freischalten",
    upgradeBody: "Erhalte Zugriff auf Astras fortschrittlichste Reasoning-Stufe: tiefere Analysen, präzisere Antworten und priorisierte Verarbeitung.",
    upgradeCta: "Astra Pro aktivieren", maybeLater: "Vielleicht später",
    voiceCall: "Sprachanruf", listening: "Hört zu...", speaking: "Antwortet...",
    tapToSpeak: "Zum Sprechen tippen", mutedLabel: "Mikrofon stummgeschaltet", endCall: "Anruf beenden", connecting: "Verbindung...",
    proBadge: "PRO", error: "Verbindung verloren. Bitte erneut versuchen.",
    micUnsupported: "Spracherkennung wird in diesem Browser nicht unterstützt.",
  },
  pt: {
    placeholder: "Envia uma mensagem...",
    welcome: "Olá. Sou a Astra, a tua inteligência artificial pessoal. Como posso ajudar-te hoje?",
    title: "AstraAI", newChat: "Astra conversa", today: "Hoje",
    advanced: "Astra Pro", advancedDesc: "Raciocínio avançado para problemas complexos",
    deepResearch: "Pesquisa aprofundada", exportLabel: "Exportar conversa",
    upgrade: "Mudar para Pro", upgradeTitle: "Desbloqueia o Astra Pro",
    upgradeBody: "Acede ao nível de raciocínio mais avançado da Astra: análises mais profundas, respostas mais precisas e processamento prioritário.",
    upgradeCta: "Ativar Astra Pro", maybeLater: "Talvez mais tarde",
    voiceCall: "Chamada de voz", listening: "A ouvir...", speaking: "A responder...",
    tapToSpeak: "Toca para falar", mutedLabel: "Microfone mudo", endCall: "Terminar chamada", connecting: "A ligar...",
    proBadge: "PRO", error: "Sinal perdido. Tenta novamente.",
    micUnsupported: "O reconhecimento de voz não é suportado neste navegador.",
  },
  ja: {
    placeholder: "メッセージを送信...",
    welcome: "こんにちは。私はあなた専用のAI、Astraです。今日は何をお手伝いしましょうか？",
    title: "AstraAI", newChat: "新しい会話", today: "今日",
    advanced: "Astra Pro", advancedDesc: "複雑な問題のための高度な推論",
    deepResearch: "ディープリサーチ", exportLabel: "会話をエクスポート",
    upgrade: "Proにアップグレード", upgradeTitle: "Astra Proを解除",
    upgradeBody: "Astraの最も高度な推論レベルにアクセス：より深い分析、より的確な回答、優先処理。",
    upgradeCta: "Astra Proを有効化", maybeLater: "また後で",
    voiceCall: "音声通話", listening: "聞いています...", speaking: "応答中...",
    tapToSpeak: "タップして話す", mutedLabel: "マイクがミュートされています", endCall: "通話を終了", connecting: "接続中...",
    proBadge: "PRO", error: "接続が失われました。もう一度お試しください。",
    micUnsupported: "このブラウザでは音声認識がサポートされていません。",
  },
  zh: {
    placeholder: "发送消息...",
    welcome: "你好，我是 Astra，你的专属人工智能。今天我能帮你什么？",
    title: "AstraAI", newChat: "新对话", today: "今天",
    advanced: "Astra Pro", advancedDesc: "面向复杂问题的高级推理",
    deepResearch: "深度研究", exportLabel: "导出对话",
    upgrade: "升级到 Pro", upgradeTitle: "解锁 Astra Pro",
    upgradeBody: "获取 Astra 最先进的推理能力：更深入的分析、更精准的回答和优先处理。",
    upgradeCta: "激活 Astra Pro", maybeLater: "暂不需要",
    voiceCall: "语音通话", listening: "正在聆听...", speaking: "正在回答...",
    tapToSpeak: "点按说话", mutedLabel: "麦克风已静音", endCall: "结束通话", connecting: "连接中...",
    proBadge: "PRO", error: "连接已断开，请重试。",
    micUnsupported: "此浏览器不支持语音识别。",
  },
  ar: {
    placeholder: "أرسل رسالة...",
    welcome: "مرحبًا، أنا نوفا، ذكاؤك الاصطناعي الشخصي. كيف يمكنني مساعدتك اليوم؟",
    title: "AstraAI", newChat: "محادثة جديدة", today: "اليوم",
    advanced: "Astra Pro", advancedDesc: "استدلال متقدم للمشكلات المعقدة",
    deepResearch: "بحث متعمق", exportLabel: "تصدير المحادثة",
    upgrade: "الترقية إلى Pro", upgradeTitle: "افتح Astra Pro",
    upgradeBody: "احصل على أعلى مستوى استدلال لدى نوفا: تحليل أعمق، إجابات أدق، ومعالجة ذات أولوية.",
    upgradeCta: "تفعيل Astra Pro", maybeLater: "ربما لاحقًا",
    voiceCall: "مكالمة صوتية", listening: "يستمع...", speaking: "يرد...",
    tapToSpeak: "اضغط للتحدث", mutedLabel: "الميكروفون صامت", endCall: "إنهاء المكالمة", connecting: "جارٍ الاتصال...",
    proBadge: "PRO", error: "تم فقدان الاتصال. حاول مرة أخرى.",
    micUnsupported: "التعرف على الصوت غير مدعوم في هذا المتصفح.",
  },
  ru: {
    placeholder: "Отправить сообщение...",
    welcome: "Здравствуйте. Я Astra, ваш персональный искусственный интеллект. Чем могу помочь сегодня?",
    title: "AstraAI", newChat: "Новый разговор", today: "Сегодня",
    advanced: "Astra Pro", advancedDesc: "Продвинутое мышление для сложных задач",
    deepResearch: "Глубокое исследование", exportLabel: "Экспортировать разговор",
    upgrade: "Перейти на Pro", upgradeTitle: "Откройте Astra Pro",
    upgradeBody: "Получите доступ к самому продвинутому уровню мышления Astra: более глубокий анализ, точные ответы и приоритетная обработка.",
    upgradeCta: "Активировать Astra Pro", maybeLater: "Может быть позже",
    voiceCall: "Голосовой звонок", listening: "Слушаю...", speaking: "Отвечает...",
    tapToSpeak: "Нажмите, чтобы говорить", mutedLabel: "Микрофон отключён", endCall: "Завершить звонок", connecting: "Соединение...",
    proBadge: "PRO", error: "Сигнал потерян. Попробуйте снова.",
    micUnsupported: "Распознавание речи не поддерживается этим браузером.",
  },
};

const SYSTEM_PROMPT = (lang, advanced, deepResearch) =>
  `You are Astra, a precise, insightful AI assistant built for professional use. Always respond EXCLUSIVELY in the language with code "${lang}" (${LANGUAGES.find((l) => l.code === lang)?.label}). ${
    advanced
      ? "You are running in Astra Pro mode: reason carefully and thoroughly through complex, multi-step problems before answering, surface trade-offs and edge cases, and give the most rigorous, well-structured answer possible."
      : "Be clear, helpful, and concise."
  }${deepResearch ? " Deep research mode is active: break the question down, consider multiple angles and sources of evidence, and deliver a structured, thorough answer with clear sections rather than a short reply." : ""}`;

/* ----------------------------- helpers ----------------------------- */

const SpeechRecognitionAPI =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

function speak(text, lang, onEnd) {
  if (typeof window === "undefined" || !window.speechSynthesis) { onEnd?.(); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  const langMap = { it: "it-IT", en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", pt: "pt-BR", ja: "ja-JP", zh: "zh-CN", ar: "ar-SA", ru: "ru-RU" };
  utter.lang = langMap[lang] || "en-US";
  utter.rate = 1.02;
  utter.onend = () => onEnd?.();
  utter.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utter);
}

/* ----------------------------- app ----------------------------- */

/* A four-point "sparkle" mark — Astra is Latin for star, so the brand glyph
   is an asymmetric star-burst rather than a literal letter. */
function AstraMark({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 0C12 0 12.7 8.6 15.7 11.6C18.7 14.6 24 12 24 12C24 12 18.7 14.6 15.7 17.4C12.7 20.2 12 24 12 24C12 24 11.3 20.2 8.3 17.4C5.3 14.6 0 12 0 12C0 12 5.3 14.6 8.3 11.6C11.3 8.6 12 0 12 0Z"
        fill={color}
      />
      <circle cx="20" cy="3.2" r="1.4" fill={color} opacity="0.55" />
    </svg>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const [isPro, setIsPro] = useState(false);
  const [deepResearch, setDeepResearch] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceState, setVoiceState] = useState("idle"); // idle | listening | thinking | speaking
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [attachments, setAttachments] = useState([]); // {id, name, mediaType, dataUrl, base64}
  const [imageMode, setImageMode] = useState(false);
  const [attachError, setAttachError] = useState("");
  const fileInputRef = useRef(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const ui = { ...UI_TEXT.en, ...UI_TEXT[lang] };

  useEffect(() => {
    setMessages([{ role: "assistant", content: UI_TEXT[lang].welcome }]);
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askAstra = useCallback(
    async (history) => {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT(lang, isPro, deepResearch),
          messages: history.map((m) => {
            if (m.attachments && m.attachments.length > 0) {
              const blocks = [];
              m.attachments.forEach((a) => {
                if (a.isImage) {
                  blocks.push({ type: "image", source: { type: "base64", media_type: a.mediaType, data: a.base64 } });
                } else {
                  blocks.push({ type: "document", source: { type: "base64", media_type: a.mediaType, data: a.base64 }, title: a.name });
                }
              });
              if (m.content) blocks.push({ type: "text", text: m.content });
              return { role: m.role, content: blocks };
            }
            return { role: m.role, content: m.content };
          }),
        }),
      });
      const data = await response.json();
      return data.reply || "...";
    },
    [lang, isPro, deepResearch]
  );

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    files.forEach((file) => {
      if (file.size > 8 * 1024 * 1024) { setAttachError(ui.attachError); return; }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        const base64 = String(dataUrl).split(",")[1] || "";
        setAttachments((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).slice(2),
            name: file.name,
            mediaType: file.type || "application/octet-stream",
            isImage: file.type.startsWith("image/"),
            dataUrl,
            base64,
          },
        ]);
      };
      reader.onerror = () => setAttachError(ui.attachError);
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id) => setAttachments((prev) => prev.filter((a) => a.id !== id));

  const generateImage = async (prompt) => {
    const response = await fetch("/.netlify/functions/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    // expects { imageUrl } or { base64, mediaType }
    if (data.imageUrl) return data.imageUrl;
    if (data.base64) return `data:${data.mediaType || "image/png"};base64,${data.base64}`;
    throw new Error("no-image");
  };

  const sendMessage = async () => {
    const text = input.trim();
    if ((!text && attachments.length === 0) || loading) return;
    const pendingAttachments = attachments;
    setInput("");
    setAttachments([]);
    setAttachError("");

    if (imageMode) {
      const newMessages = [...messages, { role: "user", content: text || ui.generateImage }];
      setMessages(newMessages);
      setLoading(true);
      try {
        const imageUrl = await generateImage(text);
        setMessages([...newMessages, { role: "assistant", content: "", imageUrl, pro: isPro }]);
      } catch {
        setMessages([...newMessages, { role: "assistant", content: ui.imageError }]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 80);
      }
      return;
    }

    const newMessages = [...messages, { role: "user", content: text, attachments: pendingAttachments }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const reply = await askAstra(newMessages);
      setMessages([...newMessages, { role: "assistant", content: reply, pro: isPro }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: ui.error }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const clearChat = () => { setMessages([{ role: "assistant", content: ui.welcome }]); setAttachments([]); setImageMode(false); setAttachError(""); };
  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const currentLang = LANGUAGES.find((l) => l.code === lang);

  const handleProToggle = () => { if (!isPro) setShowUpgrade(true); else { setIsPro(false); setDeepResearch(false); } };
  const confirmUpgrade = () => { setIsPro(true); setShowUpgrade(false); };
  const toggleDeepResearch = () => { if (!isPro) { setShowUpgrade(true); return; } setDeepResearch((v) => !v); };

  const exportChat = () => {
    if (!isPro) { setShowUpgrade(true); return; }
    const text = messages.map((m) => `${m.role === "user" ? "Tu" : "Astra"}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "astra-conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- voice call flow (Pro only) ---- */
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const rafRef = useRef(null);
  const orbRef = useRef(null);
  const ringRef = useRef(null);
  const barRefs = useRef([]);
  const [muted, setMuted] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const callTimerRef = useRef(null);
  const [lastReply, setLastReply] = useState("");

  const stopMicLevel = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }
    analyserRef.current = null;
    resetVisuals();
  };

  const resetVisuals = () => {
    if (orbRef.current) orbRef.current.style.transform = "scale(1)";
    if (ringRef.current) { ringRef.current.style.transform = "scale(1)"; ringRef.current.style.opacity = "0.35"; }
    barRefs.current.forEach((b) => { if (b) b.style.transform = "scaleY(0.25)"; });
  };

  const startMicLevel = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      const data = new Uint8Array(analyser.frequencyBinCount);

      const loop = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length / 255; // 0..1
        const level = Math.min(1, avg * 2.6);
        if (orbRef.current) orbRef.current.style.transform = `scale(${1 + level * 0.22})`;
        if (ringRef.current) { ringRef.current.style.transform = `scale(${1 + level * 0.5})`; ringRef.current.style.opacity = String(0.25 + level * 0.5); }
        barRefs.current.forEach((b, i) => {
          if (!b) return;
          const jitter = 0.55 + Math.sin(Date.now() / 130 + i * 1.3) * 0.18;
          b.style.transform = `scaleY(${Math.max(0.18, Math.min(1, level * jitter * 1.8))})`;
        });
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      /* mic permission denied — visuals fall back to ambient animation only */
    }
  };

  const startVoiceCall = () => {
    if (!isPro) { setShowUpgrade(true); return; }
    setVoiceOpen(true);
    setVoiceTranscript("");
    setLastReply("");
    setCallSeconds(0);
    callTimerRef.current = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    if (!SpeechRecognitionAPI) { setVoiceState("unsupported"); return; }
    startMicLevel();
    beginListening();
  };

  const beginListening = () => {
    if (muted) return;
    setVoiceState("listening");
    const rec = new SpeechRecognitionAPI();
    const langMap = { it: "it-IT", en: "en-US", es: "es-ES", fr: "fr-FR", de: "de-DE", pt: "pt-BR", ja: "ja-JP", zh: "zh-CN", ar: "ar-SA", ru: "ru-RU" };
    rec.lang = langMap[lang] || "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join("");
      setVoiceTranscript(transcript);
    };
    rec.onerror = () => setVoiceState("idle");
    rec.onend = async () => {
      setVoiceTranscript((current) => {
        if (current.trim()) handleVoiceResult(current.trim());
        return current;
      });
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const handleVoiceResult = async (text) => {
    setVoiceState("thinking");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    try {
      const reply = await askAstra(newMessages);
      setMessages((m) => [...m, { role: "assistant", content: reply, pro: isPro }]);
      setLastReply(reply);
      setVoiceState("speaking");
      speak(reply, lang, () => {
        setVoiceTranscript("");
        if (recognitionRef.current && !muted) beginListening();
        else setVoiceState("idle");
      });
    } catch {
      setVoiceState("idle");
    }
  };

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      if (next) { recognitionRef.current?.stop(); setVoiceState("idle"); }
      else if (voiceState !== "speaking" && voiceState !== "thinking") beginListening();
      return next;
    });
  };

  const endVoiceCall = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    window.speechSynthesis?.cancel();
    stopMicLevel();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setVoiceOpen(false);
    setVoiceState("idle");
    setMuted(false);
  };

  const formatDuration = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  /* ----------------------------- styles (tokens) ----------------------------- */
  const ink = "#15161A";
  const inkSoft = "#6B6E76";
  const hairline = "#E7E7EA";
  const surface = "#FFFFFF";
  const surfaceMute = "#FAFAFA";
  const accent = "#3D4CF5"; // primary indigo — action, identity
  const accentSoft = "#EEF0FE";
  const gold = "#A9821C"; // pro tier accent, deliberately distinct from primary
  const goldSoft = "#FBF4E2";

  return (
    <div style={{ minHeight: "100vh", background: surfaceMute, display: "flex", fontFamily: "'Inter', 'Helvetica Neue', system-ui, sans-serif", color: ink, overflowX: "hidden", width: "100%", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap');
        html, body { margin: 0; overflow-x: hidden; max-width: 100%; }
        * { box-sizing: border-box; min-width: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #D8D9DE; border-radius: 8px; }
        textarea::placeholder { color: #A4A6AD; }
        @keyframes orbBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        @keyframes orbListen { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(61,76,245,0.25);} 50% { transform: scale(1.05); box-shadow: 0 0 0 18px rgba(61,76,245,0);} }
        @keyframes dotBounce { 0%,80%,100% { transform: translateY(0); opacity:.4; } 40% { transform: translateY(-5px); opacity:1; } }
        @keyframes fadeIn { from { opacity:0; transform: translateY(4px);} to { opacity:1; transform: translateY(0);} }
        @keyframes modalIn { from { opacity:0; transform: translateY(8px) scale(0.98);} to { opacity:1; transform: translateY(0) scale(1);} }
        @keyframes ringExpand { 0% { transform: scale(0.85); opacity: 0.5; } 100% { transform: scale(1.35); opacity: 0; } }
        @keyframes barSpeak0 { 0%,100% { transform: scaleY(0.3);} 50% { transform: scaleY(0.95);} }
        @keyframes barSpeak1 { 0%,100% { transform: scaleY(0.55);} 45% { transform: scaleY(1);} 70% { transform: scaleY(0.4);} }
        @keyframes barSpeak2 { 0%,100% { transform: scaleY(0.4);} 55% { transform: scaleY(0.85);} }
        .astra-bars.speaking > div:nth-child(1) { animation: barSpeak1 0.9s infinite ease-in-out; }
        .astra-bars.speaking > div:nth-child(2) { animation: barSpeak0 0.7s infinite ease-in-out; }
        .astra-bars.speaking > div:nth-child(3) { animation: barSpeak2 1.05s infinite ease-in-out; }
        .astra-bars.speaking > div:nth-child(4) { animation: barSpeak0 0.8s infinite ease-in-out; }
        .astra-bars.speaking > div:nth-child(5) { animation: barSpeak1 0.95s infinite ease-in-out; }
        .astra-sidebar { transition: transform .25s ease; }
        @media (max-width: 768px) {
          .astra-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0; z-index: 400;
            width: 82vw; max-width: 300px;
            transform: translateX(-100%);
            box-shadow: 0 0 40px rgba(20,20,30,0.18);
          }
          .astra-sidebar.open { transform: translateX(0); }
          .lbl-text { display: none; }
        }
        .astra-overlay { display: none; }
        @media (max-width: 768px) {
          .astra-overlay.open { display: block; position: fixed; inset: 0; background: rgba(15,15,20,0.4); z-index: 390; }
          .astra-px { padding-left: 14px !important; padding-right: 14px !important; }
        }
      `}</style>

      {/* backdrop for mobile sidebar */}
      <div className={`astra-overlay ${sidebarOpen && isMobile ? "open" : ""}`} onClick={() => setSidebarOpen(false)} />

      {/* ---------------- Sidebar ---------------- */}
      <aside className={`astra-sidebar ${sidebarOpen ? "open" : ""}`} style={{ width: 264, background: surfaceMute, borderRight: `1px solid ${hairline}`, display: "flex", flexDirection: "column", padding: "18px 14px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 6px 22px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><AstraMark size={16} /></div>
          <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>{ui.title}</span>
        </div>

        <button onClick={() => { clearChat(); if (isMobile) setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: `1px solid ${hairline}`, background: surface, color: ink, fontSize: 13.5, fontWeight: 600, cursor: "pointer", marginBottom: 18 }}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> {ui.newChat}
        </button>

        <div style={{ fontSize: 11, fontWeight: 700, color: inkSoft, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 6px 8px" }}>{ui.today}</div>
        <div style={{ padding: "8px 12px", borderRadius: 10, background: accentSoft, color: accent, fontSize: 13, fontWeight: 600, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {messages.find((m) => m.role === "user")?.content || ui.welcome.slice(0, 28)}
        </div>

        <div style={{ flex: 1 }} />

        {/* Pro toggle card */}
        <div style={{ border: `1px solid ${isPro ? gold : hairline}`, background: isPro ? goldSoft : surface, borderRadius: 14, padding: 14, marginBottom: 10, transition: "all .15s" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: isPro ? "#8A6A12" : ink }}>{ui.advanced}</span>
              <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: "0.04em", color: "#fff", background: gold, padding: "2px 6px", borderRadius: 6 }}>PRO</span>
            </div>
            <button onClick={handleProToggle} aria-label="toggle pro" style={{ width: 36, height: 21, borderRadius: 20, border: "none", cursor: "pointer", background: isPro ? gold : "#D8D9DE", position: "relative", transition: "background .15s" }}>
              <span style={{ position: "absolute", top: 2, left: isPro ? 17 : 2, width: 17, height: 17, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "left .15s" }} />
            </button>
          </div>
          <div style={{ fontSize: 11.5, color: inkSoft, marginTop: 6, lineHeight: 1.4 }}>{ui.advancedDesc}</div>
        </div>
      </aside>

      {/* ---------------- Main ---------------- */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", background: surface, position: "relative" }}>
        <header style={{ height: 60, borderBottom: `1px solid ${hairline}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 0 12px", flexShrink: 0, position: "relative", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <button onClick={() => setSidebarOpen((v) => !v)} aria-label="menu" style={{ display: isMobile ? "flex" : "none", width: 34, height: 34, alignItems: "center", justifyContent: "center", border: `1px solid ${hairline}`, background: surfaceMute, borderRadius: 9, cursor: "pointer", flexShrink: 0 }}>
              <span style={{ fontSize: 15, lineHeight: 1 }}>☰</span>
            </button>
            <span style={{ fontWeight: 700, fontSize: 14.5, whiteSpace: "nowrap" }}>{ui.title}</span>
            {isPro && <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: gold, padding: "2px 7px", borderRadius: 6, letterSpacing: "0.03em", flexShrink: 0 }}>{ui.proBadge}</span>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            {/* language switcher */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 999, border: `1px solid ${hairline}`, background: surfaceMute, cursor: "pointer", fontSize: 13, fontWeight: 600, color: ink, whiteSpace: "nowrap" }}>
                <span>{currentLang?.flag}</span> <span className="lbl-text">{currentLang?.label}</span> <span style={{ color: inkSoft, fontSize: 10 }}>▾</span>
              </button>
              {showLangMenu && (
                <div style={{ position: "fixed", top: 62, right: 12, background: surface, border: `1px solid ${hairline}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 12px 32px rgba(20,20,30,0.12)", zIndex: 150, minWidth: 170, maxWidth: "calc(100vw - 24px)", maxHeight: 320, overflowY: "auto" }}>
                  {LANGUAGES.map((l) => (
                    <div key={l.code} onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                      style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer", background: l.code === lang ? accentSoft : "transparent", color: l.code === lang ? accent : ink, fontWeight: l.code === lang ? 600 : 400 }}>
                      {l.flag} {l.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={startVoiceCall} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 999, border: `1px solid ${isPro ? gold : hairline}`, background: isPro ? goldSoft : surfaceMute, cursor: "pointer", fontSize: 13, fontWeight: 600, color: isPro ? "#8A6A12" : ink, whiteSpace: "nowrap" }}>
              {isPro ? <span style={{ width: 7, height: 7, borderRadius: "50%", background: gold }} /> : <span style={{ fontSize: 11 }}>🔒</span>}
              <span className="lbl-text">{ui.voiceCall}</span>
            </button>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "28px 0" }} onClick={() => setShowLangMenu(false)}>
          <div className="astra-px" style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: 22 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 12, animation: "fadeIn .25s ease" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 700,
                  background: m.role === "user" ? "#EDEDF1" : (m.pro ? gold : ink), color: m.role === "user" ? ink : "#fff" }}>
                  {m.role === "user" ? "Tu" : <AstraMark size={13} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: ink }}>{m.role === "user" ? "" : ui.title}</span>
                    {m.role === "assistant" && m.pro && <span style={{ fontSize: 9, fontWeight: 800, color: "#fff", background: gold, padding: "1.5px 5px", borderRadius: 5 }}>PRO</span>}
                  </div>
                  {m.attachments && m.attachments.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                      {m.attachments.map((a) => a.isImage ? (
                        <img key={a.id} src={a.dataUrl} alt={a.name} style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 10, border: `1px solid ${hairline}` }} />
                      ) : (
                        <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 10, border: `1px solid ${hairline}`, background: surfaceMute, fontSize: 12, fontWeight: 600, color: inkSoft, maxWidth: 160, overflow: "hidden" }}>
                          <span>📎</span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.imageUrl && (
                    <img src={m.imageUrl} alt="" style={{ maxWidth: "100%", width: 320, borderRadius: 14, border: `1px solid ${hairline}`, marginBottom: m.content ? 8 : 0 }} />
                  )}
                  {m.content && <div style={{ fontSize: 14.5, lineHeight: 1.7, color: "#27282D", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.content}</div>}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: isPro ? gold : ink, display: "flex", alignItems: "center", justifyContent: "center" }}><AstraMark size={13} /></div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, paddingTop: 6 }}>
                  {[0, 1, 2].map((j) => <div key={j} style={{ width: 5.5, height: 5.5, borderRadius: "50%", background: inkSoft, animation: `dotBounce 1.3s ${j * 0.15}s infinite ease-in-out` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="astra-px" style={{ borderTop: `1px solid ${hairline}`, padding: "14px 24px 20px", flexShrink: 0 }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <button onClick={() => fileInputRef.current?.click()} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${hairline}`, background: surfaceMute, color: ink,
              }}>
                📎 {ui.attach}
              </button>
              <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} style={{ display: "none" }} accept="image/*,.pdf,.txt,.md,.csv,.docx" />
              <button onClick={() => setImageMode((v) => !v)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${imageMode ? accent : hairline}`, background: imageMode ? accentSoft : surfaceMute, color: imageMode ? accent : ink,
              }}>
                🖼️ {ui.generateImage}
              </button>
              <button onClick={toggleDeepResearch} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${deepResearch ? gold : hairline}`, background: deepResearch ? goldSoft : surfaceMute, color: deepResearch ? "#8A6A12" : (isPro ? ink : inkSoft),
              }}>
                {!isPro && <span style={{ fontSize: 11 }}>🔒</span>}
                {ui.deepResearch}
              </button>
              <button onClick={exportChat} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${hairline}`, background: surfaceMute, color: isPro ? ink : inkSoft,
              }}>
                {!isPro && <span style={{ fontSize: 11 }}>🔒</span>}
                {ui.exportLabel}
              </button>
            </div>
            {attachError && <div style={{ fontSize: 12, color: "#E5484D", marginBottom: 8 }}>{attachError}</div>}
            {attachments.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {attachments.map((a) => (
                  <div key={a.id} style={{ position: "relative" }}>
                    {a.isImage ? (
                      <img src={a.dataUrl} alt={a.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10, border: `1px solid ${hairline}` }} />
                    ) : (
                      <div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: `1px solid ${hairline}`, background: surfaceMute, fontSize: 18 }}>📄</div>
                    )}
                    <button onClick={() => removeAttachment(a.id)} aria-label={ui.removeAttachment} style={{
                      position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", border: "none", cursor: "pointer",
                      background: ink, color: "#fff", fontSize: 10, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, border: `1px solid ${hairline}`, borderRadius: 16, padding: "6px 6px 6px 16px", background: surfaceMute }}>
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder={imageMode ? ui.imagePromptPlaceholder : ui.placeholder} rows={1}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", fontFamily: "inherit", fontSize: 14.5, color: ink, padding: "10px 0", lineHeight: 1.5, maxHeight: 160 }}
                onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; }} />
              <button onClick={sendMessage} disabled={loading || (!input.trim() && attachments.length === 0)}
                style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, border: "none", cursor: loading || (!input.trim() && attachments.length === 0) ? "default" : "pointer",
                  background: loading || (!input.trim() && attachments.length === 0) ? "#E2E3E7" : ink, color: "#fff", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: inkSoft, marginTop: 8 }}>
              {imageMode ? ui.generateImage : deepResearch ? `${ui.advanced} · ${ui.deepResearch}` : isPro ? `${ui.advanced} · ${ui.advancedDesc}` : "AstraAI"}
            </div>
          </div>
        </div>
      </main>

      {/* ---------------- Upgrade modal ---------------- */}
      {showUpgrade && (
        <div onClick={() => setShowUpgrade(false)} style={{ position: "fixed", inset: 0, background: "rgba(20,20,25,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: surface, borderRadius: 20, padding: 28, maxWidth: 380, width: "100%", boxShadow: "0 24px 60px rgba(20,20,30,0.25)", animation: "modalIn .2s ease" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: goldSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: gold }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.01em" }}>{ui.upgradeTitle}</div>
            <div style={{ fontSize: 13.5, color: inkSoft, lineHeight: 1.6, marginBottom: 22 }}>{ui.upgradeBody}</div>
            <button onClick={confirmUpgrade} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "none", background: gold, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 8 }}>{ui.upgradeCta}</button>
            <button onClick={() => setShowUpgrade(false)} style={{ width: "100%", padding: "11px", borderRadius: 12, border: "none", background: "transparent", color: inkSoft, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{ui.maybeLater}</button>
          </div>
        </div>
      )}

      {/* ---------------- Live voice overlay (Pro) ---------------- */}
      {voiceOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "radial-gradient(ellipse 120% 70% at 50% 12%, #232651 0%, #11132b 45%, #07070f 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", color: "#fff", overflow: "hidden" }}>

          {/* ambient grid + glow */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "42px 42px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, #000 30%, transparent 75%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 520, height: 520, background: `radial-gradient(circle, ${gold}22 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />

          {/* top bar */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "26px 20px 0", position: "relative", zIndex: 2 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#0c0d16", background: `linear-gradient(90deg, ${gold}, #E8C766)`, padding: "4px 10px 4px 8px", borderRadius: 999 }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#0c0d16", color: gold, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>★</span>
              {ui.title} {ui.proBadge}
            </span>
            {voiceState !== "unsupported" && (
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em" }}>{formatDuration(callSeconds)}</span>
            )}
          </div>

          {/* center stage */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, width: "100%", padding: "0 24px" }}>

            <div style={{ position: "relative", width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
              {/* ambient outer rings */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", animation: "ringExpand 3s infinite ease-out" }} />
              <div style={{ position: "absolute", inset: 14, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.10)", animation: "ringExpand 3s 1s infinite ease-out" }} />
              {/* reactive ring driven by mic level */}
              <div ref={ringRef} style={{ position: "absolute", inset: 28, borderRadius: "50%", border: `1.5px solid ${voiceState === "speaking" ? gold : accent}`, opacity: 0.35, transition: "transform .08s linear, opacity .08s linear" }} />

              {/* waveform bars ring */}
              <div className={voiceState === "speaking" ? "astra-bars speaking" : "astra-bars"} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} ref={(el) => (barRefs.current[i] = el)} style={{
                    width: 4, height: 64, borderRadius: 4,
                    background: voiceState === "speaking" ? `linear-gradient(180deg, ${gold}, #fff0c2)` : `linear-gradient(180deg, ${accent}, #9aa6ff)`,
                    transform: "scaleY(0.25)", transformOrigin: "center", transition: voiceState === "speaking" ? "background .3s" : "transform .06s linear, background .3s",
                    animationDelay: `${i * 0.12}s`,
                  }} />
                ))}
              </div>

              {/* core orb */}
              <div ref={orbRef} style={{
                width: 108, height: 108, borderRadius: "50%", position: "relative", zIndex: 3,
                background: voiceState === "speaking" ? `radial-gradient(circle at 32% 30%, #FFE9AE, ${gold} 55%, #6b5316 100%)` : voiceState === "thinking" ? `radial-gradient(circle at 32% 30%, #4a4d6b, #1c1d33)` : `radial-gradient(circle at 32% 30%, #6f7bff, ${accent} 55%, #1c2090 100%)`,
                boxShadow: voiceState === "speaking" ? `0 0 50px ${gold}66` : `0 0 50px ${accent}55`,
                animation: voiceState === "thinking" ? "orbBreathe .9s infinite ease-in-out" : "none",
                transition: "transform .08s linear, background .3s, box-shadow .3s",
              }}>
                {voiceState === "thinking" ? (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    {[0, 1, 2].map((j) => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.85)", animation: `dotBounce 1.2s ${j * 0.15}s infinite ease-in-out` }} />)}
                  </div>
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AstraMark size={34} color="rgba(255,255,255,0.9)" />
                  </div>
                )}
              </div>
            </div>

            <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 10, minHeight: 22, letterSpacing: "-0.01em" }}>
              {voiceState === "unsupported" ? ui.micUnsupported
                : muted ? ui.mutedLabel
                : voiceState === "listening" ? ui.listening
                : voiceState === "thinking" ? ui.connecting
                : voiceState === "speaking" ? ui.speaking
                : ui.tapToSpeak}
            </div>

            <div style={{ maxWidth: 480, minHeight: 44, textAlign: "center", fontSize: 13.5, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", padding: "0 12px" }}>
              {voiceState === "listening" && voiceTranscript ? voiceTranscript
                : voiceState === "speaking" && lastReply ? lastReply
                : ""}
            </div>
          </div>

          {/* controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 22, paddingBottom: 52, position: "relative", zIndex: 2 }}>
            <button onClick={toggleMute} aria-label="mute" style={{
              width: 52, height: 52, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              border: `1px solid ${muted ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)"}`, background: muted ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)", color: "#fff",
            }}>{muted ? "🔇" : "🎙️"}</button>

            <button onClick={endVoiceCall} aria-label="end call" style={{ width: 64, height: 64, borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #FF6B6B, #E5484D)", color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(229,72,77,0.45)" }}>✕</button>

            <div style={{ width: 52 }} />
          </div>
        </div>
      )}
    </div>
  );
}
