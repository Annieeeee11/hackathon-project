# AI Learning Assistant - Database Blueprint

## Overview
This document outlines the complete database schema for the AI Learning Assistant application built with Supabase. The database is designed to support course management, lesson tracking, assessments, AI interactions, and user progress monitoring.

## Database Tables

### 1. User Management

#### `profiles`
Extends Supabase's `auth.users` table with additional user information.
- **id**: UUID (references auth.users)
- **email**: User's email address
- **full_name**: User's display name
- **avatar_url**: Profile picture URL
- **bio**: User biography
- **learning_goals**: Array of learning objectives
- **preferred_language**: Language preference
- **timezone**: User's timezone

### 2. Course Management

#### `courses`
Main course information and metadata.
- **id**: UUID primary key
- **title**: Course title
- **description**: Detailed course description
- **short_description**: Brief course summary
- **duration**: Course duration (e.g., "4 weeks")
- **difficulty_level**: Beginner/Intermediate/Advanced
- **estimated_hours**: Total learning hours
- **tags**: Array of course tags
- **thumbnail_url**: Course image URL
- **is_published**: Publication status
- **created_by**: Course author (UUID)

#### `lessons`
Individual lessons within courses.
- **id**: UUID primary key
- **course_id**: Reference to parent course
- **title**: Lesson title
- **content**: Main lesson content
- **explanation**: Detailed explanation
- **code_example**: Code snippets/examples
- **key_points**: Array of key learning points
- **duration**: Lesson duration
- **difficulty**: Lesson difficulty level
- **order_index**: Lesson sequence in course
- **is_published**: Publication status

#### `course_enrollments`
Tracks user enrollment in courses.
- **id**: UUID primary key
- **user_id**: Reference to user
- **course_id**: Reference to course
- **enrollment_date**: When user enrolled
- **progress_percentage**: Completion percentage (0-100)
- **status**: active/completed/paused/dropped
- **last_accessed**: Last activity timestamp
- **completed_at**: Course completion timestamp

### 3. Assessment System

#### `assessments`
Coding challenges and quizzes.
- **id**: UUID primary key
- **title**: Assessment title
- **description**: Assessment description
- **difficulty**: Difficulty level
- **time_limit**: Time limit in minutes
- **instructions**: Detailed instructions
- **starter_code**: Initial code template
- **test_cases**: JSON array of test cases
- **expected_output**: Expected results
- **course_id**: Optional course association
- **lesson_id**: Optional lesson association
- **is_published**: Publication status

#### `assessment_attempts`
User attempts at assessments.
- **id**: UUID primary key
- **user_id**: Reference to user
- **assessment_id**: Reference to assessment
- **status**: not-started/in-progress/completed/abandoned
- **score**: Score percentage (0-100)
- **submitted_code**: User's code submission
- **execution_result**: JSON results from code execution
- **time_spent**: Time taken in seconds
- **started_at**: Attempt start time
- **completed_at**: Attempt completion time

### 4. Progress Tracking

#### `user_progress`
Tracks lesson completion and progress.
- **id**: UUID primary key
- **user_id**: Reference to user
- **lesson_id**: Reference to lesson
- **course_id**: Reference to course
- **completed**: Boolean completion status
- **time_spent**: Time spent in seconds
- **last_position**: Last position in content
- **completed_at**: Completion timestamp

#### `learning_analytics`
Daily learning analytics and statistics.
- **id**: UUID primary key
- **user_id**: Reference to user
- **course_id**: Optional course reference
- **session_duration**: Session time in seconds
- **lessons_completed**: Lessons completed in session
- **assessments_completed**: Assessments completed in session
- **total_score**: Total score achieved
- **session_date**: Date of the session

### 5. AI Interactions

#### `chat_history`
Stores AI chat conversations.
- **id**: UUID primary key
- **user_id**: Reference to user
- **course_id**: Optional course context
- **lesson_id**: Optional lesson context
- **assessment_id**: Optional assessment context
- **context**: Type of chat (general_chat/lesson_chat/assessment_help/course_guidance)
- **question**: User's question
- **answer**: AI's response
- **message_type**: text/code/explanation

#### `ai_interactions`
Tracks AI usage and performance.
- **id**: UUID primary key
- **user_id**: Reference to user
- **interaction_type**: Type of AI interaction
- **input_data**: JSON input data
- **output_data**: JSON output data
- **tokens_used**: Number of tokens consumed
- **processing_time**: Processing time in milliseconds

### 6. Gamification

#### `achievements`
User achievements and badges.
- **id**: UUID primary key
- **user_id**: Reference to user
- **title**: Achievement title
- **description**: Achievement description
- **type**: Achievement type
- **icon_url**: Achievement icon
- **points**: Points awarded
- **earned_at**: When earned
- **metadata**: Additional JSON data

#### `user_streaks`
Learning streak tracking.
- **id**: UUID primary key
- **user_id**: Reference to user (unique)
- **current_streak**: Current streak count
- **longest_streak**: Best streak achieved
- **last_activity_date**: Last learning activity
- **streak_type**: daily/weekly

### 7. Notifications & Feedback

#### `notifications`
User notifications system.
- **id**: UUID primary key
- **user_id**: Reference to user
- **title**: Notification title
- **message**: Notification message
- **type**: Notification type
- **is_read**: Read status
- **action_url**: Optional action URL

#### `user_feedback`
User feedback and ratings.
- **id**: UUID primary key
- **user_id**: Reference to user
- **course_id**: Optional course reference
- **lesson_id**: Optional lesson reference
- **assessment_id**: Optional assessment reference
- **rating**: 1-5 star rating
- **feedback_text**: Written feedback
- **feedback_type**: Type of feedback

## Key Features

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- Users can only access their own data
- Published content is publicly readable
- Authors can manage their own content
- System can create achievements and notifications

### Automatic Triggers
- **Profile Creation**: Automatically creates user profile and streak tracking on signup
- **Progress Updates**: Automatically updates course progress when lessons are completed
- **Timestamp Updates**: Automatically updates `updated_at` fields

### Performance Optimizations
- Comprehensive indexing on frequently queried columns
- Foreign key constraints for data integrity
- JSONB fields for flexible data storage
- Efficient query patterns with proper joins

## Usage Examples

### Creating a New Course
```sql
INSERT INTO courses (title, description, difficulty_level, tags, created_by)
VALUES ('Advanced React', 'Learn advanced React patterns', 'Advanced', ARRAY['react', 'advanced'], auth.uid());
```

### Enrolling a User in a Course
```sql
INSERT INTO course_enrollments (user_id, course_id)
VALUES (auth.uid(), 'course-uuid-here');
```

### Recording Lesson Progress
```sql
INSERT INTO user_progress (user_id, lesson_id, course_id, completed, time_spent)
VALUES (auth.uid(), 'lesson-uuid', 'course-uuid', true, 1800);
```

### Storing Chat History
```sql
INSERT INTO chat_history (user_id, course_id, context, question, answer)
VALUES (auth.uid(), 'course-uuid', 'lesson_chat', 'How do hooks work?', 'Hooks are functions that let you use state...');
```

## Migration Strategy

1. **Phase 1**: Core tables (profiles, courses, lessons, enrollments)
2. **Phase 2**: Assessment system (assessments, attempts)
3. **Phase 3**: Progress tracking (user_progress, analytics)
4. **Phase 4**: AI interactions (chat_history, ai_interactions)
5. **Phase 5**: Gamification (achievements, streaks)
6. **Phase 6**: Notifications and feedback

## Security Considerations

- All user data is protected by RLS policies
- Sensitive operations require authentication
- API keys and tokens are stored securely
- User input is sanitized and validated
- Audit trails for important operations

## Monitoring and Analytics

The database supports comprehensive analytics:
- User engagement metrics
- Course completion rates
- Assessment performance
- AI interaction patterns
- Learning progress tracking
- Streak and achievement monitoring

This schema provides a solid foundation for a scalable AI-powered learning platform with comprehensive user tracking, progress monitoring, and interactive features.
