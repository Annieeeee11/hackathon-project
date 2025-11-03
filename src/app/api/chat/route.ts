import { NextResponse } from "next/server";
import { dbHelpers, supabase } from "@/lib/supabaseClient";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { question, lessonId, courseId, userId } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    try {
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
      
      const answer = await generateAIAnswer(question, lessonId, lessonContent);

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
        }
      }

      return NextResponse.json({ success: true, answer });
    } catch (openaiError) {
      console.error("OpenAI error:", openaiError);
      const fallbackAnswer = `I'm having trouble processing your question right now. Please try rephrasing it or ask about a specific programming concept.`;
      return NextResponse.json({ success: true, answer: fallbackAnswer });
    }
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
async function generateAIAnswer(question: string, lessonId?: string, context?: string) {
  try {
    const systemPrompt = `You are an expert AI Professor and educational assistant. You help students learn by providing clear, detailed, and engaging explanations. 

Your teaching style:
- Break down complex concepts into simple, understandable parts
- Use examples and analogies when helpful
- Encourage further learning and exploration
- Be patient and supportive
- Provide practical, actionable advice

${lessonId ? `You are currently helping with lesson: ${lessonId}` : ''}
${context ? `Additional context: ${context}` : ''}`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from OpenAI");
    }

    return aiResponse;
  } catch (error) {
    console.error("Error generating AI answer:", error);
    
    return `I understand you're asking about "${question}". While I'm having trouble accessing my full knowledge base right now, I'd be happy to help you learn more about this topic. Could you provide a bit more context about what specific aspect you'd like to understand better?`;
  }
}

