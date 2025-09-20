import Avatar3D from "@/components/lessons/Avatar3D"
import ChatBox from "@/components/lessons/ChatBox"

export default function LessonPage({ params }: { params: { id: string } }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold mb-2">Lesson #{params.id}</h2>
        <Avatar3D />
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <ChatBox lessonId={params.id} />
      </div>
    </div>
  )
}
