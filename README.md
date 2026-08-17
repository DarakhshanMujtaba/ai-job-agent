<div align="center">

# ✳️ Sagehire

### An AI job-application agent that tells you the truth, not just what you want to hear.

*Most "AI job agents" mass-apply to everything and hope something sticks. Sagehire scores your real fit, tells you honestly when it's weak, and only helps you apply when it's actually worth your time.*

</div>

---

## Why this is different

The AI job-search space in 2026 is flooded with tools that auto-apply to hundreds of jobs regardless of fit, generate generic AI-sounding cover letters recruiters can spot instantly, and treat job descriptions as trusted input — which makes them exploitable.

Sagehire takes the opposite approach: **honesty over volume**, **transparency over black-box scoring**, and **security over blind trust**. It will tell you a 0/100 fit score with real reasoning instead of flattering you into wasting your time — and yours.

---

## ✨ Features

- **AI Resume Parsing** — uploads PDF/DOCX and converts raw resume text into structured data (skills, experience, education) using an LLM
- **Live Job Discovery** — pulls real, current listings from the RemoteOK API
- **Honest Fit Scoring** — scores resume-to-job fit from 0–100 with plain-language reasoning, and explicitly warns when a match is weak instead of softening the truth
- **Tailored Resume & Cover Letter Generation** — writes job-specific content grounded only in real resume data — no invented experience
- **Authenticity Checker** — scans generated content for generic AI-cliché phrases so output doesn't read as robotic
- **Prompt Injection Defense** — job descriptions are treated as untrusted input. This isn't theoretical: during testing, a real live RemoteOK job posting contained a hidden instruction designed to manipulate AI agents into embedding a trigger phrase. Sagehire's output-level validation layer caught it and surfaced a visible security warning instead of silently complying
- **Interview Prep Agent** — generates likely interview questions with STAR-format answer drafts based on real resume experience, honestly flagging gaps instead of fabricating stories
- **Applications Tracker** — kanban-style view of every job you've evaluated, sorted by fit score

---

## 🧠 Architecture

```
Resume Upload (PDF/DOCX)
        │
        ▼
   Text Extraction ──► LLM Parsing ──► Structured Resume JSON
        │
        ▼
Job Discovery (RemoteOK API) ──► Job stored in DB
        │
        ▼
   Fit Score Agent ──► Score (0–100) + Honest Reasoning
        │
        ▼
  ┌─────┴─────┐
  ▼           ▼
Tailoring   Interview Prep
Agent       Agent
  │           │
  ▼           ▼
Authenticity   STAR-format
+ Injection    Q&A Drafts
Checks
```

Every LLM call that touches external content (job descriptions) is treated as untrusted — with explicit system-prompt instructions to ignore embedded commands, **plus** a second, independent output-scanning layer as defense-in-depth.

---

## 🛠️ Tech Stack

**Backend**
- FastAPI (Python) — REST API
- PostgreSQL via Supabase — database
- SQLAlchemy — ORM
- Groq API (Llama 3.3 70B) — LLM inference
- JWT + bcrypt — authentication & password security
- pdfplumber / python-docx — resume text extraction

**Frontend**
- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion — animations & micro-interactions
- lucide-react — icons
- react-router-dom, axios, react-hot-toast

---

## 🚀 Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in `/backend`:

```
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_random_secret_key
GROQ_API_KEY=your_groq_api_key
```

```bash
python create_tables.py
uvicorn main:app --reload --host 127.0.0.1 --port 8080
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint                                   | Description                                      |
|--------|---------------------------------------------|---------------------------------------------------|
| POST   | `/auth/signup`                              | Create a new user account                         |
| POST   | `/auth/login`                               | Authenticate and receive a JWT token               |
| POST   | `/resume/upload`                            | Upload a resume (PDF/DOCX), extract raw text       |
| POST   | `/resume/{resume_id}/parse`                 | Convert raw resume text into structured JSON       |
| POST   | `/jobs/fetch`                               | Fetch and save live job listings from RemoteOK     |
| GET    | `/jobs/`                                    | List all saved jobs                                |
| POST   | `/applications/fit-score`                   | Score a resume against a job, with reasoning       |
| GET    | `/applications/`                            | List all scored applications for the current user  |
| POST   | `/applications/{application_id}/tailor`     | Generate tailored resume summary + cover letter    |
| POST   | `/applications/{application_id}/interview-prep` | Generate interview questions + STAR answer drafts |

All endpoints except `/auth/*` require a `Bearer` JWT token in the `Authorization` header.

---

## 🔒 Security Note: Prompt Injection Defense

Job postings are user-generated content pulled from the open web — which makes them an attack surface for prompt injection. Sagehire assumes every job description is **untrusted** and applies two independent layers of defense:

1. **Input-level:** every system prompt that processes a job description explicitly instructs the LLM to treat it as data only, never as instructions.
2. **Output-level:** generated content is scanned after the fact for injection indicators (suspicious trigger phrases, encoded strings, unnatural phrasing a real candidate wouldn't write) — because prompt-level instructions alone aren't always reliable.

This was validated against a real attack, not a hypothetical one: a live RemoteOK job posting contained a hidden instruction attempting to get the AI to embed a specific trigger phrase in generated content. The first defense layer didn't catch it — the output-level check did, and surfaced a clear warning in the UI instead of silently shipping compromised content.

---

## 👤 Author

**Darakhshan Mujtaba**
Biomedical Engineering student · AI/ML & NLP Engineer

- GitHub: [add your link]
- LinkedIn: [add your link]

</div>
