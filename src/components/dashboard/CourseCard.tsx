'use client'
import Link from 'next/link'
import { Course } from '@/lib/types'
import { ProgressBar } from '@/components/common/ProgressBar'
import { TAG_COLORS, ROUTES } from '@/lib/constants'

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}/${day}/${year}`
}

interface CourseCardProps {
  course: Course;
  progress?: number;
}

export default function CourseCard({ course }: CourseCardProps) {
  const {
    id,
    title,
    description,
    duration,
    lessons = [],
    tags = [],
    created_at
  } = course

  const completedLessons = lessons.filter(lesson => lesson.completed).length
  const totalLessons = lessons.length

  const getTagColor = (tag: string) => {
    return TAG_COLORS[tag.length % TAG_COLORS.length]
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="bg-white text-black p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>🕐 {duration}</span>
          <span>📚 {totalLessons} lessons</span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

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

        <ProgressBar 
          current={completedLessons} 
          total={totalLessons} 
          showPercentage={true}
          className="mb-4"
        />

        <div className="flex space-x-2">
          <Link
            href={ROUTES.course(id as string)}
            className="flex-1 bg-black text-white text-center py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            {completedLessons === 0 ? 'Start Learning' : 'Continue'}
          </Link>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
        Created {formatDate(created_at)}
      </div>
    </div>
  )
}