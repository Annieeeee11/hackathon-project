import OpenAI from 'openai'
import { env } from './env'

// Only initialize OpenAI on the server side
let openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (typeof window === 'undefined') {
    // Server side - safe to initialize
    if (!openai) {
      openai = new OpenAI({
        apiKey: env.openaiApiKey,
      })
    }
    return openai as OpenAI
  } else {
    // Client side - throw error to prevent API key exposure
    throw new Error('OpenAI client should only be used on the server side. Use API routes instead.')
  }
}

export default getOpenAI

// Type definitions
interface Lesson {
  id: number;
  title: string;
  content: string;
  duration: string;
  objectives: string[];
}

interface Assessment {
  id: number;
  title: string;
  type: 'project' | 'quiz' | 'code';
  description: string;
  requirements: string[];
}

interface GeneratedCourse {
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  assessments: Assessment[];
}

// Helper function to generate course content
export async function generateCourse(tags: string[]): Promise<GeneratedCourse> {
  try {
    const openaiClient = getOpenAI()
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert curriculum designer. Create a structured course outline based on the provided skill tags. Include lessons, assessments, and learning objectives."
        },
        {
          role: "user",
          content: `Create a comprehensive course outline for these skill tags: ${tags.join(', ')}. 
          
          Format the response as JSON with this structure:
          {
            "title": "Course Title",
            "description": "Course Description",
            "duration": "Estimated duration",
            "lessons": [
              {
                "id": 1,
                "title": "Lesson Title",
                "content": "Lesson content with code examples",
                "duration": "30 minutes",
                "objectives": ["Learning objective 1", "Learning objective 2"]
              }
            ],
            "assessments": [
              {
                "id": 1,
                "title": "Assessment Title",
                "type": "project|quiz|code",
                "description": "Assessment description",
                "requirements": ["Requirement 1", "Requirement 2"]
              }
            ]
          }`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }
    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating course:', error)
    throw error
  }
}

// Helper function to answer student doubts
export async function answerDoubt(question: string, lessonContent: string): Promise<string> {
  try {
    const openaiClient = getOpenAI()
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI professor with a friendly, encouraging personality. You help students learn programming and computer science concepts. 

Your teaching style:
- Be clear and concise
- Provide practical examples and code snippets when relevant
- Break down complex concepts into simpler parts
- Encourage questions and learning
- Use analogies to explain difficult concepts
- Always be supportive and patient

When providing code examples, use proper syntax highlighting and explain what each part does.`
        },
        {
          role: "user",
          content: `Lesson Context: ${lessonContent}
          
          Student Question: ${question}
          
          Please provide a clear, helpful answer. If the question is about programming, include relevant code examples with explanations. Make your response conversational and encouraging.`
        }
      ],
      temperature: 0.4,
      max_tokens: 1200
    })

    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('Error answering doubt:', error)
    throw error
  }
}

// Helper function to generate embeddings for semantic search
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const openaiClient = getOpenAI()
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw error
  }
}