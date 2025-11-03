"use client"
import { IconCheck, IconX, IconLoader2, IconTrophy, IconTarget } from "@tabler/icons-react"

interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  error?: string;
}

interface Result {
  success: boolean;
  feedback: string;
  score: number;
  testResults: TestResult[];
  executionTime: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  testCases: TestCase[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeLimit: number;
  language: string;
}

interface ResultPanelProps {
  result: Result | null;
  isSubmitting?: boolean;
  assessment?: Assessment;
}

export default function ResultPanel({ result, isSubmitting = false, assessment }: ResultPanelProps) {
  if (isSubmitting) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <IconLoader2 className="w-5 h-5 animate-spin text-primary" />
            Running Tests
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <p className="text-foreground font-medium">Evaluating your code...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Running {assessment?.testCases.length || 0} test cases
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="flex flex-col h-full bg-card">
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <IconTarget className="w-5 h-5 text-primary" />
            Test Results
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <IconTarget className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-foreground font-medium">No submission yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Submit your code to see test results
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const passedTests = result.testResults.filter(test => test.passed).length
  const totalTests = result.testResults.length

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            {result.success ? (
              <IconCheck className="w-5 h-5 text-green-500" />
            ) : (
              <IconX className="w-5 h-5 text-red-500" />
            )}
            Test Results
          </h3>
          <div className="flex items-center gap-2">
            <IconTrophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{result.score}%</span>
          </div>
        </div>
      </div>

      {/* Score and Summary */}
      <div className="p-4 border-b">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{passedTests}/{totalTests}</div>
            <div className="text-xs text-muted-foreground">Tests Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{result.executionTime}s</div>
            <div className="text-xs text-muted-foreground">Execution Time</div>
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="p-4 border-b">
        <h4 className="font-medium text-foreground mb-2">AI Feedback</h4>
        <div className={`p-3 rounded-lg ${
          result.success 
            ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800" 
            : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
        }`}>
          <p className={`text-sm ${
            result.success 
              ? "text-green-800 dark:text-green-200" 
              : "text-red-800 dark:text-red-200"
          }`}>
            {result.feedback}
          </p>
        </div>
      </div>

      {/* Test Results */}
      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="font-medium text-foreground mb-3">Test Case Results</h4>
        <div className="space-y-3">
          {result.testResults.map((testResult, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {testResult.passed ? (
                    <IconCheck className="w-4 h-4 text-green-500" />
                  ) : (
                    <IconX className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium">Test Case {index + 1}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  testResult.passed 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}>
                  {testResult.passed ? "PASSED" : "FAILED"}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2">
                {testResult.testCase.description}
              </p>
              
              <div className="space-y-1 text-xs">
                <div>
                  <span className="font-medium">Input:</span> 
                  <code className="ml-1 bg-muted px-1 rounded">{testResult.testCase.input}</code>
                </div>
                <div>
                  <span className="font-medium">Expected:</span> 
                  <code className="ml-1 bg-muted px-1 rounded">{testResult.testCase.expectedOutput}</code>
                </div>
                <div>
                  <span className="font-medium">Actual:</span> 
                  <code className="ml-1 bg-muted px-1 rounded">{testResult.actualOutput}</code>
                </div>
                {testResult.error && (
                  <div>
                    <span className="font-medium text-red-600">Error:</span> 
                    <code className="ml-1 bg-red-50 dark:bg-red-950/20 text-red-600 px-1 rounded">
                      {testResult.error}
                    </code>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
  