import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get published assessments with user attempts
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select(`
        *,
        assessment_attempts!left(
          id,
          status,
          score,
          time_spent,
          started_at,
          completed_at
        )
      `)
      .eq('is_published', true);

    if (assessmentsError) {
      console.error('Error fetching assessments:', assessmentsError);
      return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
    }

    // Transform data to match frontend interface
    const transformedAssessments = assessments?.map(assessment => {
      // Find user's attempt for this assessment
      const userAttempt = assessment.assessment_attempts?.find(
        (attempt: any) => attempt.user_id === user.id
      );

      return {
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
        status: userAttempt?.status || 'not-started',
        score: userAttempt?.score,
        time_spent: userAttempt?.time_spent,
        started_at: userAttempt?.started_at,
        completed_at: userAttempt?.completed_at,
        created_at: assessment.created_at
      };
    }) || [];

    return NextResponse.json({ assessments: transformedAssessments });
  } catch (error) {
    console.error('Error in assessments API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      description, 
      difficulty, 
      time_limit, 
      instructions, 
      starter_code, 
      test_cases, 
      expected_output,
      course_id,
      lesson_id 
    } = body;

    // Create new assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        title,
        description,
        difficulty,
        time_limit: time_limit || 30,
        instructions,
        starter_code,
        test_cases: test_cases || [],
        expected_output,
        course_id,
        lesson_id,
        created_by: user.id,
        is_published: false
      })
      .select()
      .single();

    if (assessmentError) {
      console.error('Error creating assessment:', assessmentError);
      return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
    }

    return NextResponse.json({ assessment });
  } catch (error) {
    console.error('Error in assessments POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
