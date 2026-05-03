import { useState, useRef, useEffect } from "react";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;600;700;800;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #C8A882;
  --bg2:       #D4B896;
  --cream:     #FDF5E8;
  --cream2:    #F5EAD4;
  --orange:    #E07832;
  --orange2:   #C96820;
  --dark:      #2A1F14;
  --mid:       #7A5C3C;
  --light:     #F0DFC0;
  --purple:    #8B7FD4;
  --green:     #7EC8A0;
  --pink:      #F0A0A0;
  --yellow:    #F5D060;
  --blue:      #78B4E0;
  --radius:    8px;
  --win-r:     10px;
}

body {
  background-color: var(--bg);
  background-image:
    radial-gradient(circle at 20% 20%, rgba(255,220,160,0.35) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(200,140,80,0.25) 0%, transparent 50%),
    repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.04) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.04) 40px);
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
  padding: 20px 16px 60px;
  display: flex; justify-content: center;
}

.desktop { display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 860px; }
.win { background: var(--cream); border: 2.5px solid var(--dark); border-radius: var(--win-r); overflow: hidden; box-shadow: 4px 4px 0 var(--dark); width: 100%; }
.win + .win { margin-top: 12px; }

.title-bar { background: var(--orange); padding: 7px 10px; display: flex; align-items: center; gap: 8px; border-bottom: 2.5px solid var(--dark); user-select: none; }
.tbar-btns { display: flex; gap: 5px; }
.tbar-btn { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--dark); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; color: var(--dark); flex-shrink: 0; }
.tbar-btn.close { background: #F56565; }
.tbar-btn.min   { background: var(--yellow); }
.tbar-btn.max   { background: var(--green); }
.tbar-title { flex: 1; text-align: center; font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; color: white; text-shadow: 1px 1px 0 rgba(0,0,0,0.3); letter-spacing: 0.5px; }

.win-body { padding: 14px; display: flex; flex-direction: column; gap: 12px; }

.toolbar { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--cream2); border-bottom: 2px solid var(--dark); }
.toolbar-path { flex: 1; background: white; border: 2px solid var(--dark); border-radius: 6px; padding: 4px 10px; font-family: 'Space Mono', monospace; font-size: 11px; color: var(--mid); }

.tabs-row { display: flex; gap: 0; }
.tab { padding: 8px 20px; font-weight: 800; font-size: 13px; cursor: pointer; border: 2px solid var(--dark); border-bottom: none; border-radius: 8px 8px 0 0; background: var(--cream2); color: var(--mid); margin-right: -2px; transition: all 0.15s; display: flex; align-items: center; gap: 6px; }
.tab.active { background: var(--cream); color: var(--dark); z-index: 1; }
.tab-body { border: 2px solid var(--dark); border-radius: 0 8px 8px 8px; background: var(--cream); padding: 14px; position: relative; z-index: 0; }

.win-textarea { width: 100%; border: 2px solid var(--dark); border-radius: 8px; padding: 10px 12px; font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.7; resize: vertical; background: white; color: var(--dark); min-height: 150px; outline: none; }
.win-input { border: 2px solid var(--dark); border-radius: 8px; padding: 7px 12px; font-family: 'Space Mono', monospace; font-size: 12px; background: white; color: var(--dark); outline: none; width: 100%; }

.drag-zone { border: 3px dashed var(--mid); border-radius: 12px; padding: 28px; text-align: center; cursor: pointer; background: white; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.drag-zone:hover, .drag-zone.over { border-color: var(--orange); background: #FFF8F0; }

.options-panel { background: var(--cream2); border: 2px solid var(--dark); border-radius: 10px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
.option-title { font-size: 12px; font-weight: 800; color: var(--dark); font-family: 'Space Mono', monospace; margin-bottom: 2px; }

.btn { padding: 8px 20px; border: 2.5px solid var(--dark); border-radius: 8px; font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 3px 3px 0 var(--dark); transition: all 0.1s; background: var(--cream); color: var(--dark); }
.btn:active:not(:disabled) { transform: translate(2px,2px); box-shadow: 1px 1px 0 var(--dark); }
.btn.orange { background: var(--orange); color: white; }
.btn.purple { background: var(--purple); color: white; }
.btn.green { background: var(--green); color: var(--dark); }
.btn.sm { padding: 5px 12px; font-size: 11px; box-shadow: 2px 2px 0 var(--dark); }

.prog-wrap { background: white; border: 2.5px solid var(--dark); border-radius: 8px; height: 24px; padding: 3px; overflow: hidden; }
.prog-inner { height: 100%; display: flex; gap: 3px; }
.prog-seg { flex: 1; border-radius: 3px; background: var(--purple); opacity: 0.12; }
.prog-seg.active { opacity: 1; }

.bubble-wrap { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; }
.bubble-avatar { width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--dark); background: var(--yellow); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.bubble { flex: 1; background: white; border: 2px solid var(--dark); border-radius: 12px; padding: 10px 14px; font-size: 13px; line-height: 1.6; color: var(--dark); font-family: 'Space Mono', monospace; box-shadow: 2px 2px 0 var(--dark); }

.keyword-tag { display: inline-block; background: var(--light); border: 1.5px solid var(--dark); padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 800; margin: 2px; }

.chat-box { background: var(--cream2); border: 2px solid var(--dark); border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; }
.chat-msg { font-size: 12px; padding: 6px 10px; border-radius: 8px; border: 1.5px solid var(--dark); max-width: 85%; }
.chat-msg.user { align-self: flex-end; background: var(--orange); color: white; }
.chat-msg.bot { align-self: flex-start; background: white; }

.metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
.metric { background: var(--cream2); border: 2px solid var(--dark); border-radius: 8px; padding: 6px; text-align: center; }
.metric-val { font-family: 'Space Mono', monospace; font-size: 16px; font-weight: 700; color: var(--orange); }
.metric-lbl { font-size: 9px; font-weight: 800; color: var(--mid); }

.statusbar { display: flex; gap: 4px; padding: 6px 14px; border-top: 2px solid var(--dark); background: var(--cream2); align-items: center; font-size: 10px; font-family: 'Space Mono', monospace; }
.status-pill { padding: 2px 10px; border-radius: 20px; border: 1.5px solid var(--dark); font-weight: 700; background: var(--cream); }

.toast { position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: var(--cream); border: 2.5px solid var(--dark); border-radius: 10px; padding: 10px 16px; font-weight: 700; font-size: 13px; box-shadow: 4px 4px 0 var(--dark); animation: slideIn 0.2s ease; }
@keyframes slideIn { from{transform:translateX(120%)} to{transform:translateX(0)} }
`;

const SEGS = 14;
const API_BASE = "http://localhost:3001/api";

export default function SummarizeApp() {
  const [tab, setTab]           = useState("text");
  const [text, setText]         = useState("");
  const [file, setFile]         = useState(null);
  const [fullText, setFullText] = useState(""); // Stores extracted text for chat/keywords
  const [length, setLength]     = useState("medium");
  const [bullets, setBullets]   = useState(false);
  const [language, setLanguage] = useState("English");
  const [provider, setProvider] = useState("huggingface");
  const [output, setOutput]     = useState("");
  const [keywords, setKeywords] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  
  const [loading, setLoading]   = useState(false);
  const [progSegs, setProgSegs] = useState(0);
  const [stepMsg, setStepMsg]   = useState("");
  const [stats, setStats]       = useState(null);
  const [error, setError]       = useState("");
  const [toast, setToast]       = useState(null);
  const [dragOver, setDragOver] = useState(false);
  
  const fileRef = useRef();
  const timerRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const animateProgress = (steps = ["Initializing...", "Thinking...", "Almost there..."]) => {
    setProgSegs(0);
    let seg = 0; let step = 0;
    timerRef.current = setInterval(() => {
      seg = Math.min(seg + 1, SEGS - 1);
      setProgSegs(seg);
      if (seg % 4 === 0 && step < steps.length) setStepMsg(steps[step++]);
    }, 250);
  };

  const summarize = async () => {
    if (tab === "text" && !text.trim()) { showToast("Enter some text!", "error"); return; }
    if (tab === "pdf" && !file) { showToast("Upload a PDF!", "error"); return; }

    setError(""); setOutput(""); setLoading(true); setStats(null); setKeywords([]); setChatHistory([]);
    animateProgress();
    const t0 = Date.now();

    try {
      let res, data;
      if (tab === "text") {
        res = await fetch(`${API_BASE}/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, length, bullets, language, provider }),
        });
        setFullText(text);
      } else {
        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("length", length);
        formData.append("bullets", bullets);
        formData.append("language", language);
        formData.append("provider", provider);
        res = await fetch(`${API_BASE}/summarize-pdf`, { method: "POST", body: formData });
      }

      data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");

      clearInterval(timerRef.current);
      setProgSegs(SEGS);
      setStepMsg("Done! ✓");
      setOutput(data.summary);
      if (data.rawText) setFullText(data.rawText);

      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      const inputLen = tab === "text" ? text.length : (data.rawText?.length || 1000);
      const red = Math.max(0, Math.round((1 - data.summary.length / inputLen) * 100));
      setStats({ words: data.inputWords, out: data.outputWords, red, time: elapsed });
      showToast("Summary ready! 🎉");
    } catch (e) {
      clearInterval(timerRef.current);
      setError(e.message);
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const extractKeywords = async () => {
    if (!fullText) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/keywords`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText, provider }),
      });
      const data = await res.json();
      setKeywords(data.keywords || []);
      showToast("Keywords extracted!");
    } catch (e) { showToast("Keyword error", "error"); }
    finally { setLoading(false); }
  };

  const askChat = async (e) => {
    e?.preventDefault();
    if (!chatInput.trim() || !fullText) return;
    const q = chatInput;
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", content: q }]);
    
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText, question: q, provider }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: "bot", content: data.answer }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: "bot", content: "Error: Could not get response." }]);
    }
  };

  const clear = () => { setText(""); setFile(null); setOutput(""); setError(""); setStats(null); setProgSegs(0); setStepMsg(""); setKeywords([]); setChatHistory([]); };

  return (
    <>
      <style>{G}</style>
      <div className="desktop">
        
        {/* WINDOW */}
        <div className="win">
          <div className="title-bar">
            <div className="tbar-btns"><div className="tbar-btn close">✕</div><div className="tbar-btn min">–</div><div className="tbar-btn max">□</div></div>
            <div className="tbar-title">🧠 SummarizeAI Enhanced — v2.0</div>
          </div>

          <div className="toolbar">
            <div className="toolbar-path">📍 Session: {file ? file.name : "Untitled Text"}</div>
            
            <select className="win-input" style={{ width: 140, height: 28, padding: '2px 5px', marginRight: 5 }} value={provider} onChange={e => setProvider(e.target.value)}>
              <option value="huggingface">🤗 Hugging Face</option>
              <option value="openai">🤖 OpenAI (GPT-4o)</option>
              <option value="anthropic">🎨 Anthropic (Claude 3)</option>
            </select>

            <select className="win-input" style={{ width: 100, height: 28, padding: '2px 5px' }} value={language} onChange={e => setLanguage(e.target.value)}>
              {["English", "Spanish", "French", "German", "Hindi", "Chinese"].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="win-body">
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14 }}>
              
              {/* LEFT: INPUT */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="tabs-row">
                  <div className={`tab ${tab === "text" ? "active" : ""}`} onClick={() => setTab("text")}>✏️ Text</div>
                  <div className={`tab ${tab === "pdf" ? "active" : ""}`} onClick={() => setTab("pdf")}>📂 PDF</div>
                </div>
                <div className="tab-body">
                  {tab === "text" ? (
                    <textarea className="win-textarea" placeholder="Paste text here..." value={text} onChange={e => setText(e.target.value)} />
                  ) : (
                    <div className={`drag-zone ${dragOver ? "over" : ""}`} onClick={() => fileRef.current?.click()} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); setFile(e.dataTransfer.files[0]); }}>
                      <span>{file ? "📄" : "📁"}</span>
                      <p>{file ? file.name : "Drop PDF here"}</p>
                      <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: OPTIONS */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="options-panel">
                  <div className="option-title">// Length</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["short", "medium", "long"].map(l => (
                      <button key={l} className={`btn sm ${length === l ? "orange" : ""}`} onClick={() => setLength(l)}>{l}</button>
                    ))}
                  </div>
                </div>
                <div className="options-panel">
                  <div className="option-title">// Format</div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={bullets} onChange={() => setBullets(!bullets)} /> Bullet Points
                  </label>
                </div>
                <button className="btn orange" style={{ width: "100%" }} onClick={summarize} disabled={loading}>{loading ? "⏳ Working..." : "⚡ Summarize"}</button>
                <button className="btn" style={{ width: "100%" }} onClick={clear}>🗑️ Clear</button>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="prog-wrap">
              <div className="prog-inner">
                {Array.from({ length: SEGS }).map((_, i) => <div key={i} className={`prog-seg ${i < progSegs ? "active" : ""}`} />)}
              </div>
            </div>

            {/* OUTPUT */}
            <div className="win" style={{ boxShadow: "none", border: "2px solid var(--dark)" }}>
              <div className="title-bar" style={{ background: "var(--purple)", padding: "4px 10px" }}>
                <div className="tbar-title" style={{ fontSize: 12 }}>🤖 AI Summary Output</div>
              </div>
              <div className="win-body">
                <div className="bubble-wrap">
                  <div className="bubble-avatar">🤖</div>
                  <div className="bubble">{output || "Waiting for input..."}</div>
                </div>

                {stats && (
                  <div className="metrics">
                    <div className="metric"><div className="metric-val">{stats.words}</div><div className="metric-lbl">WORDS IN</div></div>
                    <div className="metric"><div className="metric-val">{stats.out}</div><div className="metric-lbl">WORDS OUT</div></div>
                    <div className="metric"><div className="metric-val">{stats.red}%</div><div className="metric-lbl">REDUCTION</div></div>
                    <div className="metric"><div className="metric-val">{stats.time}s</div><div className="metric-lbl">TIME</div></div>
                  </div>
                )}
              </div>
            </div>

            {/* KEYWORDS & CHAT */}
            {output && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="options-panel">
                  <div className="option-title">// Keywords</div>
                  <div style={{ minHeight: 40 }}>
                    {keywords.map(k => <span key={k} className="keyword-tag">{k}</span>)}
                    {keywords.length === 0 && <button className="btn sm green" onClick={extractKeywords}>Get Keywords</button>}
                  </div>
                </div>
                <div className="options-panel">
                  <div className="option-title">// Chat with Document</div>
                  <div className="chat-box">
                    {chatHistory.map((m, i) => <div key={i} className={`chat-msg ${m.role}`}>{m.content}</div>)}
                    {chatHistory.length === 0 && <div style={{ fontSize: 10, color: "var(--mid)" }}>Ask questions about the text...</div>}
                  </div>
                  <form onSubmit={askChat} style={{ display: "flex", gap: 5 }}>
                    <input className="win-input" placeholder="Ask something..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
                    <button className="btn sm purple" type="submit">Ask</button>
                  </form>
                </div>
              </div>
            )}

          </div>

          <div className="statusbar">
            <div className="status-pill">Ready</div>
            <div className="status-pill">Lang: {language}</div>
            <div style={{ marginLeft: "auto" }}>{fullText.length} chars indexed</div>
          </div>
        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}> {toast.msg} </div>}
    </>
  );
}
