"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import CourseCard from "@/components/dashboard/CourseCard";
import { 
  IconPlus,
  IconSearch,
  IconFilter,
  IconBrain,
  IconBook,
  IconMessageCircle,
  IconArrowRight,
  IconRocket,
  IconLoader
} from "@tabler/icons-react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  tags: string[];
  lessons: Array<{ id: string; title: string; completed: boolean }>;
  progress: number;
  status: string;
  enrollment_date: string;
  created_at: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = filterDifficulty === "all" || course.difficulty === filterDifficulty;
    const matchesStatus = filterStatus === "all" || course.status === filterStatus;
    
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  if (isLoading) {
    return (
      <AppLayout 
        title="My Courses" 
        subtitle="Continue your learning journey"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <IconLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout 
        title="My Courses" 
        subtitle="Continue your learning journey"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="My Courses" 
      subtitle="Continue your learning journey"
    >
      {courses.length > 0 && (
          <div className="bg-white dark:bg-white rounded-lg border border-gray-200 mb-20 dark:border-gray-300 p-6">
            <h3 className="text-lg font-semibold text-black dark:text-black mb-4">Learning Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-black">{courses.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-600">Total Courses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-black">
                  {courses.filter(c => c.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-black">
                  {courses.filter(c => c.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-600">In Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-black dark:text-black">
                  {Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length) || 0}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-600">Avg Progress</p>
              </div>
            </div>
          </div>
        )}

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/generate-course">
                <IconPlus className="w-4 h-4 mr-2" />
                Generate New Course
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/chat">
                <IconMessageCircle className="w-4 h-4 mr-2" />
                Ask AI Professor
              </Link>
            </Button>
          </div>
          <ModeToggle />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-white text-black dark:text-black placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-white text-black dark:text-black focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-300 rounded-lg bg-white dark:bg-white text-black dark:text-black focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={{
                  id: course.id,
                  title: course.title,
                  description: course.description,
                  duration: course.duration,
                  tags: course.tags,
                  lessons: course.lessons,
                  created_at: course.created_at
                }}
                progress={course.progress}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <IconBook className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-black mb-2">
              {searchTerm || filterDifficulty !== "all" || filterStatus !== "all" 
                ? "No courses found" 
                : "No courses enrolled yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterDifficulty !== "all" || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria to find courses."
                : "Start your learning journey by generating a new course or browsing available courses."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/generate-course">
                  <IconRocket className="w-4 h-4 mr-2" />
                  Generate Course
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/chat">
                  <IconMessageCircle className="w-4 h-4 mr-2" />
                  Ask AI Professor
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Stats Summary */}
      </div>
    </AppLayout>
  );
}