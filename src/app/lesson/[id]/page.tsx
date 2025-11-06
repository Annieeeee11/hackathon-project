"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import Avatar3D from "@/components/lessons/Avatar3D";
import ChatBox from "@/components/lessons/ChatBox";
import AppLayout from "@/components/layout/AppLayout";
import { 
  IconVolume,
  IconVolumeOff,
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCode,
  IconBulb,
  IconMessageCircle,
  IconBook,
  IconLoader2
} from "@tabler/icons-react";
import { ModeToggle } from "@/components/modeToggle";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { PageHeader } from "@/components/common/PageHeader";

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  codeExample?: string;
  explanation: string;
  keyPoints: string[];
  course_id?: string;
}

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'explaining'>('neutral');
  const [currentAvatarMessage, setCurrentAvatarMessage] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch lesson from database
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', id)
          .eq('is_published', true)
          .single();

        if (lessonError) {
          throw lessonError;
        }

        if (!lessonData) {
          throw new Error('Lesson not found');
        }

        // Transform database lesson to component format
        const fetchedLesson: Lesson = {
          id: lessonData.id,
          title: lessonData.title,
          content: lessonData.content || lessonData.explanation || '',
          duration: lessonData.duration || '30 min',
          difficulty: (lessonData.difficulty as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
          codeExample: lessonData.code_example || undefined,
          explanation: lessonData.explanation || lessonData.content || '',
          keyPoints: lessonData.key_points || [],
          course_id: lessonData.course_id
        };

        setLesson(fetchedLesson);

        // Check if user has completed this lesson
        if (user) {
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('completed')
            .eq('user_id', user.id)
            .eq('lesson_id', id)
            .single();

          if (progressData?.completed) {
            setIsCompleted(true);
            setCurrentStep(3);
          }
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id, user]);

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    if (newPlayingState) {
      // Start teaching
      setAvatarEmotion('explaining');
      setCurrentAvatarMessage(lesson?.explanation || "Let me explain this concept...");
      
      // Simulate lesson progression
      setTimeout(() => {
        setAvatarEmotion('happy');
        setCurrentAvatarMessage("Great! You're doing well!");
      }, 5000);
      
      setTimeout(() => {
        setAvatarEmotion('neutral');
        setCurrentAvatarMessage("");
        setIsPlaying(false);
      }, 8000);
    } else {
      // Stop teaching
      setAvatarEmotion('neutral');
      setCurrentAvatarMessage("");
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleNextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark lesson as completed
      if (user && lesson) {
        try {
          const { error: progressError } = await supabase
            .from('user_progress')
            .upsert({
              user_id: user.id,
              lesson_id: lesson.id,
              course_id: lesson.course_id,
              completed: true,
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (progressError) {
            console.error('Error saving progress:', progressError);
            alert('Failed to save progress. Please try again.');
          } else {
            setIsCompleted(true);
            console.log('Lesson marked as completed');
            
            // Update course enrollment progress
            if (lesson.course_id) {
              // Get all lessons for this course
              const { data: allLessons } = await supabase
                .from('lessons')
                .select('id')
                .eq('course_id', lesson.course_id)
                .eq('is_published', true);

              // Get completed lessons
              const { data: completedLessons } = await supabase
                .from('user_progress')
                .select('lesson_id')
                .eq('user_id', user.id)
                .eq('course_id', lesson.course_id)
                .eq('completed', true);

              if (allLessons && completedLessons) {
                const totalLessons = allLessons.length;
                const completedCount = completedLessons.length;
                const progressPercentage = totalLessons > 0 
                  ? Math.round((completedCount / totalLessons) * 100) 
                  : 0;

                // Update enrollment progress
                await supabase
                  .from('course_enrollments')
                  .update({ 
                    progress_percentage: progressPercentage,
                    last_accessed: new Date().toISOString()
                  })
                  .eq('user_id', user.id)
                  .eq('course_id', lesson.course_id);
              }
            }
          }
        } catch (err) {
          console.error('Error completing lesson:', err);
          alert('Failed to save progress. Please try again.');
        }
      } else {
        setIsCompleted(true);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex h-screen bg-background">
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner text="Loading lesson..." />
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !lesson) {
    return (
      <AppLayout>
        <div className="flex h-screen bg-background">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || 'Lesson not found'}</p>
              <Button onClick={() => window.history.back()}>
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex h-screen bg-background">
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => lesson.course_id ? window.location.href = `/course/${lesson.course_id}` : window.history.back()}
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{lesson.title}</h1>
                <p className="text-muted-foreground">
                  {lesson.difficulty} • {lesson.duration}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChat(!showChat)}
              >
                <IconMessageCircle className="w-4 h-4 mr-2" />
                Ask AI Professor
              </Button>
              <ModeToggle />
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              {/* 3D Avatar Section */}
              <div className="h-80 bg-gradient-to-br from-primary/10 to-secondary/10 border-b">
                <div className="h-full">
                  <Avatar3D 
                    isSpeaking={isPlaying}
                    currentMessage={currentAvatarMessage}
                    emotion={avatarEmotion}
                    showControls={true}
                    className="h-full"
                    enableVoice={true}
                    onSpeakingChange={(speaking) => {
                      // Sync lesson state with actual speech
                      if (!speaking && isPlaying) {
                        // Speech finished, update lesson state
                        setTimeout(() => {
                          setAvatarEmotion('neutral');
                          setCurrentAvatarMessage("");
                        }, 1000);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Lesson Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {[0, 1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step <= currentStep
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step < currentStep ? <IconCheck className="w-4 h-4" /> : step + 1}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMuteToggle}
                      >
                        {isMuted ? <IconVolumeOff className="w-4 h-4" /> : <IconVolume className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={handlePlayPause}
                        size="sm"
                      >
                        {isPlaying ? "Pause" : "Play"} Lesson
                      </Button>
                    </div>
                  </div>

                  {/* Lesson Steps */}
                  <div className="space-y-6">
                    {currentStep === 0 && (
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <IconBook className="w-5 h-5 text-primary" />
                          Introduction
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {lesson.content}
                        </p>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <IconBulb className="w-5 h-5 text-primary" />
                          Key Concepts
                        </h2>
                        {lesson.keyPoints && lesson.keyPoints.length > 0 ? (
                          <div className="space-y-3">
                            {lesson.keyPoints.map((point, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                                  {index + 1}
                                </div>
                                <p className="text-muted-foreground">{point}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            {lesson.explanation || "Review the introduction to understand the key concepts of this lesson."}
                          </p>
                        )}
                      </div>
                    )}

                    {currentStep === 2 && lesson.codeExample && (
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <IconCode className="w-5 h-5 text-primary" />
                          Code Example
                        </h2>
                        <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                          <pre className="text-sm text-foreground">
                            <code>{lesson.codeExample}</code>
                          </pre>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Explanation:</strong> {lesson.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="bg-card rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <IconCheck className="w-5 h-5 text-primary" />
                          Summary
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          You&apos;ve completed this lesson! Here&apos;s what you&apos;ve learned:
                        </p>
                        <ul className="space-y-2">
                          {lesson.keyPoints && lesson.keyPoints.length > 0 ? (
                            lesson.keyPoints.map((point, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <IconCheck className="w-4 h-4 text-green-500" />
                                <span className="text-muted-foreground">{point}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center gap-2">
                              <IconCheck className="w-4 h-4 text-green-500" />
                              <span className="text-muted-foreground">Completed lesson: {lesson.title}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={currentStep === 0}
                    >
                      <IconArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button
                      onClick={handleNextStep}
                      disabled={currentStep === 3 && isCompleted}
                    >
                      {currentStep === 3 ? "Complete Lesson" : "Next Step"}
                      <IconArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {showChat && (
              <div className="w-80 border-l bg-card">
                <ChatBox lessonId={lesson.id} />
              </div>
            )}
          </div>
        </main>
      </div>
    </AppLayout>
  );
}