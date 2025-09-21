import { NextRequest, NextResponse } from "next/server";
import getOpenAI from "@/lib/openaiClient";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const { tags, userId } = await request.json()

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({ error: "At least one tag is required" }, { status: 400 });
    }

    // Generate course using OpenAI
    const course = await generateCourseWithAI(tags);

    // Optionally save to Supabase
    // const { data, error } = await supabase
    //   .from('courses')
    //   .insert(course)
    //   .select();

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error in generate-course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function generateCourseWithAI(tags: string[]) {
  const prompt = `Create a comprehensive learning course for the following skills/topics: ${tags.join(", ")}.

Please generate a course with the following structure:
- Course title
- Course description (2-3 sentences)
- Estimated duration
- Difficulty level (Beginner/Intermediate/Advanced)
- 5-7 detailed lessons with titles, descriptions, durations, and difficulty levels

Make the course practical, engaging, and suitable for someone wanting to learn these skills. Each lesson should build upon the previous one.

Return the response in the following JSON format:
{
  "title": "Course Title",
  "description": "Course description",
  "estimatedDuration": "X weeks",
  "difficulty": "Beginner/Intermediate/Advanced",
  "lessons": [
    {
      "title": "Lesson Title",
      "content": "Lesson description",
      "duration": "X min",
      "difficulty": "Beginner/Intermediate/Advanced"
    }
  ]
}`;

  try {
    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert course creator and educational content designer. Create comprehensive, practical courses that help students learn effectively."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const courseData = JSON.parse(aiResponse);
    
    // Add additional metadata
    const course = {
      id: `course_${Date.now()}`,
      ...courseData,
      tags: tags,
      lessons: courseData.lessons.map((lesson: any, index: number) => ({
        id: `lesson_${index + 1}`,
        ...lesson
      }))
    };

    return course;
  } catch (error) {
    console.error("Error generating course with AI:", error);
    
    // Fallback to basic course generation if AI fails
    return {
      id: `course_${Date.now()}`,
      title: `Complete ${tags.join(" & ")} Mastery Course`,
      description: `A comprehensive course covering ${tags.join(", ")} with hands-on projects and real-world applications. Learn from our AI Professor with interactive lessons and assessments.`,
      tags: tags,
      estimatedDuration: "4-6 weeks",
      difficulty: tags.length > 3 ? "Advanced" : tags.length > 1 ? "Intermediate" : "Beginner",
      lessons: generateFallbackLessons(tags),
    };
  }
}

function generateFallbackLessons(tags: string[]) {
  const lessons = [];
  const baseLessons = [
    {
      title: "Introduction & Setup",
      content: "Get started with the fundamentals and set up your development environment",
      duration: "30 min",
      difficulty: "Beginner" as const,
    },
    {
      title: "Core Concepts",
      content: "Learn the essential concepts and principles",
      duration: "45 min",
      difficulty: "Beginner" as const,
    },
    {
      title: "Hands-on Practice",
      content: "Apply what you've learned with practical exercises",
      duration: "60 min",
      difficulty: "Intermediate" as const,
    },
    {
      title: "Advanced Topics",
      content: "Dive deeper into advanced concepts and best practices",
      duration: "50 min",
      difficulty: "Advanced" as const,
    },
    {
      title: "Project Building",
      content: "Build a real-world project to showcase your skills",
      duration: "90 min",
      difficulty: "Advanced" as const,
    },
  ];

  // Generate lessons based on tags
  tags.forEach((tag, index) => {
    lessons.push({
      id: `lesson_${index + 1}`,
      title: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Fundamentals`,
      content: `Master the basics of ${tag} with interactive examples and exercises`,
      duration: "40 min",
      difficulty: "Beginner" as const,
    });
  });

  // Add project-based lessons
  lessons.push({
    id: `lesson_${lessons.length + 1}`,
    title: "Capstone Project",
    content: `Build a comprehensive project using ${tags.join(", ")}`,
    duration: "120 min",
    difficulty: "Advanced" as const,
  });

  return lessons;
}
