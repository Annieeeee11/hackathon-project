import { useState, useEffect, useCallback } from 'react'
import { supabase, dbHelpers } from '../lib/supabaseClient'
import { User } from '@supabase/supabase-js'

// Type definitions
interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface Lesson {
  id: number;
  title: string;
  completed: boolean;
}

interface Course {
  id: string | number;
  title: string;
  description: string;
  duration?: string;
  tags?: string[];
  lessons?: Lesson[];
  created_at: string;
  status?: string;
  progress?: number;
}

interface UserProgress {
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  progressData?: Array<{ status: string; progress_percentage: number }>;
}

interface Conversation {
  question: string;
  answer?: string;
  course?: string;
  time: string;
}

interface Achievement {
  title: string;
  description: string;
  badge_url?: string;
  type?: string;
  earned_at?: string;
}

interface LearningAnalytics {
  totalSessions: number;
  totalTime: number;
  averageScore: number;
  streak: number;
  sessionData?: Array<{ total_time_minutes?: number; average_score?: number; created_at: string }>;
}

interface DashboardData {
  courses: Course[];
  userProgress: UserProgress;
  recentConversations: Conversation[];
  achievements: Achievement[];
  learningAnalytics: LearningAnalytics;
}

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    courses: [],
    userProgress: { totalLessons: 0, completedLessons: 0, averageScore: 0 },
    recentConversations: [],
    achievements: [],
    learningAnalytics: { totalSessions: 0, totalTime: 0, averageScore: 0, streak: 0 }
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        // Create demo user for development
        setUser({ id: 'demo-user', email: 'demo@mentor3d.com' } as User)
        setProfile({ id: 'demo-user', full_name: 'Demo User', role: 'student' })
        loadDemoData()
        return
      }

      setUser(user)

      // Get or create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      let finalProfileData = profileData;

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        finalProfileData = await dbHelpers.createProfile(user.id, {
          email: user.email,
          full_name: user.user_metadata?.full_name || 'Student'
        })
      } else if (profileError) {
        throw profileError
      }

      setProfile(finalProfileData)

      // Fetch all dashboard data
      const [courses, userProgress, conversations, achievements, analytics] = await Promise.all([
        fetchUserCourses(user.id),
        fetchUserProgress(user.id),
        fetchRecentConversations(user.id),
        fetchAchievements(user.id),
        fetchLearningAnalytics(user.id)
      ])

      setDashboardData({
        courses,
        userProgress,
        recentConversations: conversations,
        achievements,
        learningAnalytics: analytics
      })

    } catch (error) {
      console.error('Dashboard error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      loadDemoData()
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUserCourses = async (userId: string): Promise<Course[]> => {
    try {
      const courses = await dbHelpers.getUserCourses(userId)
      return courses.map((course: Course & { course_enrollments?: Array<{ progress_percentage?: number }> }) => ({
        ...course,
        lessons: course.lessons || [],
        progress: course.course_enrollments?.[0]?.progress_percentage || 0
      }))
    } catch (error) {
      console.error('Error fetching courses:', error)
      return []
    }
  }

  const fetchUserProgress = async (userId: string): Promise<UserProgress> => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          lessons(title, course_id),
          courses(title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      const totalLessons = data?.length || 0
      const completedLessons = data?.filter((p: { status: string }) => p.status === 'completed').length || 0
      const averageScore = data?.length > 0 
        ? Math.round(data.reduce((sum: number, p: { progress_percentage?: number }) => sum + (p.progress_percentage || 0), 0) / data.length)
        : 0

      return {
        totalLessons,
        completedLessons,
        averageScore,
        progressData: data || []
      }
    } catch (error) {
      console.error('Error fetching user progress:', error)
      return { totalLessons: 0, completedLessons: 0, averageScore: 0 }
    }
  }

  const fetchRecentConversations = async (userId: string): Promise<Conversation[]> => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select(`
          *,
          courses(title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error

      return data?.map((conv: { question: string; answer: string; course_id?: string; created_at: string; courses?: { title: string } }) => ({
        question: conv.question,
        answer: conv.answer,
        course: conv.courses?.title,
        time: new Date(conv.created_at).toLocaleDateString()
      })) || []
    } catch (error) {
      console.error('Error fetching conversations:', error)
      return []
    }
  }

  const fetchAchievements = async (userId: string): Promise<Achievement[]> => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })
        .limit(3)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching achievements:', error)
      return []
    }
  }

  const fetchLearningAnalytics = async (userId: string): Promise<LearningAnalytics> => {
    try {
      const { data, error } = await supabase
        .from('learning_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)

      if (error) throw error

      const totalSessions = data?.length || 0
      const totalTime = data?.reduce((sum: number, session: { total_time_minutes?: number }) => sum + (session.total_time_minutes || 0), 0) || 0
      const averageScore = data?.length > 0
        ? Math.round(data.reduce((sum: number, session: { average_score?: number }) => sum + (session.average_score || 0), 0) / data.length)
        : 0

      // Calculate learning streak
      let streak = 0
      if (data && data.length > 0) {
        const today = new Date()
        const sessionDates = data.map((s: { created_at: string }) => new Date(s.created_at).toDateString())
        const uniqueDates = [...new Set(sessionDates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        
        for (let i = 0; i < uniqueDates.length; i++) {
          const sessionDate = new Date(uniqueDates[i])
          const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysDiff === i) {
            streak++
          } else {
            break
          }
        }
      }

      return {
        totalSessions,
        totalTime,
        averageScore,
        streak,
        sessionData: data || []
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return { totalSessions: 0, totalTime: 0, averageScore: 0, streak: 0 }
    }
  }

  const loadDemoData = () => {
    setDashboardData({
      courses: [
        {
          id: 1,
          title: "React.js Fundamentals",
          description: "Master the basics of React including components, props, state, and hooks",
          duration: "6 hours",
          tags: ["react", "javascript", "frontend"],
          lessons: [
            { id: 1, title: "Introduction", completed: true },
            { id: 2, title: "Components", completed: true },
            { id: 3, title: "Props & State", completed: true },
            { id: 4, title: "Hooks", completed: false },
            { id: 5, title: "Project", completed: false }
          ],
          created_at: "2024-01-15",
          status: "active",
          progress: 60
        }
      ],
      userProgress: {
        totalLessons: 45,
        completedLessons: 24,
        averageScore: 87
      },
      learningAnalytics: {
        totalSessions: 15,
        totalTime: 180,
        averageScore: 87,
        streak: 7
      },
      recentConversations: [
        { question: "How does React state work?", time: "2 hours ago" },
        { question: "Debug my JavaScript function", time: "5 hours ago" }
      ],
      achievements: [
        { title: "Code Master", description: "Completed 10 coding challenges", badge_url: "🏆" },
        { title: "React Expert", description: "Mastered React fundamentals", badge_url: "🎓" }
      ]
    })
  }

  const generateCourse = async (tags: string[]) => {
    try {
      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags,
          userId: user?.id || 'demo-user'
        }),
      })

      if (!response.ok) throw new Error('Failed to generate course')

      const data = await response.json()
      
      // Refresh courses list
      if (user?.id) {
        const updatedCourses = await fetchUserCourses(user.id)
        setDashboardData(prev => ({ ...prev, courses: updatedCourses }))
      }
      
      return data.course
    } catch (error) {
      console.error('Course generation error:', error)
      throw error
    }
  }

  const sendAIMessage = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          lessonId: 'dashboard',
          courseId: dashboardData.courses[0]?.id || 'general'
        }),
      })

      if (!response.ok) throw new Error('Failed to get AI response')

      const data = await response.json()
      
      // Save to chat history if user is authenticated
      if (user?.id && user.id !== 'demo-user') {
        await dbHelpers.saveChatInteraction(
          user.id,
          String(dashboardData.courses[0]?.id || 'general'),
          'dashboard',
          message,
          data.answer
        )
        
        // Refresh conversations
        const updatedConversations = await fetchRecentConversations(user.id)
        setDashboardData(prev => ({ ...prev, recentConversations: updatedConversations }))
      }
      
      return data.answer || "I'm here to help! Ask me anything about your courses."
    } catch (error) {
      console.error('Chat error:', error)
      return "I'm having trouble connecting right now. Please try again!"
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    user,
    profile,
    loading,
    error,
    dashboardData,
    actions: {
      refreshDashboard: fetchDashboardData,
      generateCourse,
      sendAIMessage
    }
  }
}