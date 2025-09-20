import { NextResponse } from "next/server";
// import { judge0 } from "@/lib/judge0Client";

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 });
    }

    // Mock Judge0 result (replace with Judge0 API call)
    const result = {
      status: "Accepted",
      output: "Hello World",
      feedback: "Good job! Consider optimizing loops.",
    };

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error in submit-assessment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
