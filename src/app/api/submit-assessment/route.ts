import { NextResponse } from "next/server";
import { executeCode, gradeSubmission, LANGUAGE_IDS } from "@/lib/judge0Client";

export async function POST(req: Request) {
  try {
    const { code, language, testCases, expectedOutput } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }

    // Get language ID for Judge0
    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) {
      return NextResponse.json({ error: "Unsupported language" }, { status: 400 });
    }

    try {
      // Execute code using Judge0
      const executionResult = await executeCode(code, languageId);
      
      // Grade the submission if expected output is provided
      let gradingResult = null;
      if (expectedOutput) {
        gradingResult = await gradeSubmission(code, expectedOutput, languageId);
      }

      const result = {
        status: executionResult.status.description,
        output: executionResult.stdout,
        error: executionResult.stderr || executionResult.compile_output,
        executionTime: executionResult.time,
        memory: executionResult.memory,
        score: gradingResult?.score || 0,
        feedback: gradingResult?.feedback || "Code executed successfully",
        testResults: testCases ? testCases.map((testCase: { input: string; expectedOutput: string }) => ({
          testCase,
          passed: executionResult.stdout.trim() === testCase.expectedOutput.trim(),
          actualOutput: executionResult.stdout,
          error: executionResult.stderr || executionResult.compile_output
        })) : []
      };

      return NextResponse.json({ success: true, result });
    } catch (judge0Error) {
      console.error("Judge0 execution error:", judge0Error);
      return NextResponse.json({ 
        success: false, 
        error: "Code execution failed",
        result: {
          status: "Error",
          output: "",
          error: "Failed to execute code. Please check your syntax.",
          score: 0,
          feedback: "There was an error executing your code. Please try again."
        }
      });
    }
  } catch (error) {
    console.error("Error in submit-assessment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
