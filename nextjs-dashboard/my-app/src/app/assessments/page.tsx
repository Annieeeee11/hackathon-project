"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import { 
  IconBook, 
  IconBrain, 
  IconDashboard, 
  IconMessageCircle, 
  IconClock,
  IconTarget,
  IconCheck,
  IconX,
  IconCode,
  IconArrowRight,
  IconLoader
} from "@tabler/icons-react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

interface Assessment {
  id: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeLimit: number;
  instructions: string;
  starter_code?: string;
  test_cases: any[];
  expected_output?: string;
  course_id?: string;
  lesson_id?: string;
  status: "not-started" | "in-progress" | "completed" | "abandoned";
  score?: number;
  submitted_code?: string;
  execution_result?: any;
  time_spent?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('/api/assessments');
        if (!response.ok) {
          throw new Error('Failed to fetch assessments');
        }
        const data = await response.json();
        setAssessments(data.assessments || []);
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter(assessment => {
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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <IconLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading assessments...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-2">
          <IconBrain className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">AI Learning Assistant</h1>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Link href="/chat">
            <Button variant="outline">
              <IconMessageCircle className="w-4 h-4 mr-2" />
              AI Chat
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <IconCode className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Coding
              <span className="text-primary"> Assessments</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Test your skills with hands-on coding challenges and get instant feedback on your solutions.
            </p>
          </div>

          {/* Filter */}
          <div className="flex justify-center mb-8">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
              <div key={assessment.id} className="bg-white dark:bg-white rounded-lg border border-gray-200 dark:border-gray-300 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black dark:text-black mb-2">{assessment.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-600 mb-3">{assessment.description}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(assessment.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Status and Difficulty */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                      {assessment.status.replace("-", " ").toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assessment.difficulty)}`}>
                      {assessment.difficulty}
                    </span>
                  </div>

                  {/* Time Limit */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-600">
                    <IconClock className="w-4 h-4" />
                    <span>{assessment.timeLimit} minutes</span>
                  </div>

                  {/* Score (if completed) */}
                  {assessment.status === "completed" && assessment.score && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-600">Score:</span>
                      <span className="font-semibold text-green-600">{assessment.score}%</span>
                    </div>
                  )}

                  {/* Completed Date */}
                  {assessment.status === "completed" && assessment.completed_at && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Completed {assessment.completed_at}
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
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconTarget className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No assessments found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Try adjusting your filter criteria to find the assessments you're looking for.
              </p>
              <Button size="lg" onClick={() => setFilterStatus("all")}>
                <IconTarget className="w-4 h-4 mr-2" />
                View All Assessments
                <IconArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
    </AppLayout>
  );
}
