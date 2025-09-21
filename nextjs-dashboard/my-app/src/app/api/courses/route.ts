import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get all published courses (without requiring user enrollment for now)
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        lessons:lessons(id, title, order_index, duration, difficulty)
      `)
      .eq('is_published', true);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    // Transform data to match frontend interface
    const transformedCourses = courses?.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      difficulty: course.difficulty_level,
      tags: course.tags || [],
      lessons: course.lessons?.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        completed: false // Default to not completed
      })) || [],
      progress: 0, // Default progress
      status: 'not-started', // Default status
      enrollment_date: course.created_at,
      created_at: course.created_at
    })) || [];

    return NextResponse.json({ courses: transformedCourses });
  } catch (error) {
    console.error('Error in courses API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // For now, get the first user from the database for testing
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      return NextResponse.json({ error: 'No users found. Please create a user first.' }, { status: 404 });
    }
    
    const userId = users[0].id;

    const body = await request.json();
    const { title, description, difficulty_level, tags, estimated_hours } = body;

    // Create new course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        difficulty_level,
        tags: tags || [],
        estimated_hours: estimated_hours || 0,
        created_by: userId,
        is_published: false
      })
      .select()
      .single();

    if (courseError) {
      console.error('Error creating course:', courseError);
      return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error in courses POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
