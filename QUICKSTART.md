# 🚀 Quick Start Guide

## Step 1: Set Up Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project called "nextstep"
3. Copy your connection string from the dashboard
4. It should look like: `postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/nextstep?sslmode=require`

## Step 2: Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application called "NextStepAI"
3. Go to "API Keys" in your Clerk dashboard
4. Copy your **Publishable Key** and **Secret Key**

## Step 3: Configure Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your credentials:
   ```env
   DATABASE_URL=postgresql://your-actual-neon-connection-string
   CLERK_PUBLISHABLE_KEY=pk_test_your-actual-key
   CLERK_SECRET_KEY=sk_test_your-actual-key
   ```

5. Push database schema to Neon:
   ```bash
   npm run db:push
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Server running on port 3000
   📝 Environment: development
   🔗 API Base URL: http://localhost:3000/api
   💚 Health check: http://localhost:3000/health
   ```

## Step 4: Configure Frontend

1. Open a new terminal and navigate to the frontend:
   ```bash
   cd landing-page
   ```

2. Create/update `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-actual-key
   ```

3. Install dependencies (if not already done):
   ```bash
   npm install
   ```

4. Start the frontend:
   ```bash
   npm run dev
   ```

   Frontend should open at `http://localhost:5173`

## Step 5: Test the Application

1. Open your browser to `http://localhost:5173`
2. Click "Get Started" or "Sign In"
3. Create an account using Clerk authentication
4. Complete the onboarding process
5. You should be redirected to your dashboard

## Verify Everything Works

1. **Backend Health Check**: Visit `http://localhost:3000/health` - should return `{"status":"ok"}`
2. **Frontend Loading**: Should see the NextStepAI landing page
3. **Authentication**: Sign up/sign in should work without errors
4. **Database**: After signup, check your Neon dashboard - `users` table should have a new entry

## Common Issues

### Issue: Database connection error
**Solution**: Double-check your `DATABASE_URL` in `.env` - ensure it includes `?sslmode=require` at the end

### Issue: Clerk authentication fails
**Solution**: Make sure both frontend and backend have the same Clerk keys, and the publishable key starts with `pk_test_`

### Issue: CORS error in browser
**Solution**: Verify `ALLOWED_ORIGINS` in backend `.env` includes `http://localhost:5173`

### Issue: 404 on API calls
**Solution**: Ensure backend is running on port 3000 and frontend `.env` has correct `VITE_API_BASE_URL`

## Next Steps

- Explore the API endpoints at `http://localhost:3000/api`
- Add your coding profiles (GitHub, LeetCode, etc.)
- Create projects in your portfolio
- Take the psychometric assessment
- Generate your personalized career roadmap

## Need Help?

- Backend README: `backend/README.md`
- API Documentation: Check the endpoints section in README
- Database Schema: View `backend/src/db/schema.js`

Happy coding! 🎉
