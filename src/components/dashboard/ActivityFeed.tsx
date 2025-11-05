"use client";

import { useState, useEffect } from "react";
import { IconCheck, IconTrophy, IconBook, IconBrain, IconLoader2 } from "@tabler/icons-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

interface Activity {
  id: string;
  type: "completed" | "started" | "achievement" | "generated" | "assessment";
  message: string;
  time: string;
  course?: string;
  timestamp: Date;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "completed":
      return <IconCheck className="w-4 h-4 text-green-500" />;
    case "started":
      return <IconCheck className="w-4 h-4 text-blue-500" />;
    case "achievement":
      return <IconTrophy className="w-4 h-4 text-yellow-500" />;
    case "generated":
      return <IconBrain className="w-4 h-4 text-purple-500" />;
    case "assessment":
      return <IconTrophy className="w-4 h-4 text-orange-500" />;
    default:
      return <IconBook className="w-4 h-4 text-gray-500" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "completed":
      return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
    case "started":
      return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
    case "achievement":
      return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
    case "generated":
      return "border-l-purple-500 bg-purple-50 dark:bg-purple-950/20";
    case "assessment":
      return "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20";
    default:
      return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20";
  }
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
};

export default function ActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const allActivities: Activity[] = [];

        // Fetch completed lessons
        const { data: completedLessons } = await supabase
          .from('user_progress')
          .select(`
            lesson_id,
            completed_at,
            lessons!inner (
              title,
              courses!inner (
                title
              )
            )
          `)
          .eq('user_id', user.id)
          .eq('completed', true)
          .order('completed_at', { ascending: false })
          .limit(10);

        if (completedLessons) {
          completedLessons.forEach((progress: any) => {
            const lesson = progress.lessons;
            const course = lesson?.courses;
            allActivities.push({
              id: `lesson-${progress.lesson_id}`,
              type: "completed",
              message: `Completed Lesson: ${lesson?.title || 'Unknown'}`,
              time: formatTimeAgo(new Date(progress.completed_at)),
              course: course?.title,
              timestamp: new Date(progress.completed_at)
            });
          });
        }

        // Fetch course enrollments (started courses)
        const { data: enrollments } = await supabase
          .from('course_enrollments')
          .select(`
            enrollment_date,
            courses!inner (
              title
            )
          `)
          .eq('user_id', user.id)
          .order('enrollment_date', { ascending: false })
          .limit(5);

        if (enrollments) {
          enrollments.forEach((enrollment: any) => {
            allActivities.push({
              id: `enrollment-${enrollment.enrollment_date}`,
              type: "started",
              message: `Started course: ${enrollment.courses?.title || 'Unknown'}`,
              time: formatTimeAgo(new Date(enrollment.enrollment_date)),
              course: enrollment.courses?.title,
              timestamp: new Date(enrollment.enrollment_date)
            });
          });
        }

        // Fetch generated courses
        const { data: generatedCourses } = await supabase
          .from('courses')
          .select('id, title, created_at')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (generatedCourses) {
          generatedCourses.forEach((course: any) => {
            allActivities.push({
              id: `generated-${course.id}`,
              type: "generated",
              message: `Generated course: ${course.title}`,
              time: formatTimeAgo(new Date(course.created_at)),
              course: course.title,
              timestamp: new Date(course.created_at)
            });
          });
        }

        // Fetch completed assessments
        const { data: assessments } = await supabase
          .from('assessment_attempts')
          .select(`
            completed_at,
            score,
            assessments!inner (
              title,
              courses!inner (
                title
              )
            )
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('completed_at', { ascending: false })
          .limit(5);

        if (assessments) {
          assessments.forEach((attempt: any) => {
            const assessment = attempt.assessments;
            const course = assessment?.courses;
            allActivities.push({
              id: `assessment-${attempt.completed_at}`,
              type: "assessment",
              message: `Completed Assessment: ${assessment?.title || 'Unknown'} (${attempt.score}%)`,
              time: formatTimeAgo(new Date(attempt.completed_at)),
              course: course?.title,
              timestamp: new Date(attempt.completed_at)
            });
          });
        }

        // Fetch achievements
        const { data: achievements } = await supabase
          .from('achievements')
          .select('title, description, earned_at')
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false })
          .limit(5);

        if (achievements) {
          achievements.forEach((achievement: any) => {
            allActivities.push({
              id: `achievement-${achievement.earned_at}`,
              type: "achievement",
              message: `Earned achievement: ${achievement.title}`,
              time: formatTimeAgo(new Date(achievement.earned_at)),
              timestamp: new Date(achievement.earned_at)
            });
          });
        }

        // Sort all activities by timestamp (most recent first)
        allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Keep all activities for scrolling, but limit display to 3
        setActivities(allActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <IconLoader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.length > 0 ? (
        <div className="max-h-[280px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${getActivityColor(activity.type)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                {activity.course && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Course: {activity.course}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <IconBook className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent activity</p>
          <p className="text-sm">Start learning to see your progress here!</p>
        </div>
      )}
    </div>
  );
}
