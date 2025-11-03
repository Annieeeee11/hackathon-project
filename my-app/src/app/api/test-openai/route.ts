import { NextResponse } from 'next/server';
import { openai } from '@/lib/openaiClient';

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond with a brief confirmation that the OpenAI API is working."
        },
        {
          role: "user",
          content: "Test connection"
        }
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    return NextResponse.json({
      success: true,
      message: 'OpenAI API connection successful!',
      response: response || 'No response received',
      model: completion.model,
      usage: completion.usage,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to connect to OpenAI API' 
      },
      { status: 500 }
    );
  }
}
