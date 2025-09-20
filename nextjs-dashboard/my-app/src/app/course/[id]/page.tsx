export default function CoursePage({ params }: { params: { id: string } }) {
    return (
      <div>
        <h2 className="text-xl font-bold">Course #{params.id}</h2>
        <p className="text-gray-600">Course outline will be displayed here.</p>
      </div>
    )
  }
  