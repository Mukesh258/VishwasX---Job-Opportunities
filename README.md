<p align="center">
  <h1 align="center">VishwasX</h1>
  <p align="center">
    <strong>Trusted Hiring, Verified Careers — Secured by AI</strong>
  </p>
  <p align="center">
    A full-stack secure job application platform that uses ML-driven phishing detection to verify employers, AES-256 encryption to protect candidate resumes, and AI-powered resume intelligence to match talent with verified opportunities.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React_18_+_TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Backend-FastAPI_+_Python-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-Firebase_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Auth-Firebase_Auth-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" />
  <img src="https://img.shields.io/badge/ML-scikit--learn_+_PyMuPDF-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
  <img src="https://img.shields.io/badge/Encryption-AES--256--CBC-000000?style=for-the-badge&logo=letsencrypt&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" />
</p>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Core Architecture](#-core-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Run Commands](#-installation--run-commands)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [ML Services](#-ml-services)
- [SecureApply Trust Pipeline](#-secureapply-trust-pipeline)
- [Screenshots](#-screenshots)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

Job seekers routinely upload sensitive documents (resumes, cover letters, identity proofs) to job portals with no guarantee that the hiring company is legitimate. Phishing companies harvest personal data through fake job postings, and applicants have zero control over who accesses their documents.

**VishwasX solves this with a trust-first architecture:**

| Problem | VishwasX Solution |
|---|---|
| Fake employers posting jobs | ML-based phishing detection + multi-signal company verification |
| Resume data harvested by bad actors | AES-256-CBC encryption — resumes are encrypted at rest, decryptable only with user-owned keys |
| No transparency in hiring pipeline | Real-time application tracking with status updates |
| Skill mismatch in applications | AI-powered resume analysis with skill-gap detection and role matching |
| No guided upskilling | Auto-generated 3-month personalized learning roadmaps |

---

## 🏗️ Core Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  React 18 + TypeScript + Tailwind CSS + shadcn/ui + Vite        │
│  Firebase Auth (OTP/Email) │ Company Verification Engine        │
└────────────────────────────┬────────────────────────────────────┘
                             │  REST API (JSON)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI + Python)                   │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │ Auth     │  │ Resume Vault │  │ Jobs & Applications       │  │
│  │ Module   │  │ AES-256-CBC  │  │ CRUD + Skill Matching     │  │
│  └──────────┘  │ Encrypt/     │  └───────────────────────────┘  │
│                │ Decrypt      │                                  │
│                │ + Watermark  │  ┌───────────────────────────┐  │
│                └──────────────┘  │ Resume Analyzer (ML)      │  │
│                                  │ Random Forest + NLP       │  │
│                                  └───────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              FIREBASE (Firestore + Auth)                        │
│  Collections: users, companies, jobs, applications, resumes,    │
│               analysis_results                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     ML SERVICES (Offline)                        │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐  │
│  │ Phishing Detection      │  │ Resume Intelligence          │  │
│  │ URL feature extraction  │  │ Skill extraction (100+ DB)   │  │
│  │ Random Forest binary    │  │ Role matching (19 roles)     │  │
│  │ classifier              │  │ Course recommendations       │  │
│  └─────────────────────────┘  │ 3-month roadmap generator    │  │
│                                └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🔒 For Job Seekers (Users)
- **Firebase Authentication** — Email/password sign-up with OTP verification
- **Profile Setup** — Career stage, skills, desired role, experience, and education
- **Resume Vault** — Upload resumes encrypted with AES-256-CBC; auto-watermarked with "VishwasX"
- **AI Resume Analysis** — ML-powered skill extraction, best-fit role prediction, and gap analysis
- **Personalized Learning Roadmap** — Auto-generated 3-month plan based on missing skills
- **Job Marketplace** — Browse verified-company job listings with real-time skill match scoring
- **SecureApply** — Apply to jobs with encrypted resume + video intro; only verified companies can decrypt
- **Application Tracking** — Track status of all submitted applications in real time
- **Mentor Messaging** — Direct chat with mentors and AI-powered career guidance
- **Export Reports** — Download career analysis and roadmaps as PDF/JSON/CSV

### 🏢 For Employers (Companies)
- **Company Verification** — Multi-signal trust scoring (domain age, SSL, URL patterns, blacklists, email-domain match)
- **Trust Gate** — Only companies with trust score ≥ 85 and phishing probability < 0.15 can register
- **Job Posting** — Post jobs with custom skills, types, and screening questions
- **Applicant Management** — View applicants, decrypt resumes with provided keys, watch video intros
- **Application Status Control** — Accept, reject, or shortlist candidates

### 🤖 AI & ML Capabilities
- **Resume Classifier** — Random Forest model trained on resume dataset (`.pkl` model included)
- **Skill Extraction** — NLP-based extraction from 100+ skills across programming, cloud, ML, design, and soft skills
- **Role Matching Engine** — Scores candidates against 19 professional roles with matched/missing skill breakdown
- **Course Recommender** — Maps missing skills to curated Coursera/Udemy courses
- **Phishing Detection** — URL feature engineering + binary classifier for company legitimacy scoring

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type-safe development |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui (Radix) | Accessible component library |
| React Router v6 | Client-side routing |
| React Query (TanStack) | Server state management |
| Framer Motion | Animations & transitions |
| Firebase SDK | Client-side authentication |
| Recharts | Data visualization |
| Zod | Schema validation |
| pdfjs-dist | PDF rendering in browser |
| Sonner | Toast notifications |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | Async Python web framework |
| Uvicorn | ASGI server |
| Firebase Admin SDK | Firestore database + server-side auth |
| Pydantic v2 | Request/response validation |
| cryptography | AES-256-CBC encryption/decryption |
| PyMuPDF (fitz) | PDF text extraction + watermarking |
| python-dotenv | Environment variable management |
| python-multipart | File upload handling |

### ML Services
| Technology | Purpose |
|---|---|
| scikit-learn | Random Forest classifiers |
| pandas | Data processing |
| joblib | Model serialization |

### Infrastructure
| Technology | Purpose |
|---|---|
| Firebase Auth | User authentication (email/password) |
| Cloud Firestore | NoSQL document database |
| Playwright | End-to-end testing |
| Vitest | Unit testing |
| ESLint | Code quality |

---

## 📁 Project Structure

```
VishwasX/
├── frontend/                           # React + TypeScript SPA
│   ├── src/
│   │   ├── components/                 # 34 reusable UI components
│   │   │   ├── ui/                     # shadcn/ui primitives
│   │   │   ├── Navbar.tsx              # User navigation bar
│   │   │   ├── CompanyNavbar.tsx        # Company navigation bar
│   │   │   ├── ResumeUploader.tsx       # Encrypted resume upload
│   │   │   ├── VideoRecorder.tsx        # Video intro recorder
│   │   │   ├── JobCard.tsx              # Job listing card
│   │   │   ├── CareerReadinessScore.tsx # AI readiness gauge
│   │   │   ├── SkillGapAnalysis.tsx     # Skill gap visualization
│   │   │   └── ...
│   │   ├── pages/                      # 14 route pages
│   │   │   ├── Index.tsx               # Landing page
│   │   │   ├── SignUp.tsx              # User registration
│   │   │   ├── SignIn.tsx              # User login
│   │   │   ├── ProfileSetup.tsx        # Career profile wizard
│   │   │   ├── Dashboard.tsx           # User dashboard (47KB)
│   │   │   ├── Opportunities.tsx       # Job marketplace
│   │   │   ├── CompanyVerification.tsx  # Trust gate verification
│   │   │   ├── CompanySignUp.tsx        # Company registration
│   │   │   ├── CompanyDashboard.tsx     # Company admin panel (60KB)
│   │   │   ├── LearningRoadmapPage.tsx  # 3-month learning plan
│   │   │   ├── Messaging.tsx           # Mentor chat
│   │   │   ├── Search.tsx              # Multi-category search
│   │   │   └── NotFound.tsx            # 404 page
│   │   └── lib/                        # Business logic & utilities
│   │       ├── apiService.ts           # Centralized API client
│   │       ├── auth.ts                 # Auth state management
│   │       ├── firebase.ts             # Firebase initialization
│   │       ├── companyVerification.ts   # Trust scoring engine
│   │       ├── skillMatcher.ts         # Skill matching logic
│   │       ├── export.ts               # PDF/JSON/CSV export
│   │       ├── learningResources.ts    # Curated resources DB
│   │       ├── messaging.ts            # Chat service
│   │       └── guestMode.ts            # Guest mode utilities
│   ├── .env                            # Firebase credentials
│   ├── vite.config.ts                  # Vite configuration
│   ├── tailwind.config.ts              # Tailwind configuration
│   └── package.json
│
├── backend/                            # FastAPI REST API
│   ├── main.py                         # 789-line monolith (all routes)
│   ├── requirements.txt                # Python dependencies
│   ├── .env                            # PORT, Firebase credentials path, CORS
│   ├── uploads/                        # Encrypted resume storage (.enc files)
│   ├── uploads_video/                  # Video intro storage
│   └── firebase-credentials.json.json  # Firebase service account key
│
├── ml-services/                        # Machine Learning pipelines
│   ├── AI-Resume/                      # Resume intelligence
│   │   ├── analyzer.py                 # Skill extraction + role matching + roadmap
│   │   ├── train.py                    # Model training script
│   │   ├── resume_classifier.pkl       # Pre-trained Random Forest model (~9.3MB)
│   │   └── dataset/                    # Training data
│   └── Phishing/                       # Phishing detection
│       ├── train_phishing_model.py     # Multi-mode training pipeline
│       ├── predict_phishing.py         # Inference script (single URL / batch CSV)
│       ├── requirements.txt            # ML dependencies
│       └── dataset/                    # URL datasets
│
├── docs/                               # Architecture documentation
│   └── architecture/
│       └── frontend-backend-split.md
│
├── package.json                        # Root workspace scripts
├── SETUP.md                            # Detailed setup guide
├── FIXES_APPLIED.md                    # Changelog of fixes
└── PROJECT_AUDIT_REPORT.md             # Code audit report
```

---

## 📦 Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| **Node.js** | 16+ | Frontend tooling |
| **npm** | 8+ | Package management |
| **Python** | 3.11+ | Backend & ML services |
| **pip** | Latest | Python package management |
| **Firebase Project** | — | Auth + Firestore database |
| **Firebase Service Account Key** | — | Backend server credentials |

---

## 🚀 Installation & Run Commands

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/VishwasX.git
cd VishwasX
```

### 2. Frontend Setup

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at **`http://localhost:8080`** (or the port Vite assigns).

### 3. Backend Setup

```powershell
# Navigate to backend
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate virtual environment (macOS/Linux)
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python main.py
```

The backend will be available at **`http://localhost:4000`**  
Swagger API docs at **`http://localhost:4000/docs`**

> **Alternative:** Run uvicorn directly with hot reload:
> ```powershell
> python -m uvicorn main:app --reload --host 0.0.0.0 --port 4000
> ```

### 4. Run Both from Root (Frontend Only)

```powershell
# From the project root directory
npm run dev:frontend
```

> The backend must still be started separately in its own terminal since it's a Python process.

### 5. Build for Production

```powershell
# Build the frontend
npm run build:frontend

# Or from frontend directory
cd frontend
npm run build
```

### 6. Run Tests

```powershell
# Unit tests (Vitest)
cd frontend
npm run test

# Watch mode
npm run test:watch

# Lint
npm run lint
```

---

## Quick Reference: All Run Commands

| Command | Directory | Description |
|---|---|---|
| `npm install` | `frontend/` | Install frontend dependencies |
| `npm run dev` | `frontend/` | Start Vite dev server |
| `npm run build` | `frontend/` | Production build |
| `npm run lint` | `frontend/` | ESLint check |
| `npm run test` | `frontend/` | Run Vitest suite |
| `npm run dev:frontend` | Root `/` | Start frontend from root |
| `npm run build:frontend` | Root `/` | Build frontend from root |
| `python -m venv venv` | `backend/` | Create virtual environment |
| `.\venv\Scripts\Activate.ps1` | `backend/` | Activate venv (Windows) |
| `source venv/bin/activate` | `backend/` | Activate venv (macOS/Linux) |
| `pip install -r requirements.txt` | `backend/` | Install Python dependencies |
| `python main.py` | `backend/` | Start FastAPI on port 4000 |
| `python -m uvicorn main:app --reload --host 0.0.0.0 --port 4000` | `backend/` | Start with hot reload |

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Override backend URL (defaults to http://<hostname>:4000)
VITE_API_BASE_URL=http://localhost:4000
```

### Backend (`backend/.env`)

```env
PORT=4000
FIREBASE_CREDENTIALS_PATH=firebase-credentials.json
CORS_ORIGIN=*
```

> **Note:** Place your Firebase service account JSON key in `backend/` and reference its filename in `FIREBASE_CREDENTIALS_PATH`.

---

## 📡 API Reference

All endpoints are served from `http://localhost:4000`. Full interactive docs available at `/docs` (Swagger UI).

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register-user` | Register user (name, email, phone, firebaseUID) |
| `POST` | `/api/auth/user/signin` | User sign-in |
| `POST` | `/api/auth/user/profile` | Create/update user career profile |
| `GET` | `/api/user/profile/{userId}` | Get user profile |
| `POST` | `/api/auth/signup` | Register a company |
| `POST` | `/api/auth/company/signin` | Company sign-in |

### Jobs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/jobs` | List all jobs |
| `POST` | `/api/company/post-job` | Post a job (verified companies only) |
| `GET` | `/api/company/my-jobs/{companyId}` | Get company's posted jobs |
| `DELETE` | `/api/job/{jobId}` | Delete a job |
| `POST` | `/api/jobs/match-skills` | Calculate skill match % for a job |

### Applications
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/jobs/apply` | Apply for a job |
| `GET` | `/api/user/applications/{userId}` | Get user's applications |
| `GET` | `/api/company/applicants/{companyId}` | Get applicants for company's jobs |
| `POST` | `/api/applications/status/{applicationId}` | Update application status |

### Resume (Encrypted)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/upload` | Upload & encrypt resume (PDF only) |
| `POST` | `/api/resume/decrypt` | Decrypt resume with key |
| `POST` | `/api/resume/analyze` | AI-analyze encrypted resume |
| `GET` | `/api/resume/analysis/{userId}` | Get latest analysis results |
| `GET` | `/api/resume/list/{userId}` | List user's resumes |
| `DELETE` | `/api/resume/{resumeId}` | Delete resume |
| `DELETE` | `/api/resume/analysis/{userId}` | Reset analysis results |

### Video
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/video/upload` | Upload video intro |
| `GET` | `/api/video/{videoId}` | Stream video |

---

## 🤖 ML Services

### Resume Intelligence (`ml-services/AI-Resume/`)

The resume analyzer pipeline:

1. **PDF Text Extraction** — Uses PyMuPDF to extract raw text from uploaded resumes
2. **Watermark Filtering** — Strips VishwasX watermark text before analysis
3. **Skill Extraction** — Matches against 100+ skills using NLP word-boundary detection
4. **ML Classification** — Random Forest model predicts the best-fit professional role
5. **Role Matching** — Scores the user against 19 roles with matched/missing skill breakdowns
6. **Course Recommendations** — Maps missing skills to curated online courses
7. **Roadmap Generation** — Creates a 3-month learning plan split across foundation, application, and mastery phases

```powershell
# Train the resume classifier
cd ml-services/AI-Resume
python train.py
```

### Phishing Detection (`ml-services/Phishing/`)

Binary URL classification pipeline supporting 3 training modes:

```powershell
cd ml-services/Phishing

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Train on combined datasets (recommended)
python train_phishing_model.py --combine-datasets `
  --text-dataset .\dataset\malicious_phish.csv `
  --feature-dataset .\dataset\phishing_url_dataset.csv `
  --output-dir .\artifacts_combined

# Score a single URL
python predict_phishing.py --model-path .\artifacts_combined\phishing_model.joblib `
  --url "http://secure-update-now.example/login"

# Batch score CSV
python predict_phishing.py --model-path .\artifacts_combined\phishing_model.joblib `
  --input-csv .\dataset\malicious_phish.csv --output-csv .\predictions.csv
```

---

## 🔐 SecureApply Trust Pipeline

The company verification system uses a hybrid ML + rule-based approach:

```
Company submits details
         │
         ▼
┌─────────────────────────────────┐
│     5 Verification Signals       │
│  ┌─────────────┐ ┌────────────┐ │
│  │ Domain Age   │ │ SSL Cert   │ │
│  │ Pattern /20  │ │ Check /15  │ │
│  └─────────────┘ └────────────┘ │
│  ┌─────────────┐ ┌────────────┐ │
│  │ URL Pattern  │ │ Blacklist  │ │
│  │ Analysis /20 │ │ Scan  /25  │ │
│  └─────────────┘ └────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ Email-Domain Match     /20  │ │
│  └─────────────────────────────┘ │
└────────────────┬────────────────┘
                 │
                 ▼
   ML Phishing Probability (60%)
        + Rule Risk (40%)
                 │
                 ▼
        Trust Score = (1 - phishing_prob) × 100
                 │
         ┌───────┴───────┐
         │               │
    Score ≥ 85       Score < 85
    Prob < 0.15      Prob ≥ 0.15
         │               │
    ✅ VERIFIED      ❌ REJECTED
    Can post jobs    Cannot register
```

---

## 🐛 Troubleshooting

<details>
<summary><strong>Backend: "ModuleNotFoundError"</strong></summary>

Ensure the virtual environment is activated before running:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
</details>

<details>
<summary><strong>Frontend: Firebase config errors</strong></summary>

Verify all `VITE_FIREBASE_*` variables are set in `frontend/.env`:
```powershell
cat frontend/.env
```
Restart the Vite dev server after modifying `.env`.
</details>

<details>
<summary><strong>CORS errors in browser</strong></summary>

The backend defaults to `CORS_ORIGIN=*`. If you need to restrict origins, update `backend/.env`:
```env
CORS_ORIGIN=http://localhost:8080,http://localhost:5173
```
</details>

<details>
<summary><strong>Port 4000 already in use</strong></summary>

```powershell
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :4000
kill -9 <PID>
```
Or change `PORT` in `backend/.env`.
</details>

<details>
<summary><strong>Resume upload fails</strong></summary>

- Only PDF files are accepted
- Ensure the `backend/uploads/` directory exists (auto-created on startup)
- Check backend logs for PyMuPDF watermark errors
</details>

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 📚 Related Documentation

| Document | Description |
|---|---|
| [SETUP.md](./SETUP.md) | Step-by-step installation guide |
| [FIXES_APPLIED.md](./FIXES_APPLIED.md) | Changelog of applied fixes |
| [PROJECT_AUDIT_REPORT.md](./PROJECT_AUDIT_REPORT.md) | Code quality audit report |
| [API Guide](./frontend/src/lib/API_GUIDE.md) | Frontend API integration guide |

---

<p align="center">
  Built with 🔐 Security First · 🤖 AI Powered · ⚡ Modern Stack
</p>
