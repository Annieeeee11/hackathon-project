import { NextResponse } from "next/server";
// import { openai } from "@/lib/openaiClient";

export async function POST(req: Request) {
  try {
    const { question, lessonId } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Mock AI answer (replace with OpenAI call)
    const answer = `Answer to "${question}" for lesson ${lessonId || "N/A"}`;

    return NextResponse.json({ success: true, answer });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
