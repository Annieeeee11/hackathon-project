"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/dashboard/CourseCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import {
  IconTrendingUp,
  IconClock,
  IconTarget,
  IconAward,
  IconBook,
  IconBrain,
  IconLoader,
} from "@tabler/icons-react";
import QuickActions from "@/components/dashboard/quickActions";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  tags: string[];
  progress: number;
  status: string;
  last_accessed: string;
  created_at: string;
}

interface DashboardData {
  user: {
    id: string;
    email: string;
    full_name: string;
  };
  stats: {
    totalCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
    totalAssessments: number;
    completedAssessments: number;
    currentStreak: number;
    longestStreak: number;
  };
  recentCourses: Course[];
  recentAssessments: any[];
  achievements: any[];
  analytics: any[];
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard-simple');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <AppLayout 
        title="Dashboard" 
        subtitle="Track your learning progress and achievements"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <IconLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout 
        title="Dashboard" 
        subtitle="Track your learning progress and achievements"
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

  if (!dashboardData) {
    return (
      <AppLayout 
        title="Dashboard" 
        subtitle="Track your learning progress and achievements"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </AppLayout>
    );
  }

  const { stats, recentCourses, recentAssessments, achievements } = dashboardData;

  return (
    <AppLayout 
      title="Dashboard" 
      subtitle="Track your learning progress and achievements"
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-black dark:text-black">{stats.totalCourses}</p>
              </div>
              <IconBook className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-black dark:text-black">
                  {stats.completedCourses}
                </p>
              </div>
              <IconAward className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-600">Lessons Completed</p>
                <p className="text-2xl font-bold text-black dark:text-black">
                  {stats.completedLessons}/{stats.totalLessons}
                </p>
              </div>
              <IconClock className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-black dark:text-black">{stats.currentStreak} days</p>
              </div>
              <IconTarget className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-6">
          <h2 className="text-lg font-semibold text-black dark:text-black mb-4">Quick Actions</h2>
          <QuickActions />
        </div>

        {/* Recent Courses */}
        <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black dark:text-black">Recent Courses</h2>
            <Button variant="outline" size="sm" asChild>
              <a href="/courses">View All</a>
            </Button>
          </div>
          
          {recentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    duration: course.duration,
                    tags: course.tags,
                    lessons: [], // Will be populated by the component
                    created_at: course.created_at
                  }}
                  progress={course.progress}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <IconBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-600 mb-4">No courses enrolled yet</p>
              <Button asChild>
                <a href="/courses">Browse Courses</a>
              </Button>
            </div>
          )}
        </div>

        {/* Recent Assessments */}
        {recentAssessments.length > 0 && (
          <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-black dark:text-black">Recent Assessments</h2>
              <Button variant="outline" size="sm" asChild>
                <a href="/assessments">View All</a>
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentAssessments.slice(0, 3).map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-300 rounded-lg">
                  <div>
                    <h3 className="font-medium text-black dark:text-black">{assessment.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-600">
                      {assessment.difficulty} • {assessment.timeLimit} min
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assessment.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : assessment.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {assessment.status.replace('-', ' ').toUpperCase()}
                    </span>
                    {assessment.score && (
                      <p className="text-sm text-gray-600 dark:text-gray-600 mt-1">
                        Score: {assessment.score}%
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-black dark:text-black mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-center p-3 border border-gray-200 dark:border-gray-300 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                    <IconAward className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-black dark:text-black">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Feed */}
        <div className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-6">
          <h2 className="text-lg font-semibold text-black dark:text-black mb-4">Recent Activity</h2>
          <ActivityFeed />
        </div>
      </div>
    </AppLayout>
  );
}