import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Get all published courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .limit(6);

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }

    // Get all assessments
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessments')
      .select('*')
      .eq('is_published', true)
      .limit(5);

    if (assessmentsError) {
      console.error('Error fetching assessments:', assessmentsError);
    }

    // Get achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .limit(5);

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
    }

    // Transform data for frontend
    const dashboardData = {
      user: {
        id: 'test-user',
        email: 'test@example.com',
        full_name: 'Test User'
      },
      stats: {
        totalCourses: courses?.length || 0,
        completedCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        totalAssessments: assessments?.length || 0,
        completedAssessments: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      recentCourses: courses?.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        duration: course.duration,
        difficulty: course.difficulty_level,
        tags: course.tags || [],
        progress: 0,
        status: 'not-started',
        last_accessed: course.created_at,
        created_at: course.created_at
      })) || [],
      recentAssessments: assessments?.map(assessment => ({
        id: assessment.id,
        title: assessment.title,
        difficulty: assessment.difficulty,
        timeLimit: assessment.time_limit,
        status: 'not-started',
        score: undefined,
        completed_at: undefined,
        created_at: assessment.created_at
      })) || [],
      achievements: achievements?.map(achievement => ({
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        type: achievement.type,
        icon_url: achievement.icon_url,
        points: achievement.points,
        earned_at: achievement.earned_at
      })) || [],
      analytics: []
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
