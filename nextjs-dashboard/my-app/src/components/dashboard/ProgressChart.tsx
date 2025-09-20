import { IconTrendingUp, IconCalendar, IconTarget } from "@tabler/icons-react";

export default function ProgressChart() {
  // Mock data for the chart
  const weeklyData = [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 1 },
    { day: "Thu", hours: 4 },
    { day: "Fri", hours: 2 },
    { day: "Sat", hours: 3 },
    { day: "Sun", hours: 1 }
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconTarget className="w-5 h-5 text-primary" />
          <span className="font-medium">Overall Progress</span>
        </div>
        <span className="text-2xl font-bold text-primary">60%</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-3">
        <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: "60%" }} />
      </div>

      {/* Weekly Activity Chart */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IconCalendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">This Week's Activity</span>
        </div>
        
        <div className="flex items-end justify-between h-24 gap-1">
          {weeklyData.map((data, index) => (
            <div key={index} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                style={{ 
                  height: `${(data.hours / maxHours) * 60}px`,
                  minHeight: data.hours > 0 ? "8px" : "0px"
                }}
                title={`${data.hours} hours on ${data.day}`}
              />
              <span className="text-xs text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Total: {weeklyData.reduce((sum, d) => sum + d.hours, 0)} hours</span>
          <span>Avg: {(weeklyData.reduce((sum, d) => sum + d.hours, 0) / 7).toFixed(1)} hours/day</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <IconTrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <p className="text-lg font-bold text-green-500">7 days</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <IconTarget className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Goal</span>
          </div>
          <p className="text-lg font-bold text-blue-500">2h/day</p>
        </div>
      </div>
    </div>
  );
}
  