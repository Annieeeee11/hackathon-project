import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // For now, get the first user from the database for testing
    // In production, you would implement proper authentication
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (userError || !users || users.length === 0) {
      console.error('No users found:', userError);
      return NextResponse.json({ error: 'No users found. Please create a user first.' }, { status: 404 });
    }
    
    const userId = users[0].id;

    // Get user's enrolled courses with progress
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        courses!inner(
          id,
          title,
          description,
          duration,
          difficulty_level,
          tags,
          thumbnail_url,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('last_accessed', { ascending: false })
      .limit(6);

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }

    // Get user's recent assessments
    const { data: assessments, error: assessmentsError } = await supabase
      .from('assessment_attempts')
      .select(`
        *,
        assessments!inner(
          id,
          title,
          difficulty,
          time_limit
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (assessmentsError) {
      console.error('Error fetching assessments:', assessmentsError);
    }

    // Get user's learning analytics for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: analytics, error: analyticsError } = await supabase
      .from('learning_analytics')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', sevenDaysAgo.toISOString().split('T')[0])
      .order('session_date', { ascending: true });

    if (analyticsError) {
      console.error('Error fetching analytics:', analyticsError);
    }

    // Get user's achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(5);

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
    }

    // Get user's streak data
    const { data: streak, error: streakError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (streakError) {
      console.error('Error fetching streak:', streakError);
    }

    // Calculate total progress
    const totalLessons = enrollments?.reduce((total, enrollment) => {
      return total + (enrollment.courses?.total_lessons || 0);
    }, 0) || 0;

    const completedLessons = enrollments?.reduce((total, enrollment) => {
      return total + Math.round((enrollment.progress_percentage / 100) * (enrollment.courses?.total_lessons || 0));
    }, 0) || 0;

    // Transform data for frontend
    const dashboardData = {
      user: {
        id: userId,
        email: 'test@example.com',
        full_name: 'Test User'
      },
      stats: {
        totalCourses: enrollments?.length || 0,
        completedCourses: enrollments?.filter(e => e.status === 'completed').length || 0,
        totalLessons,
        completedLessons,
        totalAssessments: assessments?.length || 0,
        completedAssessments: assessments?.filter(a => a.status === 'completed').length || 0,
        currentStreak: streak?.current_streak || 0,
        longestStreak: streak?.longest_streak || 0
      },
      recentCourses: enrollments?.map(enrollment => ({
        id: enrollment.courses.id,
        title: enrollment.courses.title,
        description: enrollment.courses.description,
        duration: enrollment.courses.duration,
        difficulty: enrollment.courses.difficulty_level,
        tags: enrollment.courses.tags || [],
        progress: enrollment.progress_percentage,
        status: enrollment.status,
        last_accessed: enrollment.last_accessed,
        created_at: enrollment.courses.created_at
      })) || [],
      recentAssessments: assessments?.map(assessment => ({
        id: assessment.assessments.id,
        title: assessment.assessments.title,
        difficulty: assessment.assessments.difficulty,
        timeLimit: assessment.assessments.time_limit,
        status: assessment.status,
        score: assessment.score,
        completed_at: assessment.completed_at,
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
      analytics: analytics?.map(analytic => ({
        date: analytic.session_date,
        duration: analytic.session_duration,
        lessons_completed: analytic.lessons_completed,
        assessments_completed: analytic.assessments_completed,
        total_score: analytic.total_score
      })) || []
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}