# Authentication Setup Guide

This project now includes a complete authentication system with Supabase. Here's what has been implemented:

## Features Added

### 1. Landing Page (`/landing`)
- Public landing page with features showcase
- Call-to-action buttons for sign up/sign in
- Responsive design with modern UI

### 2. Authentication Page (`/auth`)
- Sign up and sign in forms
- Password visibility toggle
- Form validation and error handling
- Automatic profile creation on signup

### 3. Middleware Protection
- Route protection for authenticated pages
- Automatic redirects based on authentication status
- Protected routes: `/dashboard`, `/courses`, `/assessments`, `/chat`, `/leaderboard`, `/course`, `/lesson`, `/assessment`
- Public routes: `/`, `/auth`, `/landing`

### 4. User Management
- User context for global state management
- User menu with profile and logout options
- Automatic session management

## Environment Variables Required

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Judge0 Configuration
JUDGE0_API_URL=your_judge0_api_url
JUDGE0_API_KEY=your_judge0_api_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Supabase Database Schema

You'll need to create the following tables in your Supabase database:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course enrollments table
CREATE TABLE course_enrollments (
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_percentage INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

-- User progress table
CREATE TABLE user_progress (
  user_id UUID REFERENCES auth.users(id),
  lesson_id TEXT,
  course_id UUID REFERENCES courses(id),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER,
  time_spent INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id, course_id)
);

-- Chat history table
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  lesson_id TEXT,
  question TEXT,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning analytics table
CREATE TABLE learning_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  session_duration INTEGER,
  lessons_completed INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  description TEXT,
  type TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create policies (example - adjust as needed)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
```

## How It Works

1. **Unauthenticated users** are redirected to `/landing`
2. **Sign up/Sign in** happens on `/auth` page
3. **Authenticated users** can access all protected routes
4. **Middleware** automatically handles route protection
5. **User context** provides authentication state throughout the app

## Usage

1. Set up your Supabase project and get the required keys
2. Create the database schema as shown above
3. Add environment variables to `.env.local`
4. Run the development server: `pnpm dev`
5. Visit `http://localhost:3000` to see the landing page
6. Click "Get Started" to sign up or sign in

## Files Created/Modified

- `src/app/auth/page.tsx` - Authentication page
- `src/app/landing/page.tsx` - Landing page
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/components/auth/UserMenu.tsx` - User menu component
- `middleware.ts` - Route protection middleware
- `src/app/layout.tsx` - Updated with AuthProvider
- `src/app/page.tsx` - Updated with authentication checks
- `src/app/dashboard/page.tsx` - Updated with UserMenu
