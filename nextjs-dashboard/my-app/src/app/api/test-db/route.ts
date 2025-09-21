import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Test basic database connection
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .limit(5);

    if (coursesError) {
      console.error('Database error:', coursesError);
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: coursesError.message 
      }, { status: 500 });
    }

    // Test profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profilesError) {
      console.error('Profiles error:', profilesError);
      return NextResponse.json({ 
        error: 'Profiles table error', 
        details: profilesError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Database connection successful',
      data: {
        courses: courses || [],
        hasUsers: profiles && profiles.length > 0,
        userCount: profiles?.length || 0
      }
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
