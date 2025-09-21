import { createClient } from '@supabase/supabase-js'
import { env } from './env'

const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = env

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Service role client for admin operations
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Type definitions
interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface CourseEnrollment {
  user_id: string;
  course_id: string;
  enrollment_date: string;
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused';
  last_accessed: string;
}

interface UserProgress {
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  score?: number;
  time_spent?: number;
  updated_at: string;
}

interface ChatHistory {
  user_id: string;
  course_id: string;
  lesson_id: string;
  question: string;
  answer: string;
  created_at: string;
}

interface LearningAnalytics {
  user_id: string;
  course_id: string;
  session_duration: number;
  lessons_completed: number;
  created_at: string;
}

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// MCP-specific client configuration (if needed for MCP operations)
export const supabaseMCP = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  mcpKey: process.env.SUPABASE_MCP_KEY,
};
