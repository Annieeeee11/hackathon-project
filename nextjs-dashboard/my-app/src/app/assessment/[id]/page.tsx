"use client"

import { useState, useEffect, use } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/assessment/CodeEditor";
import ResultPanel from "@/components/assessment/ResultPanel";
import { 
  IconBook, 
  IconBrain, 
  IconMessageCircle, 
  IconTrophy,
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconTarget,
  IconCode,
  IconBulb,
  IconLoader2
} from "@tabler/icons-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <IconBrain className="w-5 h-5" /> },
  { label: "Generate Course", href: "/", icon: <IconBrain className="w-5 h-5" /> },
  { label: "My Courses", href: "/courses", icon: <IconBook className="w-5 h-5" /> },
  { label: "Assessments", href: "/assessments", icon: <IconBrain className="w-5 h-5" /> },
  { label: "Chat with AI", href: "/chat", icon: <IconMessageCircle className="w-5 h-5" /> },
  { label: "Leaderboard", href: "/leaderboard", icon: <IconTrophy className="w-5 h-5" /> },
];

interface Assessment {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  testCases: TestCase[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeLimit: number; // in minutes
  language: string;
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface Result {
  success: boolean;
  feedback: string;
  score: number;
  testResults: TestResult[];
  executionTime: number;
}

interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  error?: string;
}

interface AssessmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AssessmentPage({ params }: AssessmentPageProps) {
  const { id } = use(params);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Mock assessment data
  useEffect(() => {
    const mockAssessment: Assessment = {
      id: id,
      title: "React Component Challenge",
      description: "Create a reusable React component that displays a list of items with search functionality.",
      instructions: [
        "Create a functional React component called 'SearchableList'",
        "The component should accept an array of items as props",
        "Implement a search input that filters the items",
        "Display the filtered results in a clean, accessible way",
        "Handle edge cases like empty arrays and no search results"
      ],
      starterCode: `import React, { useState } from 'react';

function SearchableList({ items }) {
  // Your code here
  return (
    <div>
      {/* Implement your component here */}
    </div>
  );
}

export default SearchableList;`,
      testCases: [
        {
          input: "items: ['apple', 'banana', 'cherry'], search: 'a'",
          expectedOutput: "['apple', 'banana']",
          description: "Should filter items containing the search term"
        },
        {
          input: "items: [], search: 'test'",
          expectedOutput: "[]",
          description: "Should handle empty array gracefully"
        },
        {
          input: "items: ['hello', 'world'], search: 'xyz'",
          expectedOutput: "[]",
          description: "Should return empty array when no matches found"
        }
      ],
      difficulty: "Intermediate",
      timeLimit: 30,
      language: "javascript"
    };
    
    setAssessment(mockAssessment);
    setTimeRemaining(mockAssessment.timeLimit * 60); // Convert to seconds
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isCompleted) {
      // Auto-submit when time runs out
      handleSubmit(assessment?.starterCode || "");
    }
  }, [timeRemaining, isCompleted, assessment]);

  const handleSubmit = async (code: string) => {
    if (isSubmitting || isCompleted) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call to Judge0
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: Result = {
        success: true,
        feedback: "Great work! Your component handles all the test cases correctly. Consider adding accessibility features like ARIA labels for better user experience.",
        score: 85,
        testResults: assessment?.testCases.map((testCase, index) => ({
          testCase,
          passed: index < 2, // Mock: first 2 tests pass
          actualOutput: index < 2 ? testCase.expectedOutput : "Error: Component not found",
          error: index >= 2 ? "Component 'SearchableList' is not defined" : undefined
        })) || [],
        executionTime: 1.2
      };
      
      setResult(mockResult);
      setIsCompleted(true);
    } catch (error) {
      setResult({
        success: false,
        feedback: "There was an error running your code. Please check for syntax errors and try again.",
        score: 0,
        testResults: [],
        executionTime: 0
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!assessment) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assessment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar>
        <SidebarBody className="flex flex-col gap-2 p-4">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.href} link={link} />
          ))}
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{assessment.title}</h1>
              <p className="text-muted-foreground">
                {assessment.difficulty} • {assessment.language} • {assessment.timeLimit} min
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isCompleted && (
              <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg">
                <IconClock className="w-4 h-4 text-muted-foreground" />
                <span className={`font-mono text-sm ${
                  timeRemaining < 300 ? 'text-red-500' : 'text-foreground'
                }`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            <ModeToggle />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Instructions */}
          <div className="w-1/3 border-r bg-card overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <IconTarget className="w-5 h-5 text-primary" />
                  Challenge Description
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {assessment.description}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <IconBulb className="w-4 h-4 text-primary" />
                  Instructions
                </h3>
                <ol className="space-y-2">
                  {assessment.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <IconCode className="w-4 h-4 text-primary" />
                  Test Cases
                </h3>
                <div className="space-y-3">
                  {assessment.testCases.map((testCase, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Test Case {index + 1}</p>
                      <p className="text-xs text-muted-foreground mb-2">{testCase.description}</p>
                      <div className="text-xs">
                        <p><strong>Input:</strong> {testCase.input}</p>
                        <p><strong>Expected:</strong> {testCase.expectedOutput}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor and Results */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1">
                <CodeEditor 
                  onSubmit={handleSubmit}
                  starterCode={assessment.starterCode}
                  language={assessment.language}
                  isSubmitting={isSubmitting}
                  isCompleted={isCompleted}
                />
              </div>
              <div className="w-1/2 border-l">
                <ResultPanel 
                  result={result}
                  isSubmitting={isSubmitting}
                  assessment={assessment}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
