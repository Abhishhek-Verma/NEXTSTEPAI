<div align="center">

  <img src="./frontend/public/logo.jpeg" alt="NextStepAI Logo" width="110" style="border-radius: 20px;" />

  # NextStepAI
  ### A Multi-Modal Hybrid Intelligence Framework for Holistic Career Trajectory Planning

  [![Live Site](https://img.shields.io/badge/Live_Production-nextstepai.co.in-00E676?style=for-the-badge&logo=googlechrome&logoColor=white)](https://nextstepai.co.in)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Database: Neon](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
  [![LPU Inference: Groq](https://img.shields.io/badge/LPU_Inference-Groq_Cloud-F55036?style=for-the-badge&logo=fastapi&logoColor=white)](https://groq.com/)
  [![Auth: Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

  🌐 **Live Frontend**: [https://nextstepai.co.in](https://nextstepai.co.in)  
  ⚡ **Live API Service**: [https://nextstepai-051p.onrender.com](https://nextstepai-051p.onrender.com)

</div>

---

## 📌 Abstract & Research Foundation

Traditional career counseling relies on static academic marks (CGPA) or keyword-matching resume parsers that fail to capture the multidimensional nature of human potential. **NextStepAI** introduces an autonomous, bias-mitigated, and privacy-centered architecture based on **Multi-Modal Machine Learning** to democratize personalized career trajectory planning.

The platform synthesizes four distinct modalities:
1. **Academic Performance ($V_A$)**: Normalization across standard grading scales (CGPA / GPA) with structured course-level proficiency.
2. **Practical Coding Engine ($S_P$)**: Real-time API telemetry and non-linear logarithmic difficulty scoring across **LeetCode, CodeChef, Codeforces, and GitHub**.
3. **Psychometric & Aptitude Profiling ($V_{\text{Psy}}$)**: Digital psychometrics mapping situational traits into the standard 5-dimensional Big Five **OCEAN** vector $[O, C, E, A, N]$.
4. **Hybrid Recommendation Core**: Combines Content-Based Cosine Similarity with Collaborative Filtering through **Dynamic $\lambda$ Hybridization** to resolve the cold-start challenge.

> **Academic Citation**:
> *Verma, A., Maan, S., Maurya, A., Rauniya, A., Dubey, G., & Sharma, A. "NextStepAI: A Multi-Modal Hybrid Intelligence Framework for Holistic Career Trajectory Planning." Department of Computer Science, Krishna Institute of Engineering & Technology (KIET), Ghaziabad, Delhi-NCR, India.*

---

## 🏛️ System Architecture

The NextStepAI system employs a **modular microservices architecture** operating on a two-tier paradigm: a deterministic mathematical core and a fast generative explanation layer.

```
+--------------------------------------------------------------------------------------------------+
| 1. MULTI-SOURCE DATA INGESTION                                                                    |
|    - Academic Transcripts (GPA / Course Records)                                                  |
|    - Competitive Coding APIs (LeetCode, Codeforces, CodeChef Metrics)                            |
|    - Open-Source Telemetry (GitHub Commits, Stars, Language Diversity)                             |
|    - Psychometric Assessment Engine (Situational Work-Style Traits)                              |
+--------------------------------------------------------------------------------------------------+
                                               |
                                               v
+--------------------------------------------------------------------------------------------------+
| 2. MULTI-MODAL FEATURE EXTRACTION & NORMALIZATION (mathEngine.js)                                 |
|    - Module A: Academic Score Normalization -> V_A in [0, 1]                                      |
|    - Module B: Practical Skill Score -> S_P in [0, 1] (Equation 1)                                |
|    - Module C: Big Five Psychometric Vector -> V_Psy = [O, C, E, A, N]                           |
|    - Project Evidence Score -> V_Proj in [0, 1]                                                  |
|    => Unified Candidate Vector: U = [V_A, S_P, V_Psy, V_Proj]                                    |
+--------------------------------------------------------------------------------------------------+
                                               |
                                               v
+--------------------------------------------------------------------------------------------------+
| 3. HYBRID FUSION & INCLINATION ENGINE                                                             |
|    - Career Representation Catalog: Canonical Industry Vectors (C_j)                             |
|    - Content-Based Filtering: Cosine Similarity Score_CBF(U, C_j) (Equation 2)                    |
|    - Dynamic Hybridization: Score_Final = lambda * Score_CBF + (1 - lambda) * Score_CF (Eq 3)     |
|    - Track Classifier: Predicts Track T (Product Engineering, R&D/Systems, Corporate Tech)       |
|    - Pairwise Deletion Confidence Layer: Quantifies measurement certainty                        |
+--------------------------------------------------------------------------------------------------+
                                               |
                                               v
+--------------------------------------------------------------------------------------------------+
| 4. FAST GENERATIVE EXPLANATION & MILESTONE DAG LAYER (ai.js)                                     |
|    - Powered by Groq Cloud LPU Inference (llama-3.3-70b-versatile @ 500+ tok/s, 100% Free Tier)  |
|    - Grounded Explanation: Receives pre-computed decision object, writes evidence-backed rationale |
|    - Generative Milestone DAG: Outputs structured learning roadmap (phases, weeks, resources)     |
+--------------------------------------------------------------------------------------------------+
                                               |
                                               v
+--------------------------------------------------------------------------------------------------+
| 5. INTERACTIVE DASHBOARD & PRESENTATION                                                           |
|    - Live Vector Breakdown Radar & Cards | Interactive Drag-and-Drop Roadmap | Career Matches     |
+--------------------------------------------------------------------------------------------------+
```

---

## 📐 Mathematical Formulations

### 1. Practical Skill Score ($S_P$) — Equation (1)
$$S_P = \alpha \left(\frac{R_{\text{current}}}{R_{\text{max\_goal}}}\right) + \beta \left( \sum_{d \in \{E,M,H\}} w_d \cdot \log(1 + N_d) \right) + \gamma (G_{\text{act}})$$

- **$R_{\text{current}} / R_{\text{max\_goal}}$**: Average contest rating across competitive platforms normalized by platform-specific ceilings (LeetCode: $2400$, Codeforces: $2400$, CodeChef: $2200$).
- **Difficulty Log-Sum**: Weights the count of solved problems by complexity ($w_{\text{easy}} = 1.0, w_{\text{med}} = 2.0, w_{\text{hard}} = 4.0$), normalized by saturation ceiling base ($35.0$).
- **$G_{\text{act}}$**: Normalized GitHub activity and repository contribution velocity.
- **Calibrated Hyperparameters**: $\alpha = 0.40, \beta = 0.40, \gamma = 0.20$.

### 2. Content-Based Cosine Similarity — Equation (2)
$$\text{Score}_{\text{CBF}}(U, C_j) = \frac{U \cdot C_j}{\|U\| \cdot \|C_j\|} = \frac{\sum_{k=1}^D U_k \cdot C_{jk}}{\sqrt{\sum_{k=1}^D U_k^2} \sqrt{\sum_{k=1}^D C_{jk}^2}}$$

- Pairwise deletion handles unmeasured dimensions without penalizing the candidate with false zeroes.

### 3. Dynamic Hybridization & Cold-Start — Equation (3)
$$\text{Score}_{\text{Final}} = \lambda \cdot \text{Score}_{\text{CBF}} + (1 - \lambda) \cdot \text{Score}_{\text{CF}}$$
$$\lambda(n) = \max\left(0.5, 0.5 + 0.5 \cdot e^{-0.25 \cdot n}\right)$$

- For new candidates with zero historical interaction data ($n = 0$), $\lambda \to 1.0$ (cold-start mitigation). As portfolio interactions and milestones accumulate, $\lambda$ decays gracefully to incorporate community collaborative success vectors.

### 4. Confidence Estimation
$$\text{Confidence} = \max\left(0.30, 1.0 - \frac{\text{droppedDimensions}}{\text{totalDimensions}}\right)$$

---

## 📊 Experimental Evaluation (Paper Benchmark)

In Section 4 of the research paper, NextStepAI was evaluated against **5,000 anonymized candidate profiles** using standard Information Retrieval metrics: **Precision@5**, **Precision@10**, and **Normalized Discounted Cumulative Gain (NDCG)**.

### Performance Comparison

| Model Architecture | Precision@5 | Precision@10 | NDCG |
| :--- | :---: | :---: | :---: |
| **Baseline 1: Academic-Only Model** *(CGPA-centric)* | 0.62 | 0.58 | 0.65 |
| **Baseline 2: Resume Parser Model** *(Keyword/Text)* | 0.71 | 0.67 | 0.74 |
| **NextStepAI (Multi-Modal Hybrid Architecture)** | **0.91** | **0.89** | **0.92** |

> *Reproduce benchmark data locally by running `node backend/benchmark/evaluate.js`.*

---

## 📂 Repository Structure

```
NEXTSTEPAI/
├── backend/
│   ├── benchmark/
│   │   └── evaluate.js              # 5,000-cohort empirical evaluation harness (Table 1)
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.js             # Neon PostgreSQL serverless client
│   │   │   └── schema.js            # Normalized Drizzle ORM schema (roadmaps, recs, etc.)
│   │   ├── middleware/
│   │   │   ├── auth.js              # Clerk JWT bearer token authentication
│   │   │   └── validation.js        # Zod input validation schemas
│   │   ├── routes/
│   │   │   ├── academic.js          # Academic records CRUD & normalization
│   │   │   ├── analysis.js          # Live AI career analysis & track classifier endpoint
│   │   │   ├── coding.js            # Platform sync (GitHub, LeetCode, CF, CC)
│   │   │   ├── onboarding.js        # Candidate onboarding profile setup
│   │   │   ├── projects.js          # Portfolio projects & live demo links
│   │   │   ├── psychometric.js      # Psychometric traits assessment
│   │   │   ├── recommendations.js   # Multi-modal hybrid recommendation generator
│   │   │   ├── roadmap.js           # Career milestone DAG generator & item tracker
│   │   │   ├── skills.js            # Technical & soft skills matrix
│   │   │   └── user.js              # User profile & stats
│   │   ├── services/
│   │   │   ├── ai.js                # Groq Cloud LPU engine (llama-3.3-70b-versatile)
│   │   │   ├── careersCatalog.js    # Canonical 4D career target vectors (C_j)
│   │   │   ├── mathEngine.js        # Deterministic math engine (Eq 1, 2, 3, V_A, S_P)
│   │   │   ├── userProfile.js       # Profile aggregation service
│   │   │   └── platforms/           # Platform API clients (GraphQL & scrapers)
│   │   │       ├── codechef.js      # CodeChef profile scraper
│   │   │       ├── codeforces.js    # Codeforces API client
│   │   │       ├── github.js        # GitHub REST API & contribution calculator
│   │   │       └── leetcode.js      # LeetCode GraphQL client
│   │   └── index.js                 # Express server bootstrap & security headers
│   ├── apply-migrations.js          # Database schema migration executor
│   ├── test-mathEngine.js           # 18-step deterministic math engine unit tests
│   ├── test-db.js                   # Neon Postgres connectivity & FK constraint tests
│   ├── render.yaml                  # Render cloud infrastructure-as-code spec
│   ├── package.json                 # Backend dependencies (groq-sdk, drizzle, neon)
│   └── .env.example                 # Backend environment variable template
│
├── frontend/
│   ├── src/
│   │   ├── api/client.js            # Axios client with Clerk auth interceptors
│   │   ├── components/              # Reusable UI component library (cards, modals)
│   │   ├── pages/
│   │   │   ├── academic/            # Academic grades & coursework management
│   │   │   ├── analyze/             # Live Track Inclination & Vector Breakdown UI
│   │   │   ├── coding/              # Competitive coding & GitHub telemetry view
│   │   │   ├── landing-page/        # Hero page & interactive marketing experience
│   │   │   ├── onboarding/          # Candidate goal onboarding wizard
│   │   │   ├── profile/             # Profile settings & target tracks
│   │   │   ├── projects/            # Practical project showcase builder
│   │   │   ├── psychometric/        # Psychometric assessment & radar charts
│   │   │   ├── recommendations/     # Recommended roles, skill gaps & target companies
│   │   │   └── roadmap/             # Drag-and-drop learning milestone DAG
│   │   ├── store/                   # Zustand state management slices
│   │   └── App.jsx                  # Root application router
│   ├── tailwind.config.js           # Custom design tokens & palette
│   └── package.json                 # Frontend dependencies (React 18, Vite, Recharts)
│
└── README.md                        # Project documentation & academic report
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Zustand | Responsive client SPA with fluid micro-interactions |
| **Styling & Icons** | Tailwind CSS, Lucide React, Recharts | Data visualizations (radar charts, progress indicators) |
| **Backend Runtime** | Node.js (v18+), Express.js | High-throughput asynchronous REST API |
| **Database** | Neon PostgreSQL (Serverless) | Scalable relational storage & ACID persistence |
| **ORM** | Drizzle ORM | Type-safe SQL query builder and migrations |
| **AI Inference** | Groq Cloud LPU (`llama-3.3-70b-versatile`) | Ultra-fast (500+ tok/s), $0-cost explanation generation |
| **Authentication** | Clerk Auth SDK | Passwordless, Google/GitHub OAuth, JWT verification |
| **Scrapers & APIs** | Cheerio, Axios, GraphQL | Real-time LeetCode, Codeforces, CodeChef, GitHub telemetry |
| **Deployment** | Render (Backend) + Netlify (Frontend) | Global edge CDN and autoscaling container hosting |

---

## ⚙️ Environment Variables (Ready for Render & Local Setup)

Copy and paste the block below directly into your local `backend/.env` or into **Render Dashboard $\to$ Environment Variables**:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Neon PostgreSQL Database URL
DATABASE_URL=postgresql://user:password@ep-xxxxx.neon.tech/neondb?sslmode=require

# Clerk Authentication (Get from https://dashboard.clerk.com)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Groq Cloud API (100% Free Tier - Get key from https://console.groq.com/keys)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile

# Optional Fallback Provider
OPENAI_API_KEY=

# GitHub API Token (Get classic token from https://github.com/settings/tokens)
GITHUB_TOKEN=ghp_your_github_token_here

# CORS Origins
ALLOWED_ORIGINS=https://nextstepai.co.in,http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🚀 Quick Setup & Local Execution

### 1. Clone the Repository
```bash
git clone https://github.com/Abhishhek-Verma/NEXTSTEPAI.git
cd NEXTSTEPAI
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL, CLERK keys, and GROQ_API_KEY in .env

npm install
node apply-migrations.js    # Applies database schema updates safely
npm run dev                 # Starts Express server on http://localhost:3000
```

### 3. Configure Frontend
```bash
cd ../frontend
npm install
npm run dev                 # Starts Vite dev server on http://localhost:5173
```

### 4. Run Automated Verification Tests
```bash
cd ../backend
node test-mathEngine.js     # Validates mathematical engine formulas (18/18 PASS)
node benchmark/evaluate.js  # Runs 5,000-cohort empirical benchmark
```

---

## 🌍 Social & Economic Impact (UN SDGs)

- **UN SDG 4 (Quality Education)**: Bridges the career guidance gap by providing democratized, data-backed roadmaps to students regardless of institutional privilege or socio-economic background.
- **UN SDG 8 (Decent Work & Economic Growth)**: Eliminates frictional talent mismatch by aligning candidate competencies directly with industry demands.

---

## 📄 License & Attribution

Distributed under the **MIT License**. See `LICENSE` for details.

Developed with ❤️ by the **NextStepAI Research & Engineering Team** at **KIET Group of Institutions**.
For live usage, visit [https://nextstepai.co.in](https://nextstepai.co.in).
