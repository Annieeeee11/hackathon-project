'use client'
import Link from 'next/link'

// Utility function to format dates consistently for SSR
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}/${year}`
}

interface Lesson {
  id: number;
  title: string;
  completed: boolean;
}

interface Course {
  id: string | number;
  title: string;
  description: string;
  duration?: string;
  lessons?: Lesson[];
  tags?: string[];
  created_at: string;
}

interface CourseCardProps {
  course: Course;
  progress?: number;
}

export default function CourseCard({ course, progress = 0 }: CourseCardProps) {
  const {
    id,
    title,
    description,
    duration,
    lessons = [],
    tags = [],
    created_at
  } = course

  const completedLessons = lessons.filter((lesson: Lesson) => lesson.completed).length
  const totalLessons = lessons.length
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-gray-100 text-gray-800',
      'bg-gray-200 text-gray-900',
      'bg-black text-white',
      'bg-gray-300 text-gray-900',
      'bg-gray-100 text-black',
      'bg-gray-200 text-gray-800'
    ]
    return colors[tag.length % colors.length]
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-white text-black p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>🕐 {duration}</span>
          <span>📚 {totalLessons} lessons</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
              >
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link
            href={`/course/${id}`}
            className="flex-1 bg-black text-white text-center py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            {progressPercentage === 0 ? 'Start Learning' : 'Continue'}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
        Created {formatDate(created_at)}
      </div>
    </div>
  )
}