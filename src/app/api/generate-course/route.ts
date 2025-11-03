import { NextRequest, NextResponse } from 'next/server'
import getOpenAI from '@/lib/openaiClient'
import { supabase, dbHelpers } from '@/lib/supabaseClient'

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

    return NextResponse.json({
      success: true,
      course: courseData
    })

    try {
      await dbHelpers.enrollInCourse(userId, courseData.id)
    } catch (enrollError) {
      console.error('Enrollment error:', enrollError)
    }

    if (courseData.lessons && courseData.lessons.length > 0) {
      const lessonInserts = courseData.lessons.map((lesson: { title: string; content?: string; objectives?: string[] }, index: number) => ({
        course_id: courseData.id,
        title: lesson.title,
        content: lesson.content || '',
        lesson_type: 'theory',
        order_number: index + 1,
        duration_minutes: 30,
        objectives: lesson.objectives || [],
        is_published: true
      })) as { course_id: string; title: string; content: string; lesson_type: string; order_number: number; duration_minutes: number; objectives: string[]; is_published: boolean }[]

      const { error: lessonsError } = await supabase
        .from('lessons')
        .insert(lessonInserts)

      if (lessonsError) {
        console.error('Lessons creation error:', lessonsError)
      }
    }

    try {
      await dbHelpers.logLearningSession(userId, courseData.id, {
        session_duration: 5, // Course generation time
        lessons_completed: 0
      })
    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError)
    }

    return NextResponse.json({
      success: true,
      course: {
        ...courseData,
        lessons: courseData.lessons
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