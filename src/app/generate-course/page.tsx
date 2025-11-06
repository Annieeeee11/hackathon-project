"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
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
import { PageHeader } from "@/components/common/PageHeader";
import { PageHero } from "@/components/common/PageHero";
import { Card } from "@/components/common/Card";
import { Tag, TagList } from "@/components/common/Tag";
import { InfoItem, InfoList } from "@/components/common/InfoItem";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";

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
  const [user, setUser] = useState<{ id?: string; email?: string } | null>(null);
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
        body: JSON.stringify({ tags, userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate course");
      }

      const data = await response.json();
      setCourse(data.course);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
    <div className="min-h-screen bg-background">
      <PageHeader
        title="AI Learning Assistant"
        logo={<IconBrain className="w-8 h-8 text-primary" />}
        actions={
          <Link href="/chat">
            <Button variant="outline">
              <IconMessageCircle className="w-4 h-4 mr-2" />
              AI Chat
            </Button>
          </Link>
        }
      />

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <PageHero
            icon={<IconRocket />}
            title={
              <>
                Generate Your
                <span className="text-primary"> AI Course</span>
              </>
            }
            description="Create personalized courses with our AI Professor. Add skill tags and get structured lessons tailored just for you!"
          />

          <Card padding="lg" className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <IconBrain className="w-6 h-6 text-primary" />
              Course Generator
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Add skill tags to generate a personalized course. Our AI Professor will create structured lessons just for you!
            </p>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Popular Skills</h3>
              <TagList>
                {popularTags.map((tag) => (
                  <Tag
                    key={tag}
                    variant={tags.includes(tag) ? "primary" : "default"}
                    onClick={() => addTag(tag)}
                    disabled={tags.includes(tag)}
                  >
                    #{tag}
                  </Tag>
                ))}
              </TagList>
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

            {tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Selected Skills ({tags.length})</h3>
                <TagList>
                  {tags.map((tag) => (
                    <Tag
                      key={tag}
                      variant="primary"
                      onRemove={() => removeTag(tag)}
                    >
                      #{tag}
                    </Tag>
                  ))}
                </TagList>
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
              <Card variant="default" padding="md" className="mt-4 bg-destructive/10 border-destructive/20">
                <p className="text-destructive text-sm">{error}</p>
              </Card>
            )}
          </Card>

          {course && (
            <Card padding="lg">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-3">{course.title}</h2>
                  <p className="text-muted-foreground mb-4 text-lg">{course.description}</p>
                  <InfoList>
                    <InfoItem icon={<IconBook className="w-4 h-4" />} label={`${course.lessons.length} lessons`} />
                    <InfoItem icon={<IconLoader2 className="w-4 h-4" />} label={course.estimatedDuration} />
                    <InfoItem icon={<IconBrain className="w-4 h-4" />} label={course.difficulty} />
                  </InfoList>
                </div>
                <Link href={`/course/${course.id}`}>
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
                  <Card
                    key={lesson.id}
                    variant="muted"
                    padding="md"
                    hover
                  >
                    <div className="flex items-center justify-between">
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
                        <DifficultyBadge difficulty={lesson.difficulty} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
    </AppLayout>
  );
}