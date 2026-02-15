# NextStepAI - Full Stack Project

A modern career planning and roadmap generation platform built with React, Node.js, and Neon PostgreSQL.

## 📁 Project Structure

```
nextstep/
├── backend/              # Node.js + Express API Server
│   ├── src/
│   │   ├── db/          # Database schema and connection
│   │   ├── middleware/  # Auth and validation
│   │   ├── routes/      # API endpoints
│   │   └── index.js     # Server entry point
│   ├── package.json
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── landing-page/         # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand state management
│   │   ├── api/         # API client and hooks
│   │   └── main.jsx     # App entry point
│   └── package.json
│
└── QUICKSTART.md         # Setup instructions
```

## 🚀 Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

### TL;DR

1. **Set up Neon Database** at [neon.tech](https://neon.tech)
2. **Set up Clerk Auth** at [clerk.com](https://clerk.com)
3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your credentials to .env
   npm run db:push
   npm run dev
   ```
4. **Frontend Setup**:
   ```bash
   cd landing-page
   npm install
   cp .env.example .env
   # Add your Clerk key to .env
   npm run dev
   ```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Data fetching
- **Clerk** - Authentication
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Drizzle ORM** - Database toolkit
- **Neon PostgreSQL** - Serverless database
- **Clerk SDK** - Auth verification
- **Zod** - Validation

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get up and running
- [Backend README](./backend/README.md) - API documentation
- [Backend Architecture](./backend/ARCHITECTURE.md) - System design

## 🔑 Key Features

- ✅ User authentication with Clerk
- ✅ Academic records tracking
- ✅ Coding profile management (GitHub, LeetCode, etc.)
- ✅ Project portfolio
- ✅ Psychometric career assessment
- ✅ AI-powered career recommendations
- ✅ Personalized career roadmap
- ✅ Onboarding flow
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Collapsible sidebar navigation

## 🌐 API Endpoints

All endpoints require Clerk JWT authentication.

### Core Resources
- `/api/user` - User profile management
- `/api/academic` - Academic records
- `/api/coding` - Coding platform profiles
- `/api/projects` - Project portfolio
- `/api/psychometric` - Career assessments
- `/api/recommendations` - Career suggestions
- `/api/roadmap` - Career roadmap
- `/api/onboarding` - User onboarding

See [Backend README](./backend/README.md) for full API documentation.

## 🗄️ Database Schema

```sql
users
  └── academic_records (1:many)
  └── coding_profiles (1:1)
  └── projects (1:many)
  └── psychometric_tests (1:1)
  └── recommendations (1:1)
  └── roadmaps (1:1)
  └── onboarding_data (1:1)
```

Full schema: [backend/src/db/schema.js](./backend/src/db/schema.js)

## 🔒 Security Features

- JWT-based authentication via Clerk
- Rate limiting (100 req/15min)
- CORS protection
- Helmet security headers
- Input validation with Zod
- SQL injection protection
- XSS protection

## 🚀 Deployment

### Backend Deployment (Recommended: Railway/Render)

1. Connect your Git repository
2. Set environment variables
3. Deploy from `backend` directory
4. Set start command: `npm start`

### Frontend Deployment (Recommended: Vercel/Netlify)

1. Connect your Git repository
2. Set build directory: `landing-page`
3. Set build command: `npm run build`
4. Set environment variables
5. Deploy

### Database
- Neon handles hosting and scaling automatically
- No additional deployment needed

## 📊 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

## 🧪 Development

### Backend Commands
```bash
npm run dev        # Start dev server with hot reload
npm start         # Start production server
npm run db:push   # Push schema to database
npm run db:studio # Open database GUI
```

### Frontend Commands
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ by the NextStepAI Team
