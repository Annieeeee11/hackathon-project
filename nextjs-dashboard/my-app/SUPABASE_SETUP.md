# Supabase Setup Guide for AI Learning Assistant

## Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Run Database Migration
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire content from `database_blueprint.sql`
4. Execute the SQL script

### 3. Configure Environment Variables
Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Enable Authentication
1. Go to Authentication > Settings in Supabase dashboard
2. Configure your preferred auth providers (Email, Google, GitHub, etc.)
3. Set up email templates if needed

### 5. Test the Setup
1. Try creating a user account
2. Check if the profile is automatically created
3. Verify RLS policies are working

## Key Tables Created

### Core Tables
- ✅ `profiles` - User profiles
- ✅ `courses` - Course information
- ✅ `lessons` - Individual lessons
- ✅ `course_enrollments` - User course enrollments
- ✅ `assessments` - Coding assessments
- ✅ `assessment_attempts` - User assessment attempts

### Tracking Tables
- ✅ `user_progress` - Lesson progress tracking
- ✅ `learning_analytics` - Learning session data
- ✅ `chat_history` - AI chat conversations
- ✅ `ai_interactions` - AI usage tracking

### Gamification Tables
- ✅ `achievements` - User achievements
- ✅ `user_streaks` - Learning streaks
- ✅ `notifications` - User notifications
- ✅ `user_feedback` - User feedback and ratings

## Security Features

### Row Level Security (RLS)
- ✅ All tables have RLS enabled
- ✅ Users can only access their own data
- ✅ Published content is publicly readable
- ✅ Authors can manage their content

### Automatic Features
- ✅ User profiles created on signup
- ✅ Course progress auto-updated
- ✅ Timestamps auto-updated
- ✅ Streak tracking initialized

## Sample Data
The blueprint includes sample data for testing:
- Sample React course
- Sample lesson with code examples
- Sample assessment challenge

## Next Steps

1. **Update your Supabase client** to use the new schema
2. **Implement API routes** for course management
3. **Add real-time subscriptions** for progress updates
4. **Set up file storage** for course thumbnails and assets
5. **Configure email notifications** for achievements

## Troubleshooting

### Common Issues
1. **RLS blocking queries**: Check your policies and user authentication
2. **Foreign key errors**: Ensure referenced records exist
3. **Permission denied**: Verify user has proper access rights

### Useful Queries
```sql
-- Check user profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Get user's courses
SELECT c.*, ce.progress_percentage 
FROM courses c 
JOIN course_enrollments ce ON c.id = ce.course_id 
WHERE ce.user_id = auth.uid();

-- Get user's progress
SELECT l.title, up.completed, up.time_spent
FROM user_progress up
JOIN lessons l ON up.lesson_id = l.id
WHERE up.user_id = auth.uid();
```

## Support
- Check Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the database documentation: `DATABASE_DOCUMENTATION.md`
- Test with the provided sample data
