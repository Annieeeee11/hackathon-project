"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/UserMenu";
import CourseCard from "@/components/dashboard/CourseCard";
import ProgressChart from "@/components/dashboard/ProgressChart";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import {
  IconBook,
  IconBrain,
  IconDashboard,
  IconMessageCircle,
  IconTrendingUp,
  IconClock,
  IconTarget,
  IconAward,
} from "@tabler/icons-react";
import QuickActions from "@/components/dashboard/quickActions";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  lessons: Array<{ id: number; title: string; completed: boolean }>;
  tags: string[];
  created_at: string;
}

interface Stats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  currentStreak: number;
  averageScore: number;
}

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconDashboard className="w-5 h-5" />,
  },
  {
    label: "Generate Course",
    href: "/gen-course",
    icon: <IconBrain className="w-5 h-5" />,
  },
  {
    label: "My Courses",
    href: "/courses",
    icon: <IconBook className="w-5 h-5" />,
  },
  {
    label: "Assessments",
    href: "/assessments",
    icon: <IconDashboard className="w-5 h-5" />,
  },
  {
    label: "Chat with AI",
    href: "/chat",
    icon: <IconMessageCircle className="w-5 h-5" />,
  },
];

const mockCourses: Course[] = [
  {
    id: 1,
    title: "React.js Fundamentals",
    description: "Master the basics of React including components, props, state, and hooks",
    duration: "4 weeks",
    lessons: [
      { id: 1, title: "Introduction to React", completed: true },
      { id: 2, title: "Components and JSX", completed: true },
      { id: 3, title: "Props and State", completed: true },
      { id: 4, title: "Event Handling", completed: true },
      { id: 5, title: "Lifecycle Methods", completed: true },
      { id: 6, title: "Hooks", completed: true },
      { id: 7, title: "Context API", completed: true },
      { id: 8, title: "Routing", completed: false },
      { id: 9, title: "State Management", completed: false },
      { id: 10, title: "Testing", completed: false },
    ],
    tags: ["react", "javascript", "frontend"],
    created_at: "2024-01-15",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    description: "Learn fundamental data structures and algorithms for efficient programming",
    duration: "6 weeks",
    lessons: [
      { id: 1, title: "Arrays and Lists", completed: true },
      { id: 2, title: "Stacks and Queues", completed: true },
      { id: 3, title: "Linked Lists", completed: true },
      { id: 4, title: "Trees", completed: true },
      { id: 5, title: "Graphs", completed: false },
      { id: 6, title: "Sorting Algorithms", completed: false },
      { id: 7, title: "Searching Algorithms", completed: false },
      { id: 8, title: "Dynamic Programming", completed: false },
      { id: 9, title: "Greedy Algorithms", completed: false },
      { id: 10, title: "Complexity Analysis", completed: false },
      { id: 11, title: "Hash Tables", completed: false },
      { id: 12, title: "Advanced Topics", completed: false },
    ],
    tags: ["algorithms", "data-structures", "programming"],
    created_at: "2024-01-10",
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning concepts and practical applications",
    duration: "3 weeks",
    lessons: [
      { id: 1, title: "Introduction to ML", completed: true },
      { id: 2, title: "Data Preprocessing", completed: true },
      { id: 3, title: "Linear Regression", completed: true },
      { id: 4, title: "Logistic Regression", completed: true },
      { id: 5, title: "Decision Trees", completed: true },
      { id: 6, title: "Random Forest", completed: true },
      { id: 7, title: "Clustering", completed: true },
      { id: 8, title: "Neural Networks", completed: true },
      { id: 9, title: "Model Evaluation", completed: true },
      { id: 10, title: "Deployment", completed: false },
    ],
    tags: ["machine-learning", "python", "ai"],
    created_at: "2024-01-05",
  },
];

const mockStats: Stats = {
  totalCourses: 3,
  completedCourses: 1,
  totalHours: 24,
  currentStreak: 7,
  averageScore: 85,
};

export default function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar>
        <SidebarBody className="flex flex-col gap-2 p-4">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.href} link={link} />
          ))}
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        <header className="flex justify-between items-center p-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track your learning progress and achievements
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserMenu />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-2xl font-bold">{mockStats.totalCourses}</p>
                </div>
                <IconBook className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">
                    {mockStats.completedCourses}
                  </p>
                </div>
                <IconAward className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Study Hours</p>
                  <p className="text-2xl font-bold">{mockStats.totalHours}h</p>
                </div>
                <IconClock className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">
                    {mockStats.currentStreak} days
                  </p>
                </div>
                <IconTrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Learning Progress</h2>
              <div className="flex gap-2">
                {["week"].map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={
                      selectedTimeframe === timeframe ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <ProgressChart />
          </div>

          {/* My Courses */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <a href="/">
                <Button>
                  <IconBrain className="w-4 h-4 mr-2" />
                  Generate New Course
                </Button>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <ActivityFeed />
            </div>

            <QuickActions/>
          </div>
        </div>
      </main>
    </div>
  );
}
