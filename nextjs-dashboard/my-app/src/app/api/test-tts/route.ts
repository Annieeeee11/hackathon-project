import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'TTS Test Endpoint - Enhanced with Error Handling',
    status: 'TTS system has been improved with comprehensive error handling',
    improvements: [
      'Better voice initialization with retry logic',
      'Comprehensive error logging and handling',
      'Graceful fallbacks when voices fail to load',
      'Timeout protection for long-running speech',
      'Input validation and text cleaning',
      'Browser compatibility checks'
    ],
    instructions: [
      'The Text-to-Speech system is now integrated into the Avatar3D component',
      'Voice will automatically play when the AI Professor speaks',
      'Use the voice controls in the avatar interface to toggle voice on/off',
      'The system uses the browser\'s built-in Speech Synthesis API',
      'Voice settings can be customized through the avatar controls',
      'Check browser console for detailed TTS logs and error information'
    ],
    features: [
      'Automatic voice synthesis for AI responses',
      'Professor-optimized voice selection with fallbacks',
      'Speaking rate and pitch control with validation',
      'Visual feedback during speech',
      'Synchronized avatar animations',
      'Voice enable/disable toggle',
      'Multiple voice options with error handling',
      'Diagnostic logging for troubleshooting'
    ],
    usage: {
      chat: 'Visit /chat to hear the AI Professor speak during conversations',
      lessons: 'Visit /lesson/[id] to hear spoken lesson content',
      controls: 'Use the voice controls in the top-right of the avatar',
      diagnostic: 'Check browser console for TTS initialization and error logs'
    },
    troubleshooting: {
      'No voices available': 'Wait a few seconds for browser to load voices, or refresh the page',
      'Speech not working': 'Check if browser supports Speech Synthesis API',
      'Error messages': 'Check browser console for detailed error information',
      'Voice quality': 'Different browsers have different voice quality and selection'
    }
  });
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for TTS testing' },
        { status: 400 }
      );
    }

    // This endpoint just validates the text for TTS
    // Actual speech synthesis happens on the client side
    const cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#{1,6}\s/g, '')
      .replace(/&/g, 'and')
      .replace(/@/g, 'at')
      .replace(/#/g, 'hash')
      .replace(/\$/g, 'dollar')
      .replace(/%/g, 'percent')
      .replace(/https?:\/\/[^\s]+/g, 'link')
      .replace(/\s+/g, ' ')
      .trim();

    return NextResponse.json({
      success: true,
      originalText: text,
      cleanedText: cleanedText,
      message: 'Text processed for TTS. Use the frontend avatar to hear it spoken.',
      length: cleanedText.length,
      estimatedDuration: `${Math.ceil(cleanedText.length / 10)} seconds`
    });

  } catch (error) {
    console.error('TTS Test Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to process TTS test'
      },
      { status: 500 }
    );
  }
}
