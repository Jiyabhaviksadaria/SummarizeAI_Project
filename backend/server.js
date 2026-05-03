/**
 * ═══════════════════════════════════════════════════════
 *   SummarizeAI  ·  Multi-Provider Backend
 *   Hugging Face | OpenAI | Anthropic
 * ═══════════════════════════════════════════════════════
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { HfInference } = require("@huggingface/inference");
const { OpenAI } = require("openai");
const Anthropic = require("@anthropic-ai/sdk");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");

const app = express();

// Initialize Clients safely (prevent crash if keys are missing)
const hf = process.env.HF_TOKEN ? new HfInference(process.env.HF_TOKEN) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

/* ── MIDDLEWARE ─────────────────────────────────────── */
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Configure file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/* ── HELPERS ────────────────────────────────────────── */
const LENGTH_MAP = {
  short: "2–3 concise sentences",
  medium: "1–2 well-structured paragraphs",
  long: "3–4 detailed paragraphs",
};

/**
 * Provider-specific AI calls
 */
async function callHF(prompt, systemMsg) {
  if (!hf) throw new Error("Hugging Face is not configured (missing HF_TOKEN)");

  try {
    // Primary Model: Zephyr-7B (Stable & Fast)
    const response = await hf.textGeneration({
      model: "HuggingFaceH4/zephyr-7b-beta",
      inputs: `<|system|>\n${systemMsg}</s>\n<|user|>\n${prompt}</s>\n<|assistant|>`,
      parameters: { 
        max_new_tokens: 800, 
        temperature: 0.7, 
        return_full_text: false,
        wait_for_model: true 
      },
    });
    return response.generated_text.trim();
  } catch (error) {
    console.warn("Primary HF model busy, trying BART summarizer...");
    try {
      // Backup Model: BART Large CNN (Dedicated for Summarization)
      const backup = await hf.summarization({
        model: "facebook/bart-large-cnn",
        inputs: prompt,
        parameters: { wait_for_model: true }
      });
      return backup.summary_text.trim();
    } catch (innerError) {
      console.error("HF API Error:", innerError.message);
      throw new Error("Hugging Face is currently overloaded. Please try again in a minute or switch to OpenAI/Anthropic.");
    }
  }
}

async function callOpenAI(prompt, systemMsg) {
  if (!openai) throw new Error("OpenAI is not configured (missing OPENAI_API_KEY)");
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Cost-effective and fast
    messages: [
      { role: "system", content: systemMsg },
      { role: "user", content: prompt }
    ],
    max_tokens: 800,
  });
  return response.choices[0].message.content.trim();
}

async function callAnthropic(prompt, systemMsg) {
  if (!anthropic) throw new Error("Anthropic is not configured (missing ANTHROPIC_API_KEY)");
  const response = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 800,
    system: systemMsg,
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].text.trim();
}

async function callGemini(prompt, systemMsg) {
  if (!genAI) throw new Error("Gemini is not configured (missing GEMINI_API_KEY)");
  
  const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.0-pro"];
  let lastError;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const fullPrompt = `${systemMsg}\n\n${prompt}`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text().trim();
    } catch (e) {
      console.warn(`Gemini ${modelName} failed:`, e.message);
      lastError = e;
    }
  }
  throw new Error(`Gemini failed all models: ${lastError.message}`);
}

async function callGroq(prompt, systemMsg) {
  if (!groq) throw new Error("Groq is not configured (missing GROQ_API_KEY)");
  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemMsg },
      { role: "user", content: prompt },
    ],
    model: "llama-3.1-8b-instant", // Latest fast and free model
  });
  return response.choices[0].message.content.trim();
}

/**
 * Unified AI call dispatcher
 */
async function callAI(provider, prompt, systemMsg = "You are a helpful AI assistant.") {
  try {
    switch (provider?.toLowerCase()) {
      case "openai":
        return await callOpenAI(prompt, systemMsg);
      case "anthropic":
        return await callAnthropic(prompt, systemMsg);
      case "gemini":
        return await callGemini(prompt, systemMsg);
      case "groq":
        return await callGroq(prompt, systemMsg);
      case "huggingface":
      default:
        return await callHF(prompt, systemMsg);
    }
  } catch (error) {
    console.error(`${provider} API Error:`, error.message);
    throw new Error(`${provider} error: ${error.message}`);
  }
}

function trim(text, max = 20000) {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

/* ── API ENDPOINTS ──────────────────────────────────── */

// 1. Summarize Raw Text
app.post("/api/summarize", async (req, res) => {
  const { text, length = "medium", bullets = false, language = "English", provider = "huggingface" } = req.body;
  
  const target = LENGTH_MAP[length] || LENGTH_MAP.medium;
  const prompt = `Summarize the following text in ${language}.
Format: ${bullets ? "Bullet points" : "Standard paragraphs"}.
Length: ${target}.
Output ONLY the summary.

TEXT:
${trim(text)}`;

  try {
    const summary = await callAI(provider, prompt, "You are an expert summarizer.");
    res.json({ 
      summary, 
      inputWords: text.split(/\s+/).length,
      provider 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Summarize PDF
app.post("/api/summarize-pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const parsed = await pdfParse(req.file.buffer);
    const text = parsed.text;
    
    if (!text || text.trim().length < 20) {
      return res.status(422).json({ error: "Could not extract text from PDF." });
    }

    const { length, bullets, language, provider = "huggingface" } = req.body;
    const target = LENGTH_MAP[length] || LENGTH_MAP.medium;
    const prompt = `Summarize this PDF content in ${language}. Length: ${target}. Format: ${bullets ? "Bullets" : "Paragraphs"}.\n\nTEXT:\n${trim(text)}`;

    const summary = await callAI(provider, prompt, "You are an expert summarizer.");
    res.json({ 
      summary, 
      rawText: text, 
      filename: req.file.originalname,
      inputWords: text.split(/\s+/).length,
      provider
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Extract Keywords
app.post("/api/keywords", async (req, res) => {
  const { text, provider = "huggingface" } = req.body;
  const prompt = `Extract 5-8 key phrases from this text. Return ONLY a comma-separated list.\n\nTEXT:\n${trim(text)}`;
  
  try {
    const response = await callAI(provider, prompt, "You are a keyword extractor.");
    const keywords = response.split(",").map(k => k.trim()).filter(Boolean);
    res.json({ keywords });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Chat with Document
app.post("/api/chat", async (req, res) => {
  const { text, question, provider = "huggingface" } = req.body;
  const system = `Answer based ONLY on this text: ${trim(text, 10000)}`;
  
  try {
    const answer = await callAI(provider, question, system);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", providers: ["Hugging Face", "OpenAI", "Anthropic", "Gemini", "Groq"] });
});

/* ── START SERVER ───────────────────────────────────── */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\x1b[35m[SummarizeAI] Backend ready with Multi-Provider support on port ${PORT}\x1b[0m`);
});
