<<<<<<< HEAD
import { NextResponse } from "next/server";
import { openai } from "@/lib/openaiClient";
import { supabase } from "@/lib/supabaseClient";
=======
import { NextRequest, NextResponse } from 'next/server'
import { generateCourse } from '../../../lib/openaiClient'
import { supabase, dbHelpers } from '../../../lib/supabaseClient'
>>>>>>> 3ce65133f5781cf3b6e75551a8ce34ad65468b9b

export async function POST(request: NextRequest) {
  try {
    const { tags, userId } = await request.json()

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'Tags are required and must be an array' },
        { status: 400 }
      )
    }

<<<<<<< HEAD
    // Generate course using OpenAI
    const course = await generateCourseWithAI(tags);

    // Optionally save to Supabase
    // const { data, error } = await supabase
    //   .from('courses')
    //   .insert(course)
    //   .select();
=======
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate course using OpenAI
    const courseData = await generateCourse(tags)

    // Calculate estimated hours and lesson count
    const totalLessons = courseData.lessons?.length || 0
    const estimatedHours = totalLessons * 0.5 // Assume 30 min per lesson

    // Save course to Supabase
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: courseData.title,
        description: courseData.description,
        duration: courseData.duration,
        tags: tags,
        lessons: courseData.lessons,
        assessments: courseData.assessments,
        user_id: userId,
        instructor_id: userId,
        status: 'active',
        total_lessons: totalLessons,
        estimated_hours: estimatedHours,
        difficulty_level: 'beginner'
      })
      .select()
      .single()

    if (courseError) {
      console.error('Database error:', courseError)
      return NextResponse.json(
        { error: 'Failed to save course' },
        { status: 500 }
      )
    }

    // Create course enrollment for the user
    try {
      await dbHelpers.enrollInCourse(userId, course.id)
    } catch (enrollError) {
      console.error('Enrollment error:', enrollError)
      // Continue even if enrollment fails
    }

    // Create lessons in the database
    if (courseData.lessons && courseData.lessons.length > 0) {
      const lessonInserts = courseData.lessons.map((lesson: any, index: number) => ({
        course_id: course.id,
        title: lesson.title,
        content: lesson.content || '',
        lesson_type: 'theory',
        order_number: index + 1,
        duration_minutes: 30,
        objectives: lesson.objectives || [],
        is_published: true
      }))

      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessonInserts)

      if (lessonsError) {
        console.error('Lessons creation error:', lessonsError)
        // Continue even if lessons creation fails
      }
    }

    // Create assessments in the database
    if (courseData.assessments && courseData.assessments.length > 0) {
      const assessmentInserts = courseData.assessments.map((assessment: any) => ({
        course_id: course.id,
        title: assessment.title,
        description: assessment.description,
        assessment_type: assessment.type || 'quiz',
        questions: assessment.questions || {},
        max_score: 100,
        passing_score: 70,
        time_limit_minutes: 60,
        is_published: true
      }))

      const { error: assessmentsError } = await supabase
        .from('assessments')
        .insert(assessmentInserts)

      if (assessmentsError) {
        console.error('Assessments creation error:', assessmentsError)
        // Continue even if assessments creation fails
      }
    }

    // Log learning analytics
    try {
      await dbHelpers.logLearningSession(userId, course.id, {
        session_duration: 5, // Course generation time
        lessons_completed: 0
      })
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError)
      // Continue even if analytics logging fails
    }

    return NextResponse.json({
      success: true,
      course: {
        ...course,
        lessons: courseData.lessons,
        assessments: courseData.assessments
      }
    })
>>>>>>> 3ce65133f5781cf3b6e75551a8ce34ad65468b9b

  } catch (error) {
    console.error('Course generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate course' },
      { status: 500 }
    )
  }
<<<<<<< HEAD
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
=======
}
>>>>>>> 3ce65133f5781cf3b6e75551a8ce34ad65468b9b
