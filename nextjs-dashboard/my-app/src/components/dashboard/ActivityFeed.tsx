interface Activity {
    id: number
    message: string
    time: string
  }
  
  const mockActivity: Activity[] = [
    { id: 1, message: "Completed Lesson 1 in React.js", time: "2h ago" },
    { id: 2, message: "Started Course: Data Structures", time: "1d ago" },
  ]
  
  export default function ActivityFeed() {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="font-bold mb-2">Recent Activity</h3>
        <ul className="space-y-2">
          {mockActivity.map((a) => (
            <li key={a.id} className="text-sm text-gray-700">
              <span className="font-medium">{a.message}</span>
              <span className="ml-2 text-gray-500">({a.time})</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  