'use client'
import { useState, useEffect } from 'react'

// Seeded random number generator for consistent SSR/client rendering
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

interface ChartDataPoint {
  date: string;
  lessons: number;
  hours: number;
  score: number;
}

interface UserProgress {
  courses?: Array<{ id: string | number; title: string }>;
  completedLessons?: number;
  totalLessons?: number;
  averageScore?: number;
  streak?: number;
}

interface ProgressChartProps {
  userProgress?: UserProgress;
}

export default function ProgressChart({ 
  userProgress = {}
}: ProgressChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedLessons: 0,
    totalLessons: 0,
    averageScore: 0,
    streak: 0
  })

  useEffect(() => {
    // Generate mock data for visualization (week only)
    const generateChartData = (): ChartDataPoint[] => {
      const days = 7 // Only week view
      const data: ChartDataPoint[] = []
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        
        // Use seeded random for consistent SSR/client rendering
        const seed = i + 4 // week length
        data.push({
          date: date.toISOString().split('T')[0],
          lessons: Math.floor(seededRandom(seed) * 5),
          hours: seededRandom(seed + 1) * 3,
          score: 70 + seededRandom(seed + 2) * 30
        })
      }
      
      return data
    }

    setChartData(generateChartData())
    
    // Calculate stats from userProgress
    setStats({
      totalCourses: userProgress.courses?.length || 3,
      completedLessons: userProgress.completedLessons || 24,
      totalLessons: userProgress.totalLessons || 45,
      averageScore: userProgress.averageScore || 87,
      streak: userProgress.streak || 7
    })
  }, [userProgress.courses?.length, userProgress.completedLessons, userProgress.totalLessons, userProgress.averageScore, userProgress.streak])

  const maxLessons = Math.max(...chartData.map(d => d.lessons))

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{stats.totalCourses}</div>
          <div className="text-sm opacity-90">Active Courses</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{stats.completedLessons}</div>
          <div className="text-sm opacity-90">Lessons Done</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{Math.round((stats.completedLessons / stats.totalLessons) * 100)}%</div>
          <div className="text-sm opacity-90">Progress</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{stats.averageScore}%</div>
          <div className="text-sm opacity-90">Avg Score</div>
        </div>
        
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{stats.streak}</div>
          <div className="text-sm opacity-90">Day Streak 🔥</div>
        </div>
      </div>

      {/* Chart Title */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Learning Activity (This Week)</h3>
      </div>

      {/* Simple Bar Chart */}
      <div className="relative">
        <div className="flex items-end justify-between h-48 mb-4">
          {chartData.map((day: ChartDataPoint, index: number) => (
            <div key={index} className="flex flex-col items-center flex-1 mx-1">
              <div
                className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm w-full min-h-[4px] transition-all duration-300 hover:from-blue-600 hover:to-blue-400"
                style={{
                  height: `${(day.lessons / (maxLessons || 1)) * 100}%`
                }}
                title={`${day.lessons} lessons, ${day.hours.toFixed(1)} hours`}
              ></div>
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500">
          {chartData.map((day: ChartDataPoint, index: number) => (
            <span key={index} className="flex-1 text-center">
              {new Date(day.date).toLocaleDateString('en-US', { 
                weekday: 'short'
              })}
            </span>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      {/* <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-gray-800 mb-3">Recent Achievements</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-lg">🏆</span>
            <span className="text-gray-700">Completed React.js Fundamentals</span>
            <span className="text-gray-500">2 days ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-lg">🔥</span>
            <span className="text-gray-700">7-day learning streak!</span>
            <span className="text-gray-500">Today</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-lg">⭐</span>
            <span className="text-gray-700">Perfect score on JavaScript Assessment</span>
            <span className="text-gray-500">3 days ago</span>
          </div>
        </div>
      </div> */}
    </div>
  )
}