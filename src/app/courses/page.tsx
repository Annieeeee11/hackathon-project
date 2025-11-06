"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import CourseCard from "@/components/dashboard/CourseCard";
import { 
  IconSearch,
  IconFilter,
  IconBrain,
  IconBook,
  IconMessageCircle,
  IconArrowRight
} from "@tabler/icons-react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Course, Lesson } from "@/lib/types";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { DIFFICULTY_LEVELS, ROUTES, APP_CONFIG } from "@/lib/constants";

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
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
            courses (
              id,
              title,
              description,
              duration,
              tags,
              created_at
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
        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment: any) => {
            const course = enrollment.courses;
            if (!course) return null;

            // Fetch lessons for this course
            const { data: lessons, error: lessonsError } = await supabase
              .from('lessons')
              .select('id, title, order_index')
              .eq('course_id', course.id)
              .eq('is_published', true)
              .order('order_index', { ascending: true });

            // Fetch user progress for lessons
            const { data: progress, error: progressError } = await supabase
              .from('user_progress')
              .select('lesson_id, completed')
              .eq('user_id', user.id)
              .eq('course_id', course.id)
              .eq('completed', true);

            const completedLessonIds = new Set(
              (progress || []).map((p: any) => p.lesson_id)
            );

            const lessonsWithProgress: Lesson[] = (lessons || []).map((lesson: any) => ({
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
              progress_percentage: enrollment.progress_percentage || 0
            };
          })
        );

        const validCourses = coursesWithProgress.filter(
          (course): course is Course => course !== null
        );

        setCourses(validCourses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchCourses();
    }
  }, [user, authLoading]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = filterDifficulty === "all" || 
      course.tags.some(tag => tag.toLowerCase().includes(filterDifficulty.toLowerCase()));
    
    return matchesSearch && matchesDifficulty;
  });

  if (authLoading || loading) {
    return (
      <AppLayout>
        <LoadingSpinner text="Loading courses..." />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
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
    <AppLayout>
      <div className="min-h-screen bg-background">
        <header className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <IconBrain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">{APP_CONFIG.name}</h1>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href={ROUTES.chat}>
              <Button variant="outline">
                <IconMessageCircle className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </Link>
          </div>
        </header>

        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <IconBook className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                My
                <span className="text-primary"> Courses</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Manage and track your learning progress across all your personalized AI-generated courses.
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <Link href={ROUTES.generateCourse}>
                <Button size="lg">
                  <IconBrain className="w-4 h-4 mr-2" />
                  Generate New Course
                  <IconArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="flex gap-4 items-center mb-8 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <IconFilter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DIFFICULTY_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <EmptyState
                icon={
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <IconBook className="w-10 h-10 text-primary" />
                  </div>
                }
                title="No courses found"
                description={
                  searchTerm || filterDifficulty !== "all" 
                    ? "Try adjusting your search or filter criteria to find what you're looking for."
                    : "Start your learning journey by generating your first personalized course with AI."
                }
                actionLabel="Generate Your First Course"
                actionHref={ROUTES.generateCourse}
              />
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
