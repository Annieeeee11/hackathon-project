import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Test the connection by trying to fetch from a system table
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          message: 'Failed to connect to Supabase' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      timestamp: new Date().toISOString(),
      data: data || []
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Unexpected error occurred' 
      },
      { status: 500 }
    );
  }
}
