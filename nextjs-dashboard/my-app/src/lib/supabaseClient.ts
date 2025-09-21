import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { env } from './env'

const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = env

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Service role client for admin operations
export const supabaseAdmin = supabaseServiceKey 
  ? createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Type definitions
export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  learning_goals?: string[];
  preferred_language?: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  short_description?: string;
  duration: string;
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_hours: number;
  tags: string[];
  thumbnail_url?: string;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  explanation: string;
  code_example?: string;
  key_points: string[];
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time_limit: number;
  instructions: string;
  starter_code?: string;
  test_cases: any[];
  expected_output?: string;
  course_id?: string;
  lesson_id?: string;
  is_published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrollment_date: string;
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused' | 'dropped';
  last_accessed: string;
  completed_at?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  time_spent: number;
  last_position: number;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AssessmentAttempt {
  id: string;
  user_id: string;
  assessment_id: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'abandoned';
  score?: number;
  submitted_code?: string;
  execution_result?: any;
  time_spent?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatHistory {
  id: string;
  user_id: string;
  course_id?: string;
  lesson_id?: string;
  assessment_id?: string;
  context: 'general_chat' | 'lesson_chat' | 'assessment_help' | 'course_guidance';
  question: string;
  answer: string;
  message_type: 'text' | 'code' | 'explanation';
  created_at: string;
}

export interface LearningAnalytics {
  id: string;
  user_id: string;
  course_id?: string;
  session_duration: number;
  lessons_completed: number;
  assessments_completed: number;
  total_score: number;
  session_date: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'course_completion' | 'streak' | 'assessment_score' | 'learning_time' | 'milestone';
  icon_url?: string;
  points: number;
  earned_at: string;
  metadata: any;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  streak_type: 'daily' | 'weekly';
  created_at: string;
  updated_at: string;
}

// Create client function for API routes
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

// Helper functions for database operations
export const dbHelpers = {
  // Create user profile
  async createProfile(userId: string, userData: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...userData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get user's courses with enrollment data
  async getUserCourses(userId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_enrollments!inner(
          user_id,
          enrollment_date,
          progress_percentage,
          status,
          last_accessed
        )
      `)
      .eq('course_enrollments.user_id', userId)
      .eq('course_enrollments.status', 'active')
      .order('course_enrollments.last_accessed', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create course enrollment
  async enrollInCourse(userId: string, courseId: string): Promise<CourseEnrollment> {
    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        progress_percentage: 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update user progress
  async updateProgress(userId: string, lessonId: string, courseId: string, progressData: Partial<UserProgress>): Promise<UserProgress> {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        ...progressData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Save chat interaction
  async saveChatInteraction(userId: string, courseId: string, lessonId: string, question: string, answer: string): Promise<ChatHistory> {
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        question,
        answer,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Log learning session
  async logLearningSession(userId: string, courseId: string, sessionData: Partial<LearningAnalytics>): Promise<LearningAnalytics> {
    const { data, error } = await supabase
      .from('learning_analytics')
      .insert({
        user_id: userId,
        course_id: courseId,
        ...sessionData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Create achievement
  async createAchievement(userId: string, achievementData: Partial<Achievement>): Promise<Achievement> {
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        user_id: userId,
        ...achievementData,
        earned_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
