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
  IconBook
} from "@tabler/icons-react";
import { ModeToggle } from "@/components/modeToggle";

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  codeExample?: string;
  explanation: string;
  keyPoints: string[];
}

interface LessonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { id } = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'explaining'>('neutral');
  const [currentAvatarMessage, setCurrentAvatarMessage] = useState("");

  // Fetch lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/lessons/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lesson');
        }
        const data = await response.json();
        setLesson(data.lesson);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        // Set a fallback lesson if fetch fails
        setLesson({
          id: id,
          title: "Lesson Not Found",
          content: "This lesson could not be loaded. Please try again later.",
          duration: "0 min",
          difficulty: "Beginner",
          explanation: "The lesson content is currently unavailable.",
          keyPoints: []
        });
      }
    };

    fetchLesson();
  }, [id]);

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
      setIsCompleted(true);
      // Mark lesson as completed
      await updateLessonProgress(true);
    }
  };

  const updateLessonProgress = async (completed: boolean) => {
    try {
      await fetch(`/api/lessons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed,
          time_spent: Date.now() - (lesson?.created_at ? new Date(lesson.created_at).getTime() : Date.now()),
          last_position: currentStep,
          course_id: lesson?.course_id
        }),
      });
    } catch (err) {
      console.error('Error updating lesson progress:', err);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!lesson) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex h-screen bg-background">
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-6 border-b">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
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
                          You've completed this lesson! Here's what you've learned:
                        </p>
                        <ul className="space-y-2">
                          {lesson.keyPoints.map((point, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <IconCheck className="w-4 h-4 text-green-500" />
                              <span className="text-muted-foreground">{point}</span>
                            </li>
                          ))}
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

            {/* Chat Panel */}
            {showChat && (
              <div className="w-80 border-l bg-card">
                <ChatBox 
                  lessonId={lesson.id} 
                  courseId={lesson.course_id}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </AppLayout>
  );
}