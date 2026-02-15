# NextStepAI - Backend Architecture Documentation

## 🏗️ System Architecture

### Overview
NextStepAI uses a modern, scalable architecture with:
- **Frontend**: React 18 + Vite + Tailwind CSS + Clerk Auth
- **Backend**: Node.js + Express.js (REST API)
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk JWT-based auth

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                            │
│  (React + Vite + Tailwind + Zustand + React Query)      │
│                 localhost:5173                           │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP/HTTPS + JWT Token
                  ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend API Server                      │
│              (Express.js + Node.js)                      │
│                 localhost:3000                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                  │  │
│  │  - CORS                                            │  │
│  │  - Rate Limiting                                   │  │
│  │  - Clerk JWT Verification                          │  │
│  │  - Request Validation (Zod)                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes                                        │  │
│  │  /api/user          /api/projects                  │  │
│  │  /api/academic      /api/psychometric             │  │
│  │  /api/coding        /api/recommendations          │  │
│  │  /api/roadmap       /api/onboarding               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │ SQL Queries (Drizzle ORM)
                  ↓
┌─────────────────────────────────────────────────────────┐
│              Neon PostgreSQL Database                    │
│                  (Serverless)                            │
│                                                          │
│  Tables:                                                 │
│  - users                    - recommendations            │
│  - academic_records         - roadmaps                   │
│  - coding_profiles          - onboarding_data            │
│  - projects                                              │
│  - psychometric_tests                                    │
└─────────────────────────────────────────────────────────┘
```

## 📊 Database Schema

### Entity Relationship Diagram

```
users (1) ──────── (*) academic_records
  │
  ├── (1:1) ────── coding_profiles
  │
  ├── (1:*) ────── projects
  │
  ├── (1:1) ────── psychometric_tests
  │
  ├── (1:1) ────── recommendations
  │
  ├── (1:1) ────── roadmaps
  │
  └── (1:1) ────── onboarding_data
```

### Table Descriptions

#### users
**Purpose**: Central user table synced with Clerk authentication
**Key Fields**: 
- `clerk_id` (unique): Clerk user identifier
- `email`: User email address
- `onboarding_completed`: Whether user completed onboarding

#### academic_records
**Purpose**: Store educational history (degree, GPA, institution)
**Relationship**: Many-to-One with users
**Key Fields**: 
- `degree`, `institution`, `major`
- `gpa`, `semester`
- `isCurrentlyEnrolled`

#### coding_profiles
**Purpose**: Store coding platform accounts and metrics
**Relationship**: One-to-One with users
**Platforms**: GitHub, LeetCode, Codeforces, CodeChef
**Key Fields**: Username/handle, profile URL, metrics (JSON)

#### projects
**Purpose**: User's project portfolio
**Relationship**: Many-to-One with users
**Key Fields**: 
- `title`, `description`
- `technologies` (JSON array)
- `githubUrl`, `liveUrl`
- `status`: completed | in-progress | planned

#### psychometric_tests
**Purpose**: Career personality/traits assessment results
**Relationship**: One-to-One with users
**Key Fields**: 
- `traits` (JSON): Personality traits
- `score`, `progress`
- `responses` (JSON): Test responses

#### recommendations
**Purpose**: AI-generated career recommendations
**Relationship**: One-to-One with users
**Key Fields**: 
- `roles` (JSON): Recommended career roles
- `skills` (JSON): Skills to develop
- `companies` (JSON): Target companies
- `savedRoles` (JSON): User-saved recommendations

#### roadmaps
**Purpose**: Personalized career development roadmap
**Relationship**: One-to-One with users
**Key Fields**: 
- `title`, `targetRole`
- `items` (JSON): Roadmap tasks/milestones

#### onboarding_data
**Purpose**: Initial user preferences and goals
**Relationship**: One-to-One with users
**Key Fields**: 
- `currentEducation`, `graduationYear`
- `careerGoals`, `interests`, `skills` (JSON arrays)

## 🔐 Authentication Flow

### Token Verification Process

```
1. User logs in via Clerk on frontend
   ↓
2. Frontend receives JWT token from Clerk
   ↓
3. Frontend includes token in API request headers:
   Authorization: Bearer <jwt_token>
   ↓
4. Backend auth middleware intercepts request
   ↓
5. Middleware verifies token with Clerk API
   ↓
6. If valid: Get/create user in database
   ↓
7. Attach user object to req.user
   ↓
8. Route handler accesses req.user
```

### Security Measures

- **JWT Verification**: All protected routes verify Clerk tokens
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Security headers
- **CORS**: Restricted to allowed origins
- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection Protection**: Drizzle ORM parameterized queries
- **User Isolation**: All queries filtered by `userId`

## 🛣️ API Endpoints Reference

### Authentication Required
All endpoints require `Authorization: Bearer <token>` header

### User Management
```
GET    /api/user           - Get user profile
PUT    /api/user           - Update user profile
GET    /api/user/stats     - Get dashboard statistics
```

### Academic Records
```
GET    /api/academic/records       - List all records
POST   /api/academic/records       - Save/update records (batch)
DELETE /api/academic/records/:id   - Delete single record
```

### Coding Profiles
```
GET    /api/coding/profile    - Get all platform profiles
POST   /api/coding/profile    - Save/update profiles
```

### Projects Portfolio
```
GET    /api/projects          - List all projects
GET    /api/projects/:id      - Get single project
POST   /api/projects          - Create new project
PUT    /api/projects/:id      - Update project
DELETE /api/projects/:id      - Delete project
```

### Psychometric Assessment
```
GET    /api/psychometric/results    - Get test results
POST   /api/psychometric/results    - Save test progress/results
DELETE /api/psychometric/results    - Clear test results
```

### Career Recommendations
```
GET    /api/recommendations                      - Get recommendations
POST   /api/recommendations/generate             - Generate new recommendations
POST   /api/recommendations/save-role            - Save a role
DELETE /api/recommendations/save-role/:roleId    - Unsave a role
```

### Career Roadmap
```
GET    /api/roadmap              - Get user's roadmap
POST   /api/roadmap/generate     - Generate new roadmap
PUT    /api/roadmap/items        - Update roadmap items
DELETE /api/roadmap              - Delete roadmap
```

### Onboarding
```
GET    /api/onboarding            - Get onboarding data
POST   /api/onboarding/complete   - Complete onboarding
```

## 🔄 Data Flow Examples

### Example 1: User Saves Academic Records

```
Frontend → API Request:
POST /api/academic/records
Body: { records: [{ degree: "BS", gpa: 3.8, ... }] }
Headers: { Authorization: "Bearer <token>" }

Backend Processing:
1. Auth middleware verifies token
2. Identifies user from JWT
3. Validation middleware checks data with Zod
4. Route handler deletes existing records
5. Inserts new records with user_id
6. Returns updated records

Database:
DELETE FROM academic_records WHERE user_id = 1;
INSERT INTO academic_records (user_id, degree, gpa, ...) VALUES ...;

Response:
{ message: "Academic records saved", records: [...] }
```

### Example 2: User Generates Roadmap

```
Frontend → API Request:
POST /api/roadmap/generate
Body: { title: "Software Engineer Path", targetRole: "Senior Dev", items: [...] }

Backend Processing:
1. Auth verification
2. Validate roadmap schema
3. Check if roadmap exists for user (UPSERT logic)
4. Insert/update roadmap record
5. Set generatedAt timestamp

Database:
INSERT INTO roadmaps (user_id, title, target_role, items, generated_at)
VALUES (1, 'Software Engineer Path', 'Senior Dev', [...], NOW())
ON CONFLICT (user_id) DO UPDATE SET ...;

Response:
{ message: "Roadmap generated", roadmap: {...} }
```

## 🚀 Deployment Considerations

### Environment-Specific Configurations

**Development**:
- Detailed logging (morgan 'dev')
- CORS allows localhost
- Error stack traces included

**Production**:
- Minimal logging (morgan 'combined')
- Strict CORS policy
- No error stack traces
- SSL/TLS required for database
- Environment variables via platform secrets

### Scaling Strategies

1. **Database**: Neon auto-scales, use connection pooling
2. **API Server**: Horizontal scaling with load balancer
3. **Caching**: Add Redis for frequently accessed data
4. **CDN**: Serve static frontend assets via CDN
5. **Rate Limiting**: Adjust based on user base

### Monitoring & Logging

- Health check endpoint: `/health`
- Structured logging with timestamps
- Error tracking (consider Sentry integration)
- Database query performance monitoring

## 🔮 Future Enhancements

### Planned Features

1. **AI Integration**
   - OpenAI/Anthropic for intelligent recommendations
   - Career path prediction models
   - Resume analysis and optimization

2. **Real-time Features**
   - WebSocket for live progress tracking
   - Real-time collaboration on roadmaps
   - Instant notifications

3. **Analytics Dashboard**
   - User progress tracking
   - Goal completion metrics
   - Trend analysis

4. **Third-party Integrations**
   - GitHub API for real repo stats
   - LeetCode API for problem solving stats
   - LinkedIn integration
   - Calendar sync for roadmap deadlines

5. **Advanced Features**
   - Peer mentorship matching
   - Resource recommendations (courses, books)
   - Interview preparation tracking
   - Skill gap analysis

### Technical Improvements

- GraphQL API option
- Automated testing (Jest, Supertest)
- CI/CD pipeline
- Database migration versioning
- API documentation (Swagger/OpenAPI)
- Webhook support for integrations

## 📚 Developer Resources

### Key Files
- Schema: `backend/src/db/schema.js`
- Routes: `backend/src/routes/*.js`
- Middleware: `backend/src/middleware/*.js`
- Config: `backend/drizzle.config.js`

### Useful Commands
```bash
# View database in browser
npm run db:studio

# Generate migration files
npm run db:generate

# Apply schema changes
npm run db:push
```

### Testing Tips
- Use Postman/Insomnia for API testing
- Get JWT token from browser DevTools (Network tab)
- Check Neon dashboard for query monitoring
- Use `queries.sql` for database inspection

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Maintainer**: NextStepAI Team
