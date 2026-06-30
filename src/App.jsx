import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "it", label: "🇮🇹 Italiano" },
  { code: "en", label: "🇬🇧 English" },
  { code: "es", label: "🇪🇸 Español" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "pt", label: "🇧🇷 Português" },
  { code: "ja", label: "🇯🇵 日本語" },
  { code: "zh", label: "🇨🇳 中文" },
  { code: "ar", label: "🇸🇦 العربية" },
  { code: "ru", label: "🇷🇺 Русский" },
];

const UI_TEXT = {
  it: { placeholder: "Scrivimi qualcosa...", welcome: "Ciao! Sono il tuo assistente personale. Come posso aiutarti oggi?", title: "Il Tuo Assistente" },
  en: { placeholder: "Write me something...", welcome: "Hello! I'm your personal assistant. How can I help you today?", title: "Your Assistant" },
  es: { placeholder: "Escríbeme algo...", welcome: "¡Hola! Soy tu asistente personal. ¿Cómo puedo ayudarte hoy?", title: "Tu Asistente" },
  fr: { placeholder: "Écris-moi quelque chose...", welcome: "Bonjour ! Je suis ton assistant personnel. Comment puis-je t'aider ?", title: "Ton Assistant" },
  de: { placeholder: "Schreib mir etwas...", welcome: "Hallo! Ich bin dein persönlicher Assistent. Wie kann ich dir helfen?", title: "Dein Assistent" },
  pt: { placeholder: "Escreve algo...", welcome: "Olá! Sou o teu assistente pessoal. Como posso ajudar-te hoje?", title: "O Teu Assistente" },
  ja: { placeholder: "何か書いてください...", welcome: "こんにちは！私はあなたの個人アシスタントです。今日はどのようにお手伝いできますか？", title: "あなたのアシスタント" },
  zh: { placeholder: "写点什么...", welcome: "你好！我是您的个人助手。今天我能帮您什么？", title: "您的助手" },
  ar: { placeholder: "اكتب لي شيئاً...", welcome: "مرحباً! أنا مساعدك الشخصي. كيف يمكنني مساعدتك اليوم؟", title: "مساعدك" },
  ru: { placeholder: "Напиши мне что-нибудь...", welcome: "Привет! Я твой личный ассистент. Чем могу помочь сегодня?", title: "Твой Ассистент" },
};

const GROQ_API_KEY = "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";

const SYSTEM_PROMPT = (lang) =>
  `You are an incredibly intelligent, warm, and helpful personal AI assistant. Always respond EXCLUSIVELY in the language with code "${lang}" (${LANGUAGES.find((l) => l.code === lang)?.label}). Be thorough, precise, creative, and friendly.`;

export default function App() {
  const [lang, setLang] = useState("it");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const ui = UI_TEXT[lang];

  useEffect(() => {
    setMessages([{ role: "assistant", content: UI_TEXT[lang].welcome }]);
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT(lang) },
            ...newMessages.map((m) => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 1000,
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || JSON.stringify(data);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Errore: " + e.message }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearChat = () => setMessages([{ role: "assistant", content: ui.welcome }]);
  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const currentLang = LANGUAGES.find((l) => l.code === lang);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "720px", height: "90vh", display: "flex", flexDirection: "column", borderRadius: "24px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", background: "rgba(15, 12, 41, 0.85)" }}>
        <div style={{ padding: "20px 24px", background: "linear-gradient(90deg, rgba(120,80,255,0.3), rgba(80,180,255,0.2))", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>✦</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>{ui.title}</div>
              <div style={{ color: "rgba(180,160,255,0.8)", fontSize: 12 }}>Powered by Groq · Always ready</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "6px 12px", borderRadius: "10px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                {currentLang?.label} <span style={{ opacity: 0.6 }}>▾</span>
              </button>
              {showLangMenu && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#1e1a3f", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", overflow: "hidden", zIndex: 100, minWidth: 160, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                  {LANGUAGES.map((l) => (
                    <div key={l.code} onClick={() => { setLang(l.code); setShowLangMenu(false); }} style={{ padding: "10px 16px", color: l.code === lang ? "#a78bfa" : "#ccc", cursor: "pointer", fontSize: 13, fontWeight: l.code === lang ? 600 : 400, background: l.code === lang ? "rgba(124,58,237,0.2)" : "transparent" }}>{l.label}</div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={clearChat} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)", padding: "6px 10px", borderRadius: "10px", cursor: "pointer", fontSize: 14 }}>✦</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", flexDirection: "column", gap: "16px" }} onClick={() => setShowLangMenu(false)}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 10 }}>
              {m.role === "assistant" && <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>}
              <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "rgba(255,255,255,0.07)", color: "#f0eeff", fontSize: 14.5, lineHeight: 1.65, border: m.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%
