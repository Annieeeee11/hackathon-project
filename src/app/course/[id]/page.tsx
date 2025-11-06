'use client'
import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Avatar3D from "@/components/lessons/Avatar3D";
import ChatBox from "@/components/lessons/ChatBox";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { IconCheck, IconCircle } from "@tabler/icons-react";
import { Card } from "@/components/common/Card";
import { ProgressBar } from "@/components/common/ProgressBar";
import { TagList, Tag } from "@/components/common/Tag";
import { InfoItem, InfoList } from "@/components/common/InfoItem";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

interface Lesson {
  id: string;
  title: string;
  content: string;
  lesson_type: string;
  order_number: number;
  duration_minutes: number;
  duration?: string;
  objectives: string[];
  is_published: boolean;
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  description: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  tags: string[];
  lessons: Lesson[];
  assessments: Assessment[];
  total_lessons: number;
  estimated_hours: number;
  difficulty_level: string;
  created_at: string;
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState("");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch course with lessons
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select(`
            *,
            lessons:lessons!lessons_course_id_fkey (
              id,
              title,
              content,
              duration,
              order_index,
              is_published
            )
          `)
          .eq('id', id)
          .single();

        if (courseError) {
          console.error('Error fetching course:', courseError);
          return;
        }

        // Sort lessons by order_index
        const sortedLessons = (courseData.lessons || [])
          .filter((l: any) => l.is_published)
          .sort((a: any, b: any) => a.order_index - b.order_index);

        setCourse({
          ...courseData,
          lessons: sortedLessons
        });
        
        if (sortedLessons.length > 0) {
          setCurrentLesson(sortedLessons[0]);
        }

        // Fetch user progress for this course
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('lesson_id, completed')
            .eq('user_id', user.id)
            .eq('course_id', id)
            .eq('completed', true);

          if (progressData) {
            const completedSet = new Set(progressData.map((p: any) => p.lesson_id));
            setCompletedLessons(completedSet);

            // Calculate progress percentage
            const totalLessons = sortedLessons.length;
            const completedCount = completedSet.size;
            const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            setProgressPercentage(progress);

            // Update enrollment progress
            await supabase
              .from('course_enrollments')
              .update({ progress_percentage: progress })
              .eq('user_id', user.id)
              .eq('course_id', id);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  const startLesson = () => {
    if (currentLesson) {
      const lessonIntro = `Welcome to ${currentLesson.title}. ${currentLesson.content.substring(0, 200)}...`;
      setCurrentSpeakingText(lessonIntro);
      setIsAvatarSpeaking(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading course..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <InfoList className="mt-3">
                <span>📚 {course.total_lessons} lessons</span>
                <span>⏱️ {course.estimated_hours} hours</span>
                <span>🎯 {course.difficulty_level}</span>
              </InfoList>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={startLesson}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Lesson
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="white">
              <h2 className="text-xl font-semibold mb-4">AI Professor</h2>
              <Avatar3D
                isSpeaking={isAvatarSpeaking}
                currentMessage={currentSpeakingText}
              />
            </Card>

            {currentLesson && (
              <Card variant="white">
                <h2 className="text-xl font-semibold mb-4">{currentLesson.title}</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{currentLesson.content}</p>
                </div>
                {currentLesson.objectives && currentLesson.objectives.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Learning Objectives</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {currentLesson.objectives.map((objective, index) => (
                        <li key={index} className="text-gray-700">{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            )}

            <Card variant="white">
              <h2 className="text-xl font-semibold mb-4">Ask Your AI Professor</h2>
              <ChatBox
                lessonId={currentLesson?.id || ''}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card variant="white">
              <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <ProgressBar
                  current={completedLessons.size}
                  total={course.lessons?.length || 0}
                  showPercentage={false}
                />
                <p className="text-sm text-gray-600">
                  {completedLessons.size} of {course.lessons?.length || 0} lessons completed
                </p>
              </div>
            </Card>

            <Card variant="white">
              <h3 className="text-lg font-semibold mb-4">Lessons</h3>
              <div className="space-y-2">
                {course.lessons?.map((lesson) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isCurrent = currentLesson?.id === lesson.id;
                  
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className={`block w-full text-left p-3 rounded-lg border transition-colors ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50'
                          : isCompleted
                          ? 'border-green-500 bg-green-50 hover:border-green-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{lesson.title}</p>
                            {isCompleted && (
                              <IconCheck className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{lesson.duration || '30 min'}</p>
                        </div>
                        <div className="ml-2">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <IconCheck className="w-4 h-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>

            <Card variant="white">
              <h3 className="text-lg font-semibold mb-4">Topics</h3>
              <TagList>
                {course.tags?.map((tag, index) => (
                  <Tag
                    key={index}
                    variant="primary"
                    className="bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </Tag>
                ))}
              </TagList>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
  