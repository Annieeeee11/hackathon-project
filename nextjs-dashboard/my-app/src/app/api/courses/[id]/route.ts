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

    // Get course with lessons and user progress
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        lessons:lessons(
          id, 
          title, 
          content, 
          explanation, 
          code_example, 
          key_points, 
          duration, 
          difficulty, 
          order_index
        ),
        course_enrollments!inner(
          user_id, 
          progress_percentage, 
          status, 
          enrollment_date,
          last_accessed
        )
      `)
      .eq('id', id)
      .eq('is_published', true)
      .eq('course_enrollments.user_id', user.id)
      .single();

    if (courseError) {
      console.error('Error fetching course:', courseError);
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get user progress for lessons
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('lesson_id, completed, time_spent, completed_at')
      .eq('user_id', user.id)
      .eq('course_id', id);

    if (progressError) {
      console.error('Error fetching progress:', progressError);
    }

    // Transform lessons with progress data
    const lessonsWithProgress = course.lessons?.map((lesson: any) => {
      const lessonProgress = progress?.find(p => p.lesson_id === lesson.id);
      return {
        ...lesson,
        completed: lessonProgress?.completed || false,
        time_spent: lessonProgress?.time_spent || 0,
        completed_at: lessonProgress?.completed_at
      };
    }) || [];

    // Sort lessons by order_index
    lessonsWithProgress.sort((a: any, b: any) => a.order_index - b.order_index);

    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      difficulty: course.difficulty_level,
      tags: course.tags || [],
      lessons: lessonsWithProgress,
      total_lessons: lessonsWithProgress.length,
      estimated_hours: course.estimated_hours,
      progress: course.course_enrollments?.[0]?.progress_percentage || 0,
      status: course.course_enrollments?.[0]?.status || 'not-started',
      enrollment_date: course.course_enrollments?.[0]?.enrollment_date,
      last_accessed: course.course_enrollments?.[0]?.last_accessed,
      created_at: course.created_at
    };

    return NextResponse.json({ course: transformedCourse });
  } catch (error) {
    console.error('Error in course API:', error);
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

    // Update course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .update(body)
      .eq('id', id)
      .eq('created_by', user.id) // Only allow course creator to update
      .select()
      .single();

    if (courseError) {
      console.error('Error updating course:', courseError);
      return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error in course PUT API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
