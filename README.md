# 🧠 SummarizeAI — Retro Warm OS UI

AI-powered text summarization platform with a retro vintage OS aesthetic.

---

## 📁 Project Structure

```
summarize-ai/
│
├── frontend/
│   └── SummarizeAI_RetroWarm.jsx   ← Main React component (Retro OS UI)
│
├── backend/
│   ├── SummarizeAI_Backend.js      ← Express.js server
│   ├── package.json                ← (create with npm init)
│   └── .env                        ← Add your API key here
│
└── README.md
```

---

## ⚡ Backend Setup

```bash
# 1. Go to backend folder
cd backend

# 2. Initialize project
npm init -y

# 3. Install dependencies
npm install express cors @anthropic-ai/sdk multer pdf-parse dotenv

# 4. Create .env file and add your key
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env
echo "PORT=3001" >> .env

# 5. Start the server
node SummarizeAI_Backend.js
```

Server runs at: http://localhost:3001

---

## ⚡ Frontend Setup

```bash
# 1. Create a new Vite + React project
npm create vite@latest frontend -- --template react
cd frontend

# 2. Install dependencies
npm install

# 3. Replace src/App.jsx with SummarizeAI_RetroWarm.jsx content

# 4. Run the app
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 🔌 API Endpoints

### POST /api/summarize
```json
Request:
{
  "text": "Your long text here...",
  "length": "short | medium | long",
  "bullets": false
}

Response:
{
  "summary": "Summarized content...",
  "inputWords": 500,
  "outputWords": 80,
  "model": "claude-sonnet-4-20250514"
}
```

### POST /api/summarize-pdf
- Form-data: `pdf` (file), `length` (string), `bullets` (boolean)

### GET /api/health
- Returns server status and timestamp

---

## 🎨 UI Features

- Retro Warm OS aesthetic (orange title bars, cream windows)
- Text input tab + PDF drag-and-drop upload
- Radio button length selector (Short / Medium / Detailed)
- Bullet point toggle
- Segmented purple progress bar
- Robot speech bubble output
- Metrics: words in, words out, reduction %, time
- Copy + Save .txt buttons
- Toast notifications
- Desktop icon dock

---

## 📦 Dependencies Summary

| Package | Purpose |
|---|---|
| express | Web server |
| cors | Allow frontend requests |
| @anthropic-ai/sdk | Claude AI API |
| multer | PDF file upload handling |
| pdf-parse | Extract text from PDF |
| dotenv | Load .env variables |

---

## 🚀 Quick Tips

- Make sure backend is running BEFORE opening frontend
- Keep your ANTHROPIC_API_KEY secret — never commit .env to GitHub
- Add `.env` to your `.gitignore` file
- For PDF summarization, only text-based PDFs work (not scanned images)
