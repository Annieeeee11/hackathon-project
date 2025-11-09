"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/dashboard/CourseCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import {
  IconTrendingUp,
  IconClock,
  IconAward,
  IconBook,
  IconBrain,
  IconLoader2,
} from "@tabler/icons-react";
import QuickActions from "@/components/dashboard/quickActions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  tags: string[];
  created_at: string;
}

interface Stats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  currentStreak: number;
  averageScore: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    completedCourses: 0,
    totalHours: 0,
    currentStreak: 0,
    averageScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch enrolled courses with course details
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('course_enrollments')
          .select(`
            course_id,
            progress_percentage,
            status,
            courses (
              id,
              title,
              description,
              duration,
              tags,
              created_at,
              estimated_hours
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('last_accessed', { ascending: false });

        if (enrollmentError) {
          throw enrollmentError;
        }

        if (!enrollments || enrollments.length === 0) {
          setCourses([]);
          setLoading(false);
          return;
        }

        // Fetch lessons and progress for each course
        interface EnrollmentData {
          course_id: string;
          progress_percentage: number;
          courses: {
            id: string;
            title: string;
            description: string;
            duration: string;
            tags: string[];
            created_at: string;
            estimated_hours: number;
          } | null;
        }

        interface LessonData {
          id: string;
          title: string;
          order_index: number;
        }

        interface ProgressData {
          lesson_id: string;
          completed: boolean;
        }

        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment: EnrollmentData) => {
            const course = enrollment.courses;
            if (!course) return null;

            // Fetch lessons for this course
            const { data: lessons } = await supabase
              .from('lessons')
              .select('id, title, order_index')
              .eq('course_id', course.id)
              .eq('is_published', true)
              .order('order_index', { ascending: true });

            // Fetch user progress for lessons
            const { data: progress } = await supabase
              .from('user_progress')
              .select('lesson_id, completed')
              .eq('user_id', user.id)
              .eq('course_id', course.id)
              .eq('completed', true);

            const completedLessonIds = new Set(
              (progress || []).map((p: ProgressData) => p.lesson_id)
            );

            const lessonsWithProgress: Lesson[] = (lessons || []).map((lesson: LessonData) => ({
              id: lesson.id,
              title: lesson.title,
              completed: completedLessonIds.has(lesson.id)
            }));

            return {
              id: course.id,
              title: course.title,
              description: course.description || '',
              duration: course.duration || '4 weeks',
              tags: course.tags || [],
              lessons: lessonsWithProgress,
              created_at: course.created_at,
              progress_percentage: enrollment.progress_percentage || 0,
              estimated_hours: course.estimated_hours || 0
            };
          })
        );

        const validCourses = coursesWithProgress.filter(
          (course): course is Course => course !== null
        );

        setCourses(validCourses);

        // Calculate stats
        const totalCourses = validCourses.length;
        const completedCourses = validCourses.filter(
          (course) => course.lessons.length > 0 && 
          course.lessons.every((lesson) => lesson.completed)
        ).length;
        
        interface CourseWithHours extends Course {
          estimated_hours?: number;
        }

        const totalHours = validCourses.reduce(
          (sum, course) => sum + ((course as CourseWithHours).estimated_hours || 0),
          0
        );

        // Fetch streak data
        const { data: streakData } = await supabase
          .from('user_streaks')
          .select('current_streak')
          .eq('user_id', user.id)
          .single();

        const currentStreak = streakData?.current_streak || 0;

        // Calculate average score (placeholder for now)
        const averageScore = 0;

        setStats({
          totalCourses,
          completedCourses,
          totalHours,
          currentStreak,
          averageScore,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <AppLayout title="Dashboard" subtitle="Track your learning progress and achievements">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <IconLoader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Dashboard" subtitle="Track your learning progress and achievements">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="Dashboard" 
      subtitle="Track your learning progress and achievements"
    >
      <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{stats.totalCourses}</p>
                </div>
                <IconBook className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {stats.completedCourses}
                  </p>
                </div>
                <IconAward className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Study Hours</p>
                  <p className="text-2xl font-bold">{stats.totalHours}h</p>
                </div>
                <IconClock className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.currentStreak} days
                  </p>
                </div>
                <IconTrendingUp className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>


          {/* My Courses */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <Link href="/generate-course">
                <Button>
                  <IconBrain className="w-4 h-4 mr-2" />
                  Generate New Course
                </Button>
              </Link>
            </div>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <IconBook className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your learning journey by generating your first AI-powered course
                </p>
                <Link href="/generate-course">
                  <Button>
                    <IconBrain className="w-4 h-4 mr-2" />
                    Generate Your First Course
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <ActivityFeed />
            </div>

            <QuickActions/>
          </div>
      </div>
    </AppLayout>
  );
}
