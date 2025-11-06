// ==========================================
// USER & AUTH TYPES
// ==========================================

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
}

// ==========================================
// COURSE & LESSON TYPES
// ==========================================

export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  order_index?: number;
  content?: string;
  course_id?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration?: string;
  lessons?: Lesson[];
  tags?: string[];
  created_at: string;
  progress_percentage?: number;
  estimated_hours?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  status: 'active' | 'completed' | 'paused';
  last_accessed: string;
  enrolled_at: string;
}

// ==========================================
// PROGRESS & STATS TYPES
// ==========================================

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  lesson_id: string;
  completed: boolean;
  score?: number;
  completed_at?: string;
}

export interface Stats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  currentStreak: number;
  averageScore: number;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

// ==========================================
// ASSESSMENT TYPES
// ==========================================

export interface Assessment {
  id: string;
  course_id: string;
  lesson_id: string;
  title: string;
  type: 'quiz' | 'coding' | 'project';
  questions: Question[];
  passing_score: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple_choice' | 'code' | 'text';
  options?: string[];
  correct_answer?: string | number;
  points: number;
}

// ==========================================
// ACTIVITY & FEED TYPES
// ==========================================

export interface Activity {
  id: string;
  user_id: string;
  type: 'course_completed' | 'lesson_completed' | 'assessment_passed' | 'streak_milestone';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// ==========================================
// UI COMPONENT PROPS TYPES
// ==========================================

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor?: string;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  className?: string;
}

// ==========================================
// LANDING PAGE TYPES
// ==========================================

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface StatItem {
  number: string;
  label: string;
}

