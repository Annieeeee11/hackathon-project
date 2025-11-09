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
  IconArrowRight,
  IconLoader2
} from "@tabler/icons-react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
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
  duration?: string;
  lessons?: Lesson[];
  tags?: string[];
  created_at: string;
  progress_percentage?: number;
}

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
        interface CourseData {
          id: string;
          title: string;
          description: string;
          duration: string;
          tags: string[];
          created_at: string;
        }

        interface EnrollmentData {
          course_id: string;
          progress_percentage: number;
          courses: CourseData | CourseData[] | null;
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
            // Handle courses as array or single object
            const course = Array.isArray(enrollment.courses) 
              ? enrollment.courses[0] 
              : enrollment.courses;
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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <IconLoader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
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
        {/* Header */}
        <header className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <IconBrain className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">AI Learning Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/chat">
              <Button variant="outline">
                <IconMessageCircle className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
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

            {/* Action Buttons */}
            <div className="flex justify-center mb-8">
              <Link href="/generate-course">
                <Button size="lg">
                  <IconBrain className="w-4 h-4 mr-2" />
                  Generate New Course
                  <IconArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Search and Filter */}
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
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
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
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconBook className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">No courses found</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {searchTerm || filterDifficulty !== "all" 
                    ? "Try adjusting your search or filter criteria to find what you're looking for."
                    : "Start your learning journey by generating your first personalized course with AI."
                  }
                </p>
                <Link href="/generate-course">
                  <Button size="lg">
                    <IconBrain className="w-4 h-4 mr-2" />
                    Generate Your First Course
                    <IconArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
