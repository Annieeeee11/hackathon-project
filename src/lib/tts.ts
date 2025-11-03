// Text-to-Speech Library for AI Professor
export interface TTSOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

export interface TTSVoice {
  name: string;
  lang: string;
  gender: 'male' | 'female' | 'neutral';
  isDefault?: boolean;
}

export class TTSManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isInitialized = false;
  private hasUserInteracted = false;
  private onSpeakingChange?: (isSpeaking: boolean) => void;
  private onWordBoundary?: (word: string, charIndex: number) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      this.initializeVoices();
      this.setupUserInteractionListener();
    }
  }

  private setupUserInteractionListener(): void {
    // Listen for first user interaction to enable TTS
    const enableTTS = () => {
      this.hasUserInteracted = true;
      console.log('User interaction detected - TTS enabled');
      
      // Remove listeners after first interaction
      document.removeEventListener('click', enableTTS);
      document.removeEventListener('keydown', enableTTS);
      document.removeEventListener('touchstart', enableTTS);
    };

    document.addEventListener('click', enableTTS, { once: true });
    document.addEventListener('keydown', enableTTS, { once: true });
    document.addEventListener('touchstart', enableTTS, { once: true });
  }

  private async initializeVoices(): Promise<void> {
    if (!this.synth) {
      console.warn('Speech synthesis not available');
      return;
    }

    // Wait for voices to load
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      const loadVoices = () => {
        attempts++;
        this.voices = this.synth!.getVoices();
        
        if (this.voices.length > 0) {
          this.isInitialized = true;
          console.log(`TTS initialized with ${this.voices.length} voices`);
          resolve();
        } else if (attempts < maxAttempts) {
          // Some browsers need time to load voices
          setTimeout(loadVoices, 100);
        } else {
          console.warn('TTS voices failed to load after maximum attempts');
          this.isInitialized = true; // Mark as initialized to prevent infinite loops
          resolve();
        }
      };

      // Set up voice change listener
      if (this.synth && this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = loadVoices;
      }
      
      // Start loading immediately
      loadVoices();
    });
  }

  public async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeVoices();
    }
  }

  public getAvailableVoices(): TTSVoice[] {
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      gender: this.inferGender(voice.name),
      isDefault: voice.default
    }));
  }

  private inferGender(voiceName: string): 'male' | 'female' | 'neutral' {
    const name = voiceName.toLowerCase();
    if (name.includes('female') || name.includes('woman') || name.includes('girl')) {
      return 'female';
    }
    if (name.includes('male') || name.includes('man') || name.includes('boy')) {
      return 'male';
    }
    // Common female voice names
    if (name.includes('samantha') || name.includes('susan') || name.includes('victoria') || 
        name.includes('karen') || name.includes('moira') || name.includes('tessa')) {
      return 'female';
    }
    // Common male voice names
    if (name.includes('alex') || name.includes('daniel') || name.includes('tom') || 
        name.includes('fred') || name.includes('ralph')) {
      return 'male';
    }
    return 'neutral';
  }

  public getProfessorVoice(): SpeechSynthesisVoice | null {
    if (!this.voices.length) return null;

    // Prefer English voices that sound professional
    const preferredVoices = [
      'Google UK English Male',
      'Microsoft David - English (United States)',
      'Alex',
      'Daniel',
      'Google US English',
      'Microsoft Mark - English (United States)'
    ];

    for (const preferred of preferredVoices) {
      const voice = this.voices.find(v => v.name === preferred);
      if (voice) return voice;
    }

    // Fallback to any English male voice
    const englishMaleVoice = this.voices.find(v => 
      v.lang.startsWith('en') && this.inferGender(v.name) === 'male'
    );
    if (englishMaleVoice) return englishMaleVoice;

    // Fallback to any English voice
    const englishVoice = this.voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) return englishVoice;

    // Last resort: first available voice
    return this.voices[0] || null;
  }

  public async speak(
    text: string, 
    options: TTSOptions = {},
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: SpeechSynthesisErrorEvent) => void;
      onPause?: () => void;
      onResume?: () => void;
      onBoundary?: (event: SpeechSynthesisEvent) => void;
    }
  ): Promise<void> {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser');
      return Promise.resolve();
    }

    // Check for user interaction requirement
    if (!this.hasUserInteracted) {
      console.warn('TTS requires user interaction first. Please click anywhere on the page to enable voice.');
      return Promise.resolve();
    }

    // Ensure we have voices loaded
    await this.ensureInitialized();

    // Check if we have any voices available
    if (this.voices.length === 0) {
      console.warn('No voices available for speech synthesis');
      return Promise.resolve();
    }

    // Validate text
    if (!text || text.trim().length === 0) {
      console.warn('No text provided for speech synthesis');
      return Promise.resolve();
    }

    // Check if speech synthesis is already speaking
    if (this.synth.speaking) {
      console.warn('Speech synthesis is already speaking, stopping current speech');
      this.synth.cancel();
    }

    // Stop any current speech
    this.stop();

    try {
      const utterance = new SpeechSynthesisUtterance(text.trim());
      
      // Set voice with fallback
      const voice = this.getProfessorVoice();
      if (voice) {
        utterance.voice = voice;
        console.log(`Using voice: ${voice.name} (${voice.lang})`);
      } else {
        console.warn('No suitable professor voice found, using default');
      }

      // Set options with validation
      utterance.rate = Math.max(0.1, Math.min(10, options.rate ?? 0.9));
      utterance.pitch = Math.max(0, Math.min(2, options.pitch ?? 1.0));
      utterance.volume = Math.max(0, Math.min(1, options.volume ?? 0.8));
      utterance.lang = options.lang ?? 'en-US';

      // Set up event listeners with error handling
      utterance.onstart = () => {
        console.log('Speech started');
        this.onSpeakingChange?.(true);
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        console.log('Speech ended');
        this.onSpeakingChange?.(false);
        this.currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (event) => {
        this.handleTTSError(event);
        callbacks?.onError?.(event);
      };

      utterance.onpause = () => {
        console.log('Speech paused');
        callbacks?.onPause?.();
      };

      utterance.onresume = () => {
        console.log('Speech resumed');
        callbacks?.onResume?.();
      };

      utterance.onboundary = (event) => {
        if (event.name === 'word' && event.charIndex !== undefined) {
          const word = text.substring(event.charIndex, event.charIndex + (event.charLength || 1));
          this.onWordBoundary?.(word, event.charIndex);
        }
        callbacks?.onBoundary?.(event);
      };

      this.currentUtterance = utterance;
      
      // Speak with additional error handling
      try {
        this.synth.speak(utterance);
        console.log('Speech synthesis started');
      } catch (speakError) {
        console.error('Error calling speak():', speakError);
        this.onSpeakingChange?.(false);
        this.currentUtterance = null;
        return Promise.reject(speakError);
      }

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.warn('Speech synthesis timeout');
          this.stop();
          reject(new Error('Speech synthesis timeout'));
        }, 30000); // 30 second timeout

        utterance.onend = () => {
          clearTimeout(timeout);
          this.onSpeakingChange?.(false);
          this.currentUtterance = null;
          callbacks?.onEnd?.();
          resolve();
        };
        
        utterance.onerror = (event) => {
          clearTimeout(timeout);
          this.handleTTSError(event);
          callbacks?.onError?.(event);
          // Don't reject on error, just resolve to prevent unhandled rejections
          resolve();
        };
      });

    } catch (error) {
      console.error('Error setting up speech synthesis:', error);
      this.onSpeakingChange?.(false);
      this.currentUtterance = null;
      return Promise.resolve(); // Don't reject to prevent unhandled errors
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
      this.onSpeakingChange?.(false);
    }
  }

  public pause(): void {
    if (this.synth && this.currentUtterance) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.currentUtterance) {
      this.synth.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }

  public isPaused(): boolean {
    return this.synth?.paused ?? false;
  }

  public onSpeakingStateChange(callback: (isSpeaking: boolean) => void): void {
    this.onSpeakingChange = callback;
  }

  public onWordSpoken(callback: (word: string, charIndex: number) => void): void {
    this.onWordBoundary = callback;
  }

  // Check if user has interacted and TTS is available
  public isReady(): boolean {
    return !!(this.synth && this.hasUserInteracted && this.isInitialized);
  }

  // Get interaction status
  public hasUserInteraction(): boolean {
    return this.hasUserInteracted;
  }

  // Manually enable TTS (useful for explicit user actions)
  public enableTTS(): void {
    this.hasUserInteracted = true;
    console.log('TTS manually enabled');
  }

  // Test TTS with a simple phrase
  public async testTTS(): Promise<boolean> {
    try {
      if (!this.isReady()) {
        console.warn('TTS not ready for testing');
        return false;
      }

      await this.speak('Test', { volume: 0.1 }); // Very quiet test
      return true;
    } catch (error) {
      console.error('TTS test failed:', error);
      return false;
    }
  }

  // Handle common TTS errors gracefully
  private handleTTSError(error: SpeechSynthesisErrorEvent): void {
    console.warn('TTS Error handled:', error);
    
    // Reset TTS state on error
    this.onSpeakingChange?.(false);
    this.currentUtterance = null;
    
    // Try to reinitialize voices if needed
    if (this.voices.length === 0) {
      console.log('Attempting to reload voices after error');
      this.initializeVoices();
    }
  }

  // Utility method to clean text for better speech
  public cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/#{1,6}\s/g, '')
      // Replace common symbols with words
      .replace(/&/g, 'and')
      .replace(/@/g, 'at')
      .replace(/#/g, 'hash')
      .replace(/\$/g, 'dollar')
      .replace(/%/g, 'percent')
      // Remove URLs
      .replace(/https?:\/\/[^\s]+/g, 'link')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Method to speak with professor-like pauses and emphasis
  public async speakAsProfessor(text: string): Promise<void> {
    try {
      if (!text || text.trim().length === 0) {
        console.warn('No text provided to speakAsProfessor');
        return Promise.resolve();
      }

      // Check if TTS is ready
      if (!this.isReady()) {
        console.warn('TTS not ready for speakAsProfessor');
        return Promise.resolve();
      }

      const cleanText = this.cleanTextForSpeech(text);
      
      if (cleanText.length === 0) {
        console.warn('Text became empty after cleaning');
        return Promise.resolve();
      }

      // Add natural pauses for better teaching flow
      const enhancedText = cleanText
        .replace(/\./g, '... ')
        .replace(/,/g, ', ')
        .replace(/:/g, ': ')
        .replace(/;/g, '; ')
        .replace(/\?/g, '? ')
        .replace(/!/g, '! ')
        .replace(/\s+/g, ' ') // Clean up extra spaces
        .trim();

      console.log('Speaking as professor:', enhancedText.substring(0, 100) + '...');

      return this.speak(enhancedText, {
        rate: 0.85, // Slower for teaching
        pitch: 1.0,
        volume: 0.9
      });
    } catch (error) {
      console.error('Error in speakAsProfessor:', error);
      return Promise.resolve();
    }
  }
}

// Singleton instance
export const ttsManager = new TTSManager();

// Utility functions
export const speakText = (text: string, options?: TTSOptions) => {
  return ttsManager.speak(text, options);
};

export const speakAsProfessor = (text: string) => {
  return ttsManager.speakAsProfessor(text);
};

export const stopSpeaking = () => {
  ttsManager.stop();
};

export const isSpeaking = () => {
  return ttsManager.isSpeaking();
};

