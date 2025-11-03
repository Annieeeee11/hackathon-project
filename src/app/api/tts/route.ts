import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for TTS' },
        { status: 400 }
      )
    }

    // Return success - client will handle TTS
    return NextResponse.json({
      success: true,
      message: 'Use client-side TTS manager for speech synthesis'
    })

  } catch (error) {
    console.error('TTS API error:', error)
    return NextResponse.json(
      { error: 'Failed to process TTS request' },
      { status: 500 }
    )
  }
}
