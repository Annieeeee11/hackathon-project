import { Sidebar } from "@/components/ui/sidebar";

import CourseCard from "@/components/dashboard/CourseCard"
import ProgressChart from "@/components/dashboard/ProgressChart"
import ActivityFeed from "@/components/dashboard/ActivityFeed"

interface Course {
  id: number
  title: string
  progress: number
}

const mockCourses: Course[] = [
  { id: 1, title: "React.js Fundamentals", progress: 70 },
  { id: 2, title: "Data Structures", progress: 40 },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Dashboard</h2>
      <ProgressChart />

      <div className="grid grid-cols-2 gap-4">
        {mockCourses.map((c) => (
          <CourseCard key={c.id} {...c} />
        ))}
      </div>

      <ActivityFeed />
    </div>
  )
}
