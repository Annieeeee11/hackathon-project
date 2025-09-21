"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import { 
  IconPlus,
  IconX,
  IconLoader2,
  IconDashboard,
  IconBrain,
  IconMessageCircle,
  IconArrowRight,
  IconRocket,
  IconBook
} from "@tabler/icons-react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface Course {
  id: string;
  title: string;
  description: string;
  tags: string[];
  lessons: Lesson[];
  estimatedDuration: string;
  difficulty: string;
}


const popularTags = [
  "react.js", "javascript", "python", "machine-learning", "data-structures",
  "web-development", "cloud-computing", "blockchain", "ai", "devops"
];

export default function GenerateCoursePage() {
  const [tags, setTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setAuthLoading(false);
      
      if (!user) {
        router.push('/auth');
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          router.push('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <IconLoader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const addTag = (tag: string) => {
    if (!tags.includes(tag) && tag.trim()) {
      setTags([...tags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const generateCourse = async () => {
    if (tags.length === 0) {
      setError("Please add at least one skill tag");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCourse(null);

      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate course");
      }

      const data = await response.json();
      setCourse(data.course);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <IconRocket className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Generate Your
              <span className="text-primary"> AI Course</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create personalized courses with our AI Professor. Add skill tags and get structured lessons tailored just for you!
            </p>
          </div>

          {/* Course Generator Section */}
          <div className="bg-card rounded-lg border p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <IconBrain className="w-6 h-6 text-primary" />
              Course Generator
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Add skill tags to generate a personalized course. Our AI Professor will create structured lessons just for you!
            </p>

            {/* Popular Tags */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Popular Skills</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => addTag(tag)}
                    disabled={tags.includes(tag)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      tags.includes(tag)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Add Custom Skill</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="e.g., blockchain, machine-learning"
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTag(customTag);
                      setCustomTag("");
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    addTag(customTag);
                    setCustomTag("");
                  }}
                  size="sm"
                >
                  <IconPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Selected Skills ({tags.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                      >
                        <IconX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={generateCourse}
              disabled={tags.length === 0 || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Course...
                </>
              ) : (
                <>
                  <IconBrain className="w-4 h-4 mr-2" />
                  Generate Course with AI Professor
                  <IconArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Generated Course Display */}
          {course && (
            <div className="bg-card rounded-lg border p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-3">{course.title}</h2>
                  <p className="text-muted-foreground mb-4 text-lg">{course.description}</p>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <IconBook className="w-4 h-4" />
                      <span>{course.lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconLoader2 className="w-4 h-4" />
                      <span>{course.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconBrain className="w-4 h-4" />
                      <span>{course.difficulty}</span>
                    </div>
                  </div>
                </div>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <IconDashboard className="w-4 h-4 mr-2" />
                    Start Learning
                    <IconArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Course Outline</h3>
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{lesson.title}</h4>
                        <p className="text-muted-foreground">{lesson.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{lesson.duration}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lesson.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        lesson.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
    </AppLayout>
  );
}