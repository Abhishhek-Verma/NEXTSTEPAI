# NextStepAI Backend

Backend API for NextStepAI - Career planning and roadmap generation platform.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database (free tier available at [neon.tech](https://neon.tech))
- Clerk account for authentication ([clerk.com](https://clerk.com))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file:**
   - Add your Neon database URL from [console.neon.tech](https://console.neon.tech)
   - Add your Clerk keys from [dashboard.clerk.com](https://dashboard.clerk.com)

4. **Generate and push database schema:**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
All endpoints (except `/health`) require a valid Clerk JWT token in the `Authorization` header:
```
Authorization: Bearer <clerk_jwt_token>
```

### Health Check
- `GET /health` - Server health status

### User Profile
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update user profile
- `GET /api/user/stats` - Get user dashboard stats

### Academic Records
- `GET /api/academic/records` - Get all academic records
- `POST /api/academic/records` - Save/update academic records
- `DELETE /api/academic/records/:id` - Delete a specific record

### Coding Profiles
- `GET /api/coding/profile` - Get coding platform profiles
- `POST /api/coding/profile` - Save/update coding profiles

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Psychometric Tests
- `GET /api/psychometric/results` - Get test results
- `POST /api/psychometric/results` - Save/update test results
- `DELETE /api/psychometric/results` - Delete test results

### Career Recommendations
- `GET /api/recommendations` - Get recommendations
- `POST /api/recommendations/generate` - Generate new recommendations
- `POST /api/recommendations/save-role` - Save a recommended role
- `DELETE /api/recommendations/save-role/:roleId` - Unsave a role

### Career Roadmap
- `GET /api/roadmap` - Get user's roadmap
- `POST /api/roadmap/generate` - Generate a new roadmap
- `PUT /api/roadmap/items` - Update roadmap items
- `DELETE /api/roadmap` - Delete roadmap

### Onboarding
- `GET /api/onboarding` - Get onboarding data
- `POST /api/onboarding/complete` - Complete onboarding

## Database Schema

The database includes the following tables:

- **users** - User accounts (synced with Clerk)
- **academic_records** - Educational history
- **coding_profiles** - GitHub, LeetCode, Codeforces, CodeChef profiles
- **projects** - User project portfolio
- **psychometric_tests** - Career assessment results
- **recommendations** - AI-generated career recommendations
- **roadmaps** - Personalized career roadmaps
- **onboarding_data** - Initial user preferences

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)

### Project Structure

```
backend/
├── src/
│   ├── db/
│   │   ├── index.js       # Database connection
│   │   └── schema.js      # Database schema
│   ├── middleware/
│   │   ├── auth.js        # Clerk authentication
│   │   └── validation.js  # Zod validation schemas
│   ├── routes/
│   │   ├── academic.js
│   │   ├── coding.js
│   │   ├── projects.js
│   │   ├── psychometric.js
│   │   ├── recommendations.js
│   │   ├── roadmap.js
│   │   ├── onboarding.js
│   │   └── user.js
│   └── index.js           # Express app entry point
├── drizzle/               # Generated migrations
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json
└── drizzle.config.js      # Drizzle ORM config
```

## Security

- JWT-based authentication via Clerk
- Rate limiting (100 requests per 15 minutes)
- Helmet.js for security headers
- CORS protection
- Input validation with Zod
- SQL injection protection via Drizzle ORM

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `DATABASE_URL` | Neon PostgreSQL URL | `postgresql://user:pass@host/db` |
| `CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `ALLOWED_ORIGINS` | CORS origins | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests | `100` |

## License

MIT
