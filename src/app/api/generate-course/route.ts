import { NextRequest, NextResponse } from 'next/server'
import getOpenAI from '@/lib/openaiClient'
import { supabase, supabaseAdmin, dbHelpers } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { tags, userId } = await request.json()

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'Tags are required and must be an array' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    console.log('Generating course with tags:', tags)
    const courseData = await generateCourseWithAI(tags)
    console.log('Generated course data:', courseData)

    // Use service role client for server-side operations (bypasses RLS)
    const adminClient = supabaseAdmin || supabase
    if (!supabaseAdmin) {
      console.warn('⚠️ Supabase service role key not set. Using anon client - RLS policies may block operations.')
    }

    // Save course to database
    const { data: savedCourse, error: courseError } = await adminClient
      .from('courses')
      .insert({
        title: courseData.title,
        description: courseData.description,
        short_description: courseData.description?.substring(0, 150) || courseData.description,
        duration: courseData.estimatedDuration || courseData.duration || '4 weeks',
        difficulty_level: courseData.difficulty || courseData.difficulty_level || 'Beginner',
        estimated_hours: parseEstimatedHours(courseData.estimatedDuration || courseData.duration),
        tags: courseData.tags || tags,
        is_published: true,
        created_by: userId
      })
      .select()
      .single()

    if (courseError) {
      console.error('Course creation error:', courseError)
      throw new Error(`Failed to save course: ${courseError.message}`)
    }

    const courseId = savedCourse.id
    console.log('Course saved to database with ID:', courseId)

    // Save lessons to database
    let savedLessons = []
    if (courseData.lessons && courseData.lessons.length > 0) {
      const lessonInserts = courseData.lessons.map((lesson: { title: string; content?: string; duration?: string; difficulty?: string; keyPoints?: string[]; objectives?: string[] }, index: number) => ({
        course_id: courseId,
        title: lesson.title,
        content: lesson.content || '',
        explanation: lesson.content || '',
        duration: lesson.duration || '30 min',
        difficulty: lesson.difficulty || courseData.difficulty || 'Beginner',
        key_points: lesson.keyPoints || lesson.objectives || [],
        order_index: index + 1,
        is_published: true
      }))

      const { data: insertedLessons, error: lessonsError } = await adminClient
        .from('lessons')
        .insert(lessonInserts)
        .select()

      if (lessonsError) {
        console.error('Lessons creation error:', lessonsError)
        // Don't throw, continue even if lessons fail
      } else {
        savedLessons = insertedLessons || []
        console.log(`Saved ${savedLessons.length} lessons to database`)
      }
    }

    // Enroll user in the course using admin client
    try {
      const { error: enrollError } = await adminClient
        .from('course_enrollments')
        .insert({
          user_id: userId,
          course_id: courseId,
          status: 'active',
          progress_percentage: 0
        })

      if (enrollError) {
        console.error('Enrollment error:', enrollError)
      } else {
        console.log('User enrolled in course')
      }
    } catch (enrollError) {
      console.error('Enrollment error:', enrollError)
      // Don't throw, course is already created
    }

    // Log learning analytics using admin client
    try {
      const { error: analyticsError } = await adminClient
        .from('learning_analytics')
        .insert({
          user_id: userId,
          course_id: courseId,
          session_duration: 5, // Course generation time
          lessons_completed: 0
        })

      if (analyticsError) {
        console.error('Analytics error:', analyticsError)
      } else {
        console.log('Learning session logged')
      }
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError)
      // Don't throw, course creation is successful
    }

    // Return course with database ID and saved lessons
    return NextResponse.json({
      success: true,
      course: {
        id: courseId,
        title: savedCourse.title,
        description: savedCourse.description,
        duration: savedCourse.duration,
        difficulty: savedCourse.difficulty_level,
        tags: savedCourse.tags,
        estimatedDuration: savedCourse.duration,
        difficulty_level: savedCourse.difficulty_level,
        estimated_hours: savedCourse.estimated_hours,
        lessons: savedLessons.map((lesson, index) => ({
          id: lesson.id,
          title: lesson.title,
          content: lesson.content || lesson.explanation || '',
          duration: lesson.duration,
          difficulty: lesson.difficulty,
          order_number: lesson.order_index,
          objectives: lesson.key_points || []
        })),
        created_at: savedCourse.created_at
      }
    })

  } catch (error) {
    console.error('Course generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate course' },
      { status: 500 }
    )
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
    console.log('Initializing OpenAI client...')
    const openai = getOpenAI()
    console.log('OpenAI client initialized, making API call...')
    
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

    console.log('OpenAI API call completed')
    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from OpenAI");
    }

    console.log('AI Response received:', aiResponse)
    const courseData = JSON.parse(aiResponse);
    console.log('Parsed course data:', courseData)
    
    const course = {
      id: `course_${Date.now()}`,
      ...courseData,
      tags: tags,
      lessons: courseData.lessons.map((lesson: { title: string; content: string; duration?: string; difficulty?: string; objectives?: string[] }, index: number) => ({
        id: `lesson_${index + 1}`,
        ...lesson
      }))
    };

    return course;
  } catch (error) {
    console.error("Error generating course with AI:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    
    console.log('Using fallback course generation')
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
  const lessons: { id: string; title: string; content: string; duration: string; difficulty: 'Beginner' | 'Intermediate' | 'Advanced' }[] = [];

  tags.forEach((tag, index) => {
    lessons.push({
      id: `lesson_${index + 1}`,
      title: `${tag.charAt(0).toUpperCase() + tag.slice(1)} Fundamentals`,
      content: `Master the basics of ${tag} with interactive examples and exercises`,
      duration: "40 min",
      difficulty: "Beginner",
    });
  });

  lessons.push({
    id: `lesson_${lessons.length + 1}`,
    title: "Capstone Project",
    content: `Build a comprehensive project using ${tags.join(", ")}`,
    duration: "120 min",
    difficulty: "Advanced",
  });

  return lessons;
}

// Helper function to parse estimated hours from duration string
function parseEstimatedHours(duration: string): number {
  if (!duration) return 0;
  
  // Extract number from strings like "4 weeks", "6 weeks", "2-3 weeks"
  const weekMatch = duration.match(/(\d+)/);
  if (weekMatch) {
    const weeks = parseInt(weekMatch[1]);
    // Assume ~5 hours per week average
    return weeks * 5;
  }
  
  // Extract hours from strings like "40 hours", "20h"
  const hourMatch = duration.match(/(\d+)\s*h/i);
  if (hourMatch) {
    return parseInt(hourMatch[1]);
  }
  
  // Default fallback
  return 20; // Default to 20 hours
}