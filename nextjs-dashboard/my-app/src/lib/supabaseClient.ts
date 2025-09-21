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

interface Achievement {
  user_id: string;
  title: string;
  description: string;
  type: string;
  earned_at: string;
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