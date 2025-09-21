"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/UserMenu";
import { 
  IconBook, 
  IconBrain, 
  IconDashboard, 
  IconMessageCircle, 
  IconPlus,
  IconX,
  IconLoader2
} from "@tabler/icons-react";

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

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <IconDashboard className="w-5 h-5" /> },
  { label: "Generate Course", href: "/gen-course", icon: <IconBrain className="w-5 h-5" /> },
  { label: "My Courses", href: "/courses", icon: <IconBook className="w-5 h-5" /> },
  { label: "Assessments", href: "/assessments", icon: <IconBook className="w-5 h-5" /> },
  { label: "Chat with AI", href: "/chat", icon: <IconMessageCircle className="w-5 h-5" /> },
];

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
        router.push('/');
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          router.push('/');
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
    <div className="flex h-screen bg-background">
      <Sidebar>
        <SidebarBody className="flex flex-col gap-2 p-4">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.href} link={link} />
          ))}
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        <header className="flex justify-between items-center p-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Generate Course</h1>
            <p className="text-muted-foreground mt-1">Create personalized courses with AI Professor</p>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserMenu />
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          {/* Course Generator Section */}
          <div className="bg-card rounded-lg border p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <IconBrain className="w-6 h-6 text-primary" />
              Generate Your Course
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
                </>
              )}
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Generated Course Display */}
          {course && (
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>📚 {course.lessons.length} lessons</span>
                    <span>⏱️ {course.estimatedDuration}</span>
                    <span>📊 {course.difficulty}</span>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <IconDashboard className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Course Outline</h3>
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{lesson.duration}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
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
      </main>
    </div>
  );
}