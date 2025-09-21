import { NextRequest, NextResponse } from 'next/server'
import { textToSpeech } from '@/lib/tts'

export async function POST(request: NextRequest) {
  try {
    const { text, voice = 'alloy', speed = 1.0, format = 'mp3' } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for TTS' },
        { status: 400 }
      )
    }

    // Generate speech using OpenAI TTS
    const ttsResult = await textToSpeech(text, {
      voice: voice as any,
      speed: speed,
      format: format as any
    })

    // Return the audio buffer as a response
    return new NextResponse(ttsResult.audioBuffer as any, {
      headers: {
        'Content-Type': `audio/${format}`,
        'Content-Length': ttsResult.audioBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('TTS API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    )
  }
}
