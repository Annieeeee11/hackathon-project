interface CourseCardProps {
    id: number
    title: string
    progress: number
  }
  
  export default function CourseCard({ id, title, progress }: CourseCardProps) {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="font-bold text-gray-500">{title}</h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{progress}% complete</p>
        <a
          href={`/course/${id}`}
          className="inline-block mt-3 px-3 py-1 text-sm bg-blue-500 text-white rounded"
        >
          Open Course
        </a>
      </div>
    )
  }
  