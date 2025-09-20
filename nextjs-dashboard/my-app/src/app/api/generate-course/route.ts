import { NextResponse } from "next/server";
// import { openai } from "@/lib/openaiClient";
// import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { tags } = await req.json();

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json({ error: "Tags are required" }, { status: 400 });
    }

    // Example mock response (replace with OpenAI + Supabase logic)
    const course = {
      id: "course_123",
      title: `Course on ${tags.join(", ")}`,
      lessons: [
        { id: "lesson_1", title: "Introduction", content: "Generated content here..." },
      ],
    };

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Error in generate-course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
