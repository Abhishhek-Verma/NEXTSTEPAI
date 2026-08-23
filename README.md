<div align="center">

  <img src="./frontend/public/logo.jpeg" alt="NextStepAI Logo" width="100" style="border-radius: 16px;" />

  # NextStepAI

  **Data-Driven Career Guidance, Coding Analytics & Personalized Roadmap Platform**

  [![Live Site](https://img.shields.io/badge/Live_Production-nextstepai.co.in-00E676?style=for-the-badge&logo=googlechrome&logoColor=white)](https://nextstepai.co.in)
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
  [![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)

  ---

  **Live Production Link**: [https://nextstepai.co.in](https://nextstepai.co.in)

</div>

---

> [!IMPORTANT]
> ### AI Training Model Status — Custom Model Under Active Development
> The **proprietary ML/AI Training Model**, which serves as the **main brain of NextStepAI**, is currently **under active training and processing**. 
> Once fully trained, this model will autonomously ingest multi-dimensional candidate data (including live coding profiles across platforms, academic performance, skill matrices, project complexity, and psychometric traits) to generate hyper-personalized step-by-step career roadmaps, skill gap predictions, and tailored career trajectory recommendations. In the interim, the platform leverages Google Gemini AI integration and specialized analytical heuristics to power live insights.

---

## Overview

**NextStepAI** is an all-in-one, intelligent career planning platform designed to bridge the gap between candidate skills and industry demands. By unifying academic records, platform-wide coding profiles (**GitHub, LeetCode, Codeforces, CodeChef**), project portfolios, technical skill metrics, and psychometric assessments, NextStepAI provides students and developer professionals with data-driven career recommendations and structured learning roadmaps.

---

## Key Features

- **Multi-Platform Coding Stats Aggregator**: Seamlessly connect and sync profile statistics, problem-solving counts, contest ratings, and contribution metrics from **GitHub**, **LeetCode**, **Codeforces**, and **CodeChef**.
- **AI-Generated Career Roadmaps**: Step-by-step milestone planning tailored to target career roles (e.g., Full Stack Engineer, AI/ML Specialist, DevOps Architect).
- **Career & Skill Recommendations**: Data-backed suggestions highlighting top role fits, priority skills to acquire, and target hiring companies.
- **Skill Gap Analysis**: In-depth evaluation identifying missing competencies required to unlock specific career paths.
- **Psychometric Evaluation**: Comprehensive personality and work-style assessment to evaluate career compatibility and soft-skill profiles.
- **Academic & Portfolio Tracking**: Manage SGPA/CGPA history, academic milestones, and showcase technical projects with live links and tech stack tags.
- **Enterprise-Grade Security & Authentication**: Powered by Clerk for passwordless and OAuth authentication, combined with rate-limiting, CORS policies, and Zod input validation.
- **Modern UI/UX**: Built with React 18, Vite, and Tailwind CSS, featuring responsive design and micro-animations.

---

## Repository & Project Structure

```
NEXTSTEPAI/
├── backend/                      # Node.js + Express API Server
│   ├── drizzle/                  # Drizzle ORM database migrations
│   ├── src/
│   │   ├── db/                   # Database schema (Drizzle ORM) & Neon Postgres client
│   │   ├── middleware/           # Auth validation (Clerk) & Zod request validation
│   │   ├── routes/               # Express API endpoints
│   │   │   ├── academic.js       # Academic records CRUD
│   │   │   ├── coding.js         # Coding platform profile sync & stats
│   │   │   ├── onboarding.js     # User initial setup flow
│   │   │   ├── projects.js       # Portfolio projects management
│   │   │   ├── psychometric.js   # Psychometric test processing
│   │   │   ├── recommendations.js# AI career suggestions
│   │   │   ├── roadmap.js        # Step-by-step career milestone generator
│   │   │   ├── skills.js         # Technical skills inventory
│   │   │   └── user.js           # Profile & account settings
│   │   ├── services/             # Core business logic & external integrations
│   │   │   ├── ai.js             # Google Gemini AI roadmap & analytical engine
│   │   │   ├── userProfile.js    # Data aggregation service
│   │   │   └── platforms/        # Real-time profile scrapers & GraphQL clients
│   │   │       ├── codechef.js   # CodeChef rating & problem solver
│   │   │       ├── codeforces.js # Codeforces contest & rating fetcher
│   │   │       ├── github.js     # GitHub repository & commit analyzer
│   │   │       └── leetcode.js   # LeetCode submission & stats fetcher
│   │   └── index.js              # API Server entry point & CORS configuration
│   ├── drizzle.config.js         # Drizzle ORM configuration
│   ├── migrate-schema.js         # Schema migration utility
│   ├── render.yaml               # Backend Render deployment setup
│   └── package.json              # Backend dependencies & scripts
│
├── frontend/                     # React 18 + Vite Web Application
│   ├── public/                   # Favicons & static branding assets
│   ├── src/
│   │   ├── api/                  # Axios API client setup & endpoint methods
│   │   ├── components/           # UI layout, Sidebar, Navbar, & reusable cards
│   │   ├── pages/                # Application routes & views
│   │   │   ├── academic/         # Academic record management page
│   │   │   ├── analyze/          # Skill gap & profile analytics view
│   │   │   ├── auth/             # Login & Registration pages (Clerk integrated)
│   │   │   ├── coding/           # Multi-platform coding stats dashboard
│   │   │   ├── landing-page/     # Public hero & landing experience
│   │   │   ├── onboarding/       # User profile setup & career targeting wizard
│   │   │   ├── profile/          # Account profile & target role settings
│   │   │   ├── projects/         # Portfolio & project showcase builder
│   │   │   ├── psychometric/     # Personality assessment questionnaire & results
│   │   │   ├── recommendations/  # AI career role match suggestions
│   │   │   ├── roadmap/          # Interactive milestone roadmap view
│   │   │   └── skills/           # Technical skills matrix builder
│   │   ├── store/                # Zustand global state stores
│   │   ├── styles/               # Tailwind CSS & global design system
│   │   ├── utils/                # Helper functions & data formatters
│   │   ├── App.jsx               # Main React entry component
│   │   ├── main.jsx              # Application bootstrap with Query & Auth Providers
│   │   └── Routes.jsx            # React Router v6 route configuration
│   ├── netlify.toml              # Netlify SPA redirect rules
│   ├── tailwind.config.js        # Tailwind styling system tokens
│   ├── vite.config.js            # Vite build configuration
│   └── package.json              # Frontend dependencies & scripts
│
├── QUICKSTART.md                 # Detailed step-by-step setup guide
└── README.md                     # Main repository documentation
```

---

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query), Axios
- **Authentication**: Clerk React SDK
- **Routing**: React Router v6
- **Hosting**: Netlify (Live at [nextstepai.co.in](https://nextstepai.co.in))

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Neon PostgreSQL (Serverless Postgres)
- **ORM**: Drizzle ORM
- **AI Integration**: Google Gemini 1.5 Flash SDK
- **Auth Verification**: Clerk Node SDK
- **Validation**: Zod
- **Scrapers / Fetchers**: Cheerio, Axios, GraphQL queries
- **Security**: Helmet, CORS, Express Rate Limit

---

## API Endpoints Overview

All protected endpoints require a valid Clerk JWT Bearer Token in the `Authorization` header.

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Health** | `GET` | `/health` | Server status check |
| **User** | `GET` | `/api/user/profile` | Fetch aggregate user profile & target role |
| **User** | `PUT` | `/api/user/profile` | Update target role and personal details |
| **Academic** | `GET` | `/api/academic` | Get user academic history & GPA records |
| **Academic** | `POST` | `/api/academic` | Save/update academic performance |
| **Coding** | `GET` | `/api/coding` | Retrieve connected platform handles & stats |
| **Coding** | `POST` | `/api/coding/sync` | Trigger live scraping & stats update (GitHub, LeetCode, Codeforces, CodeChef) |
| **Projects** | `GET` | `/api/projects` | Fetch candidate portfolio projects |
| **Projects** | `POST` | `/api/projects` | Add or update project details |
| **Skills** | `GET` | `/api/skills` | Fetch technical skill inventory |
| **Skills** | `POST` | `/api/skills` | Add/update skill levels and categories |
| **Psychometric**| `GET` | `/api/psychometric` | Fetch psychometric evaluation results |
| **Psychometric**| `POST` | `/api/psychometric/submit` | Submit psychometric test responses |
| **AI Insights** | `POST` | `/api/recommendations/generate` | Generate career match recommendations |
| **AI Roadmap** | `POST` | `/api/roadmap/generate` | Generate step-by-step career milestones |

---

## Database Architecture

The application uses **Neon PostgreSQL** managed through **Drizzle ORM**.

```sql
users (id, clerk_id, email, full_name, target_role, bio...)
  ├── academic_records (1:many)   --> Degree, institution, SGPA/CGPA, year
  ├── coding_profiles  (1:1)      --> GitHub, LeetCode, Codeforces, CodeChef handles & cached metrics
  ├── projects         (1:many)   --> Project title, description, live link, repo link, tech stack
  ├── skills           (1:many)   --> Skill name, proficiency level, category
  ├── psychometric_tests(1:1)     --> Work style scores, domain traits, analysis output
  ├── recommendations  (1:1)      --> Matched roles, key skill gaps, target companies
  └── roadmaps         (1:1)      --> Generated milestone phases, resources, progress status
```

---

## Local Development Setup

Follow these steps to run **NextStepAI** locally on your machine.

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- Account on [Neon Database](https://neon.tech)
- Account on [Clerk Authentication](https://clerk.com)
- API key from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Configure your `.env` file in `/backend`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/nextstep?sslmode=require
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
GEMINI_API_KEY=your_gemini_api_key
ALLOWED_ORIGINS=http://localhost:5173
```

Push schema to Neon PostgreSQL:
```bash
npm run db:push
```

Start the backend development server:
```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Configure your `.env` file in `/frontend`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Start the frontend development server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser to interact with the application.

---

## Security Practices

- **Authentication**: All API requests verified via Clerk JWT tokens.
- **Input Sanitization**: Request parameters validated using Zod schemas.
- **Rate Limiting**: Protected endpoints enforce strict request throttling.
- **HTTP Headers**: Enhanced headers enabled via `helmet`.
- **CORS Protection**: Access restricted strictly to configured origins.

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Support & Contact

- **Live Site**: [https://nextstepai.co.in](https://nextstepai.co.in)
- **Issues**: For bugs or feature requests, please open a [GitHub Issue](../../issues).

---

<p align="center">
  <strong>NextStepAI Platform</strong>
</p>

