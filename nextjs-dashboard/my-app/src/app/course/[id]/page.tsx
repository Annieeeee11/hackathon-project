import { use } from "react";

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <div>
      <h2 className="text-xl font-bold">Course #{id}</h2>
      <p className="text-gray-600">Course outline will be displayed here.</p>
    </div>
  )
}
  