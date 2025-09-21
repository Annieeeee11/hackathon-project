import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get lesson with course info
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select(`
        *,
        courses!inner(
          id,
          title,
          is_published,
          course_enrollments!inner(user_id, status)
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .eq('courses.is_published', true)
      .eq('courses.course_enrollments.user_id', user.id)
      .single();

    if (lessonError) {
      console.error('Error fetching lesson:', lessonError);
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get user progress for this lesson
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('completed, time_spent, last_position, completed_at')
      .eq('user_id', user.id)
      .eq('lesson_id', id)
      .single();

    const transformedLesson = {
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      explanation: lesson.explanation,
      codeExample: lesson.code_example,
      keyPoints: lesson.key_points || [],
      duration: lesson.duration,
      difficulty: lesson.difficulty,
      order_index: lesson.order_index,
      course_id: lesson.course_id,
      course_title: lesson.courses.title,
      completed: progress?.completed || false,
      time_spent: progress?.time_spent || 0,
      last_position: progress?.last_position || 0,
      completed_at: progress?.completed_at,
      created_at: lesson.created_at
    };

    return NextResponse.json({ lesson: transformedLesson });
  } catch (error) {
    console.error('Error in lesson API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { completed, time_spent, last_position } = body;

    // Update or create user progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: id,
        course_id: body.course_id,
        completed: completed || false,
        time_spent: time_spent || 0,
        last_position: last_position || 0,
        completed_at: completed ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (progressError) {
      console.error('Error updating progress:', progressError);
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
    }

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error in lesson PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
