'use client'
import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Avatar3D from "@/components/lessons/Avatar3D";
import ChatBox from "@/components/lessons/ChatBox";

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  code?: string;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  lesson_type: string;
  order_number: number;
  duration_minutes: number;
  objectives: string[];
  is_published: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  tags: string[];
  lessons: Lesson[];
  assessments: any[];
  total_lessons: number;
  estimated_hours: number;
  difficulty_level: string;
  created_at: string;
}

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  const [currentSpeakingText, setCurrentSpeakingText] = useState("");

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select(`
            *,
            lessons (*)
          `)
          .eq('id', id)
          .single();

        if (courseError) {
          console.error('Error fetching course:', courseError);
          return;
        }

        setCourse(courseData);
        
        // Set first lesson as current if available
        if (courseData.lessons && courseData.lessons.length > 0) {
          setCurrentLesson(courseData.lessons[0]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Handle chat messages
  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          lessonId: currentLesson?.id,
          courseId: id,
          userId: 'demo-user' // You can implement proper user authentication
        }),
      });

      const data = await response.json();

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: data.answer,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Make avatar speak the response
        setCurrentSpeakingText(data.answer);
        setIsAvatarSpeaking(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle avatar speaking completion
  const handleSpeakingComplete = () => {
    setIsAvatarSpeaking(false);
    setCurrentSpeakingText("");
  };

  // Start lesson with avatar
  const startLesson = () => {
    if (currentLesson) {
      const lessonIntro = `Welcome to ${currentLesson.title}. ${currentLesson.content.substring(0, 200)}...`;
      setCurrentSpeakingText(lessonIntro);
      setIsAvatarSpeaking(true);
    }
  };

  // Quick question suggestions
  const quickQuestions = [
    "Can you explain this concept in simpler terms?",
    "Can you give me a practical example?",
    "What are the key takeaways from this lesson?",
    "How can I apply this in real projects?"
  ];

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
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
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <span>📚 {course.total_lessons} lessons</span>
                <span>⏱️ {course.estimated_hours} hours</span>
                <span>🎯 {course.difficulty_level}</span>
              </div>
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
            {/* 3D Avatar */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">AI Professor</h2>
              <Avatar3D
                isTeaching={isAvatarSpeaking}
                isSpeaking={isAvatarSpeaking}
                currentText={currentSpeakingText}
                onSpeakingComplete={handleSpeakingComplete}
              />
            </div>

            {/* Current Lesson */}
            {currentLesson && (
              <div className="bg-white rounded-lg shadow-sm p-6">
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
              </div>
            )}

            {/* Chat Interface */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Ask Your AI Professor</h2>
              
              {/* Quick Question Suggestions */}
              {messages.length === 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-left p-3 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <ChatBox
                onSendMessage={handleSendMessage}
                isLoading={isChatLoading}
                messages={messages}
                placeholder="Ask me anything about this lesson..."
                lessonId={currentLesson?.id}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Course Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-sm text-gray-600">Complete lessons to track your progress</p>
              </div>
            </div>

            {/* Lessons List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Lessons</h3>
              <div className="space-y-2">
                {course.lessons?.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentLesson?.id === lesson.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{lesson.title}</p>
                        <p className="text-xs text-gray-500">{lesson.duration_minutes} min</p>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Course Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  