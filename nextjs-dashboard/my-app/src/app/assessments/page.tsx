"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { 
  IconBook, 
  IconBrain, 
  IconDashboard, 
  IconMessageCircle, 
  IconTrophy,
  IconClock,
  IconTarget,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <IconDashboard className="w-5 h-5" /> },
  { label: "Generate Course", href: "/", icon: <IconBrain className="w-5 h-5" /> },
  { label: "My Courses", href: "/courses", icon: <IconBook className="w-5 h-5" /> },
  { label: "Assessments", href: "/assessments", icon: <IconBook className="w-5 h-5" /> },
  { label: "Chat with AI", href: "/chat", icon: <IconMessageCircle className="w-5 h-5" /> },
  { label: "Leaderboard", href: "/leaderboard", icon: <IconTrophy className="w-5 h-5" /> },
];

interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeLimit: number;
  status: "not-started" | "in-progress" | "completed";
  score?: number;
  completedAt?: string;
}

const mockAssessments: Assessment[] = [
  {
    id: "1",
    title: "React Component Challenge",
    description: "Create a reusable React component with search functionality",
    difficulty: "Intermediate",
    timeLimit: 30,
    status: "completed",
    score: 85,
    completedAt: "2 days ago"
  },
  {
    id: "2",
    title: "JavaScript Fundamentals Quiz",
    description: "Test your knowledge of JavaScript basics and ES6 features",
    difficulty: "Beginner",
    timeLimit: 20,
    status: "completed",
    score: 92,
    completedAt: "1 week ago"
  },
  {
    id: "3",
    title: "Data Structures Implementation",
    description: "Implement common data structures like linked lists and trees",
    difficulty: "Advanced",
    timeLimit: 45,
    status: "in-progress"
  },
  {
    id: "4",
    title: "CSS Layout Mastery",
    description: "Create responsive layouts using Flexbox and Grid",
    difficulty: "Intermediate",
    timeLimit: 25,
    status: "not-started"
  }
];

export default function AssessmentsPage() {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredAssessments = mockAssessments.filter(assessment => {
    if (filterStatus === "all") return true;
    return assessment.status === filterStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <IconCheck className="w-4 h-4 text-green-500" />;
      case "in-progress":
        return <IconClock className="w-4 h-4 text-blue-500" />;
      default:
        return <IconTarget className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

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
            <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
            <p className="text-muted-foreground mt-1">Test your skills with hands-on coding challenges</p>
          </div>
          <ModeToggle />
        </header>

        <div className="p-6 space-y-6">
          {/* Filter */}
          <div className="flex gap-4 items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Assessments</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Assessments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => (
              <div key={assessment.id} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{assessment.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{assessment.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(assessment.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Status and Difficulty */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                      {assessment.status.replace("-", " ").toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty}
                    </span>
                  </div>

                  {/* Time Limit */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconClock className="w-4 h-4" />
                    <span>{assessment.timeLimit} minutes</span>
                  </div>

                  {/* Score (if completed) */}
                  {assessment.status === "completed" && assessment.score && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className="font-semibold text-green-600">{assessment.score}%</span>
                    </div>
                  )}

                  {/* Completed Date */}
                  {assessment.status === "completed" && assessment.completedAt && (
                    <div className="text-xs text-muted-foreground">
                      Completed {assessment.completedAt}
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className="w-full mt-4" 
                    size="sm"
                    onClick={() => window.location.href = `/assessment/${assessment.id}`}
                  >
                    {assessment.status === "completed" ? (
                      <>
                        <IconCheck className="w-4 h-4 mr-2" />
                        View Results
                      </>
                    ) : assessment.status === "in-progress" ? (
                      <>
                      {/* play */}
                        <IconX className="w-4 h-4 mr-2" />
                        Continue
                      </>
                    ) : (
                      <>
                        <IconTarget className="w-4 h-4 mr-2" />
                        Start Assessment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredAssessments.length === 0 && (
            <div className="text-center py-12">
              <IconTarget className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No assessments found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
