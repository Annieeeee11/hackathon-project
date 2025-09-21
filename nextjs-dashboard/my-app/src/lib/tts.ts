import getOpenAI from './openaiClient'

// Type definitions
interface TTSOptions {
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  speed?: number; // 0.25 to 4.0
  format?: 'mp3' | 'opus' | 'aac' | 'flac';
}

interface TTSResult {
  audioBuffer: Buffer;
  format: string;
  duration?: number;
}

/**
 * Convert text to speech using OpenAI TTS
 */
export async function textToSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<TTSResult> {
  try {
    const {
      voice = 'alloy',
      speed = 1.0,
      format = 'mp3'
    } = options;

    const openai = getOpenAI()
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
      speed,
      response_format: format
    });

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    return {
      audioBuffer,
      format,
      // Note: OpenAI TTS doesn't provide duration in response
      // You might need to calculate this separately if needed
    };
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

/**
 * Convert text to speech and return as base64 data URL
 */
export async function textToSpeechDataURL(
  text: string,
  options: TTSOptions = {}
): Promise<string> {
  try {
    const result = await textToSpeech(text, options);
    const base64 = result.audioBuffer.toString('base64');
    return `data:audio/${result.format};base64,${base64}`;
  } catch (error) {
    console.error('Error generating speech data URL:', error);
    throw error;
  }
}

/**
 * Batch convert multiple texts to speech
 */
export async function batchTextToSpeech(
  texts: string[],
  options: TTSOptions = {}
): Promise<TTSResult[]> {
  const results: TTSResult[] = [];

  for (const text of texts) {
    try {
      const result = await textToSpeech(text, options);
      results.push(result);
    } catch (error) {
      console.error('Error in batch TTS:', error);
      // Continue with other texts even if one fails
    }
  }

  return results;
}

/**
 * Validate TTS options
 */
export function validateTTSOptions(options: TTSOptions): TTSOptions {
  const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  const validFormats = ['mp3', 'opus', 'aac', 'flac'];

  return {
    voice: options.voice && validVoices.includes(options.voice) ? options.voice : 'alloy',
    speed: options.speed && options.speed >= 0.25 && options.speed <= 4.0 ? options.speed : 1.0,
    format: options.format && validFormats.includes(options.format) ? options.format : 'mp3'
  };
}
