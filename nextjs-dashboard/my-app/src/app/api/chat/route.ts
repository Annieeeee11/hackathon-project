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

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const lessonId = searchParams.get('lessonId');
    const assessmentId = searchParams.get('assessmentId');

    // Build query
    let query = supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    if (lessonId) {
      query = query.eq('lesson_id', lessonId);
    }
    if (assessmentId) {
      query = query.eq('assessment_id', assessmentId);
    }

    const { data: chatHistory, error: chatError } = await query;

    if (chatError) {
      console.error('Error fetching chat history:', chatError);
      return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
    }

    return NextResponse.json({ messages: chatHistory || [] });
  } catch (error) {
    console.error('Error in chat API:', error);
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
      question, 
      answer, 
      courseId, 
      lessonId, 
      assessmentId, 
      context = 'general_chat',
      messageType = 'text' 
    } = body;

    // Save chat interaction
    const { data: chatEntry, error: chatError } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.id,
        course_id: courseId || null,
        lesson_id: lessonId || null,
        assessment_id: assessmentId || null,
        context,
        question,
        answer,
        message_type: messageType
      })
      .select()
      .single();

    if (chatError) {
      console.error('Error saving chat history:', chatError);
      return NextResponse.json({ error: 'Failed to save chat history' }, { status: 500 });
    }

    return NextResponse.json({ message: chatEntry });
  } catch (error) {
    console.error('Error in chat POST API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}