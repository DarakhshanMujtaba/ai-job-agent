<div align="center">

# ✳️ Sagehire

### An AI job-application agent that tells you the truth, not just what you want to hear.

**[🚀 Live Demo](https://ai-job-agent-indol.vercel.app)** · **[📹 Video Walkthrough](#)** · **[🔗 Backend API Docs](https://ai-job-agent-0idz.onrender.com/docs)**

*Most "AI job agents" mass-apply to everything and hope something sticks. Sagehire scores your real fit, tells you honestly when it's weak, and only helps you apply when it's actually worth your time.*

![Status](https://img.shields.io/badge/status-live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Made with](https://img.shields.io/badge/made%20with-FastAPI%20%2B%20React-orange)

</div>

---

## 🧭 Table of Contents

- [Why this is different](#-why-this-is-different)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Architecture](#-architecture)
- [Tech Stack](#️-tech-stack)
- [Setup — Run it locally](#-setup--run-it-locally)
- [API Reference](#-api-reference)
- [Security: Prompt Injection Defense](#-security-note-prompt-injection-defense)
- [Known Limitations](#️-known-limitations--honest-notes)
- [Roadmap](#-roadmap--what-id-build-next)
- [Author](#-author)

---

## 🤔 Why this is different

The AI job-search space in 2026 is flooded with tools that mass-apply to hundreds of jobs regardless of fit, generate the same generic, AI-sounding cover letter for every application, and treat job descriptions as trusted input — which makes them exploitable.

Sagehire takes the opposite approach:

- **Honesty over volume** — a 0/100 score with real reasoning beats a flattering lie that wastes your time
- **Transparency over black-box scoring** — every decision comes with an explanation you can actually read
- **Security over blind trust** — job postings are treated as untrusted content, not gospel

Built for candidates who'd rather know the truth than waste a shot.

---

## ✨ Features

| Feature | What it does |
|---|---|
| 📄 **AI Resume Parsing** | Upload a PDF/DOCX, and an LLM converts it into structured data — skills, experience, education |
| 🔍 **Live Job Discovery** | Pulls real, current listings from the RemoteOK API |
| 🎯 **Honest Fit Scoring** | Scores resume-to-job fit from 0–100 with plain-language reasoning — and says so clearly when a match is weak |
| ✍️ **Tailored Applications** | Generates job-specific resume summaries and cover letters, grounded strictly in your real data — nothing invented |
| 🕵️ **Authenticity Checker** | Scans generated content for generic AI-cliché phrases so it doesn't read like a robot wrote it |
| 🛡️ **Prompt Injection Defense** | Treats every job description as untrusted input, with a two-layer defense system — tested against a real attack (see below) |
| 🎤 **Interview Prep** | Generates likely interview questions with STAR-format answer drafts based on your actual experience — and admits when there's a gap instead of fabricating one |
| 📊 **Applications Tracker** | A kanban-style view of everything you've evaluated, sorted by fit score |

---

## 🌐 Live Demo

**Frontend:** [ai-job-agent-indol.vercel.app](https://ai-job-agent-indol.vercel.app)
**Backend API:** [ai-job-agent-0idz.onrender.com](https://ai-job-agent-0idz.onrender.com)

> ⚠️ **Heads up before you try it:** this runs on free-tier infrastructure. The backend may take **30–50 seconds to wake up** on the first request if it's been idle (Render's free tier sleeps after 15 minutes of inactivity). The AI features also share a free-tier LLM API quota, so if a lot of people try it at once, you might hit a rate limit — that's expected behavior on free infrastructure, not a bug. Give it a moment and try again.

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

Every LLM call that touches external content (job descriptions) treats that content as **untrusted** — with explicit system-prompt instructions to ignore embedded commands, **plus** a second, independent output-scanning layer as defense-in-depth.

---

## 🛠️ Tech Stack

**Backend**
- FastAPI (Python) — REST API
- PostgreSQL via Supabase — database
- SQLAlchemy — ORM
- Groq API (LLM inference)
- JWT + bcrypt — authentication & password security
- pdfplumber / python-docx — resume text extraction
- Deployed on **Render**

**Frontend**
- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion — animations & micro-interactions
- lucide-react — icons
- Deployed on **Vercel**

---

## 🚀 Setup — Run it locally

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in `/backend`:

```env
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_random_secret_key
GROQ_API_KEY=your_groq_api_key
```

```bash
python create_tables.py
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `/frontend`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8080
```

```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## 📡 API Reference

All endpoints except `/auth/*` require a `Bearer` JWT token in the `Authorization` header.

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/auth/signup` | Create a new user account |
| `POST` | `/auth/login` | Authenticate and receive a JWT token |
| `POST` | `/resume/upload` | Upload a resume (PDF/DOCX), extract raw text |
| `POST` | `/resume/{resume_id}/parse` | Convert raw resume text into structured JSON via LLM |
| `POST` | `/jobs/fetch` | Fetch and save live job listings from RemoteOK |
| `GET`  | `/jobs/` | List all saved jobs |
| `POST` | `/applications/fit-score` | Score a resume against a job, with reasoning |
| `GET`  | `/applications/` | List all scored applications for the current user |
| `POST` | `/applications/{application_id}/tailor` | Generate tailored resume summary + cover letter |
| `POST` | `/applications/{application_id}/interview-prep` | Generate interview questions + STAR answer drafts |

Full interactive docs available at `/docs` (Swagger UI) once the backend is running.

---

## 🔒 Security Note: Prompt Injection Defense

Job postings are user-generated content pulled from the open web — which makes them an attack surface for prompt injection. Sagehire assumes every job description is **untrusted** and applies two independent layers of defense:

1. **Input-level:** every system prompt that processes a job description explicitly instructs the LLM to treat it as data only, never as instructions.
2. **Output-level:** generated content is scanned after the fact for injection indicators (suspicious trigger phrases, encoded strings, unnatural phrasing a real candidate wouldn't write) — because prompt-level instructions alone aren't always reliable.

**This wasn't a hypothetical test.** A live RemoteOK job posting during development contained a hidden instruction attempting to get the AI to embed a specific trigger phrase in generated content. The first defense layer didn't catch it — the LLM followed the embedded instruction anyway. The second, output-level check did catch it, and surfaced a clear warning in the UI instead of silently shipping compromised content.

**Lesson learned:** in LLM applications, one line of defense is not enough.

---

## ⚠️ Known Limitations — Honest Notes

I'd rather tell you these upfront than have you discover them:

- **Single job source** — currently only pulls from RemoteOK's free API. It's not a comprehensive job board, and listing quality/relevance varies (it's the open internet, after all).
- **Fit scoring is LLM judgment, not a validated model** — the score is generated by an LLM reasoning over resume vs. job description text, not a formally benchmarked scoring model. I'd want a proper evaluation dataset (manually-scored resume-job pairs) before trusting this at scale or in a high-stakes decision.
- **Free-tier hosting quirks** — the backend (Render free tier) sleeps after 15 minutes of inactivity, causing a 30–50 second cold start on the first request. The LLM API (Groq free tier) has shared rate limits, so heavy simultaneous usage can hit them.
- **No persistent job-source deduplication across sources** — since there's currently one source, this isn't an issue yet, but it's a known gap if more sources get added.
- **Authenticity checker is rule-based, not ML-based** — it catches known AI-cliché phrases and injection patterns via pattern matching, not a trained classifier. It's fast and free, but not exhaustive.
- **No email verification on signup** — accounts are created immediately with just an email + password; this is a portfolio project, not a production auth system.

---

## 🗺️ Roadmap — What I'd build next

- [ ] Add more job sources (Adzuna, Arbeitnow) for better coverage
- [ ] Build a proper evaluation set to benchmark and calibrate fit-score accuracy
- [ ] Weekly "Career Signal" report — analyze application patterns to surface recurring skill gaps
- [ ] Local-first / self-hosted data option for privacy-conscious users
- [ ] Rate-limiting per user to make shared free-tier LLM quota last longer

---

## 👤 Author

**Darakhshan Mujtaba**
Biomedical Engineering student · AI/ML & NLP Engineer

- GitHub: [github.com/DarakhshanMujtaba](https://github.com/DarakhshanMujtaba)
- LinkedIn: [linkedin.com/in/darakhshan-mujtaba-580183271](https://linkedin.com/in/darakhshan-mujtaba-580183271)

---

<div align="center">

*If you found a bug, hit a limitation, or have feedback — issues and PRs are welcome.*

</div>
