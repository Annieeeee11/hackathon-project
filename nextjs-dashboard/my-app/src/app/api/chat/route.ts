import { NextResponse } from "next/server";
import { answerDoubt } from "@/lib/openaiClient";
import { dbHelpers, supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { question, lessonId, courseId, userId } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    try {
      // Get lesson content for context from database
      let lessonContent = "General programming concepts.";
      
      if (lessonId && lessonId !== 'general') {
        try {
          const { data: lessonData, error: lessonError } = await supabase
            .from('lessons')
            .select('title, content, objectives')
            .eq('id', lessonId)
            .single();

          if (!lessonError && lessonData) {
            lessonContent = `Lesson: ${lessonData.title}\nContent: ${lessonData.content}\nObjectives: ${lessonData.objectives?.join(', ') || 'N/A'}`;
          }
        } catch (dbError) {
          console.error("Error fetching lesson:", dbError);
        }
      }
      
      // Generate AI response using OpenAI
      const answer = await answerDoubt(question, lessonContent);

      // Save chat interaction to database if user is authenticated
      if (userId && userId !== 'demo-user') {
        try {
          await dbHelpers.saveChatInteraction(
            userId,
            courseId || 'general',
            lessonId || 'general',
            question,
            answer
          );
        } catch (dbError) {
          console.error("Error saving chat interaction:", dbError);
          // Continue even if saving fails
        }
      }

      return NextResponse.json({ success: true, answer });
    } catch (openaiError) {
      console.error("OpenAI error:", openaiError);
      // Fallback response if OpenAI fails
      const fallbackAnswer = `I'm having trouble processing your question right now. Please try rephrasing it or ask about a specific programming concept.`;
      return NextResponse.json({ success: true, answer: fallbackAnswer });
    }
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
