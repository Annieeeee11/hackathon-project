# Environment Variables Setup Guide

## 🚨 Required Environment Variables

Your application is missing required environment variables. You need to create a `.env.local` file in the root directory with the following variables:

## 📝 Create `.env.local` file

Create a file named `.env.local` in the root directory (`/nextjs-dashboard/my-app/`) with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Judge0 Configuration (for code execution)
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_judge0_api_key_here

# NextAuth Configuration (optional)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database Configuration (optional)
DATABASE_URL=your_database_url_here

# Redis Configuration (optional)
REDIS_URL=your_redis_url_here

# File Upload Configuration (optional)
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

## 🔑 How to Get API Keys

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon/public key
5. For service role key, copy the service_role key (keep this secret!)

### 2. OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### 3. Judge0 Setup (Optional - for code execution)
1. Go to [rapidapi.com](https://rapidapi.com)
2. Search for "Judge0 CE" API
3. Subscribe to the free plan
4. Copy the API key from the dashboard

## 🚀 Quick Start (Minimal Setup)

For a quick start, you only need these **required** variables:

```bash
# Minimum required for the app to run
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=sk-your_openai_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_judge0_key
```

## 🔧 Alternative: Disable Judge0 (if you don't need code execution)

If you don't need code execution features, you can modify the environment validation to make Judge0 optional. Let me know if you want me to do this.

## ✅ After Setup

1. Create the `.env.local` file with your actual API keys
2. Restart your development server (`npm run dev` or `pnpm dev`)
3. The application should now load without environment variable errors

## 🛡️ Security Notes

- Never commit `.env.local` to version control
- Keep your API keys secure
- Use different keys for development and production
- The `.env.local` file is already in `.gitignore`

## 🆘 Need Help?

If you need help getting any of these API keys or setting up the services, let me know and I can provide more detailed instructions for each service.
