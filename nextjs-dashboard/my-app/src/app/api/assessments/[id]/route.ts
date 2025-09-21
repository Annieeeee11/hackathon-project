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

    // Get assessment details
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .eq('is_published', true)
      .single();

    if (assessmentError) {
      console.error('Error fetching assessment:', assessmentError);
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Get user's attempt for this assessment
    const { data: attempt, error: attemptError } = await supabase
      .from('assessment_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('assessment_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const transformedAssessment = {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      difficulty: assessment.difficulty,
      timeLimit: assessment.time_limit,
      instructions: assessment.instructions,
      starter_code: assessment.starter_code,
      test_cases: assessment.test_cases,
      expected_output: assessment.expected_output,
      course_id: assessment.course_id,
      lesson_id: assessment.lesson_id,
      status: attempt?.status || 'not-started',
      score: attempt?.score,
      submitted_code: attempt?.submitted_code,
      execution_result: attempt?.execution_result,
      time_spent: attempt?.time_spent,
      started_at: attempt?.started_at,
      completed_at: attempt?.completed_at,
      created_at: assessment.created_at
    };

    return NextResponse.json({ assessment: transformedAssessment });
  } catch (error) {
    console.error('Error in assessment API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
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
    const { 
      status, 
      submitted_code, 
      execution_result, 
      time_spent, 
      score 
    } = body;

    // Create or update assessment attempt
    const { data: attempt, error: attemptError } = await supabase
      .from('assessment_attempts')
      .upsert({
        user_id: user.id,
        assessment_id: id,
        status: status || 'in-progress',
        submitted_code,
        execution_result,
        time_spent: time_spent || 0,
        score: score || 0,
        started_at: status === 'in-progress' ? new Date().toISOString() : undefined,
        completed_at: status === 'completed' ? new Date().toISOString() : undefined
      })
      .select()
      .single();

    if (attemptError) {
      console.error('Error updating assessment attempt:', attemptError);
      return NextResponse.json({ error: 'Failed to update assessment attempt' }, { status: 500 });
    }

    return NextResponse.json({ attempt });
  } catch (error) {
    console.error('Error in assessment POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
