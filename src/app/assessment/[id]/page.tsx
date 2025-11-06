"use client"

import { useState, useEffect, useCallback, use } from "react";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/assessment/CodeEditor";
import ResultPanel from "@/components/assessment/ResultPanel";
import { 
  IconArrowLeft,
  IconClock,
  IconBrain,
  IconRocket,
  IconTarget,
  IconBulb,
  IconCode
} from "@tabler/icons-react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/common/Card";
import { PageHeader } from "@/components/common/PageHeader";
import { DifficultyBadge } from "@/components/common/DifficultyBadge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ModeToggle } from "@/components/modeToggle";


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
    setTimeRemaining(mockAssessment.timeLimit * 60);
  }, [id]);

  const handleSubmit = useCallback(async (code: string) => {
    if (isSubmitting || isCompleted || !assessment) return;
    
    setIsSubmitting(true);
    
    try {
      // Call real Judge0 API
      const response = await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: assessment.language,
          testCases: assessment.testCases,
          expectedOutput: assessment.testCases[0]?.expectedOutput
        }),
      });

      const data = await response.json();

      if (data.success) {
        const result: Result = {
          success: true,
          feedback: data.result.feedback,
          score: data.result.score,
          testResults: data.result.testResults || assessment.testCases.map((testCase) => ({
            testCase,
            passed: data.result.output?.trim() === testCase.expectedOutput.trim(),
            actualOutput: data.result.output || '',
            error: data.result.error
          })),
          executionTime: parseFloat(data.result.executionTime) || 0
        };
        
        setResult(result);
        setIsCompleted(true);
      } else {
        setResult({
          success: false,
          feedback: data.result?.feedback || "There was an error running your code. Please check for syntax errors and try again.",
          score: 0,
          testResults: [],
          executionTime: 0
        });
      }
    } catch (error) {
      console.error('Assessment submission error:', error);
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
  }, [isSubmitting, isCompleted, assessment]);

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
  }, [timeRemaining, isCompleted, assessment, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!assessment) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <LoadingSpinner text="Loading assessment..." />
      </div>
    );
  }

  return (
    <AppLayout>
    <div className="min-h-screen bg-background">

      <header className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-4">
          <Link href="/assessments">
            <Button variant="outline" size="sm">
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Assessments
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <IconBrain className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">AI Learning Assistant</h1>
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

      <section className="py-8 px-6 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <IconRocket className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{assessment.title}</h1>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <DifficultyBadge difficulty={assessment.difficulty as any} />
              <span>•</span>
              <span>{assessment.language}</span>
              <span>•</span>
              <span>{assessment.timeLimit} min</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="flex-1 flex overflow-hidden">

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
      </div>
    </div>
    </AppLayout>
  );
}
