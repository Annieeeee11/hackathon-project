import { IconCheck, IconTrophy, IconBook, IconBrain } from "@tabler/icons-react";

interface Activity {
  id: number;
  type: "completed" | "started" | "achievement" | "generated";
  message: string;
  time: string;
  course?: string;
}

const mockActivity: Activity[] = [
  { 
    id: 1, 
    type: "completed",
    message: "Completed Lesson 3: React Hooks", 
    time: "2h ago",
    course: "React.js Fundamentals"
  },
  { 
    id: 2, 
    type: "started",
    message: "Started new course", 
    time: "1d ago",
    course: "Data Structures & Algorithms"
  },
  { 
    id: 3, 
    type: "achievement",
    message: "Earned 'Quick Learner' badge", 
    time: "2d ago"
  },
  { 
    id: 4, 
    type: "generated",
    message: "Generated new course", 
    time: "3d ago",
    course: "Machine Learning Basics"
  },
  { 
    id: 5, 
    type: "completed",
    message: "Completed Assessment: JavaScript Fundamentals", 
    time: "4d ago",
    course: "JavaScript Mastery"
  }
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "completed":
      return <IconCheck className="w-4 h-4 text-green-500" />;
    case "started":
      return <IconCheck className="w-4 h-4 text-blue-500" />;
    case "achievement":
      return <IconTrophy className="w-4 h-4 text-yellow-500" />;
    case "generated":
      return <IconBrain className="w-4 h-4 text-purple-500" />;
    default:
      return <IconBook className="w-4 h-4 text-gray-500" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "completed":
      return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
    case "started":
      return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
    case "achievement":
      return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
    case "generated":
      return "border-l-purple-500 bg-purple-50 dark:bg-purple-950/20";
    default:
      return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20";
  }
};

export default function ActivityFeed() {
  return (
    <div className="space-y-3">
      {mockActivity.map((activity) => (
        <div
          key={activity.id}
          className={`flex items-start gap-3 p-3 rounded-lg border-l-4 ${getActivityColor(activity.type)}`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              {activity.message}
            </p>
            {activity.course && (
              <p className="text-xs text-muted-foreground mt-1">
                Course: {activity.course}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {activity.time}
            </p>
          </div>
        </div>
      ))}
      
      {mockActivity.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <IconBook className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recent activity</p>
          <p className="text-sm">Start learning to see your progress here!</p>
        </div>
      )}
    </div>
  );
}
  