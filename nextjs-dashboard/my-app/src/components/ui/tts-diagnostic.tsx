"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ttsManager } from '@/lib/tts';

export default function TTSDiagnostic() {
  const [isSupported, setIsSupported] = useState(false);
  const [voiceCount, setVoiceCount] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [testText] = useState("Hello, this is a test of the speech synthesis system.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastError, setLastError] = useState<string>('');
  const [hasUserInteraction, setHasUserInteraction] = useState(false);

  useEffect(() => {
    checkTTSSupport();
  }, []);

  const checkTTSSupport = async () => {
    try {
      // Check if Speech Synthesis is supported
      const supported = 'speechSynthesis' in window;
      setIsSupported(supported);

      if (supported) {
        // Initialize TTS manager
        await ttsManager.ensureInitialized();
        setIsInitialized(true);

        // Get available voices
        const voices = ttsManager.getAvailableVoices();
        setVoiceCount(voices.length);

        // Get professor voice
        const professorVoice = ttsManager.getProfessorVoice();
        if (professorVoice) {
          setSelectedVoice(professorVoice.name);
        }

        // Set up speaking state listener
        ttsManager.onSpeakingStateChange((speaking) => {
          setIsSpeaking(speaking);
        });

        // Check user interaction status
        setHasUserInteraction(ttsManager.hasUserInteraction());
      }
    } catch (error) {
      console.error('TTS diagnostic error:', error);
      setLastError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testSpeech = async () => {
    try {
      setLastError('');
      
      // Enable TTS if not already enabled
      if (!hasUserInteraction) {
        ttsManager.enableTTS();
        setHasUserInteraction(true);
      }
      
      await ttsManager.speakAsProfessor(testText);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Speech test failed';
      setLastError(errorMsg);
      console.error('Speech test error:', error);
    }
  };

  const stopSpeech = () => {
    ttsManager.stop();
    setLastError('');
  };

  return (
    <div className="p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">TTS Diagnostic</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Browser Support:</span>
          <span className={isSupported ? 'text-green-600' : 'text-red-600'}>
            {isSupported ? '✓ Supported' : '✗ Not Supported'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>TTS Initialized:</span>
          <span className={isInitialized ? 'text-green-600' : 'text-yellow-600'}>
            {isInitialized ? '✓ Ready' : '⏳ Loading...'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Available Voices:</span>
          <span className={voiceCount > 0 ? 'text-green-600' : 'text-red-600'}>
            {voiceCount} voices
          </span>
        </div>

        <div className="flex justify-between">
          <span>Professor Voice:</span>
          <span className={selectedVoice ? 'text-green-600' : 'text-yellow-600'}>
            {selectedVoice || 'Default'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>User Interaction:</span>
          <span className={hasUserInteraction ? 'text-green-600' : 'text-red-600'}>
            {hasUserInteraction ? '✓ Enabled' : '✗ Required'}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Currently Speaking:</span>
          <span className={isSpeaking ? 'text-blue-600' : 'text-gray-600'}>
            {isSpeaking ? '🎤 Speaking' : '🔇 Silent'}
          </span>
        </div>

        {lastError && (
          <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700">
            <strong>Error:</strong> {lastError}
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          <Button 
            onClick={testSpeech} 
            disabled={!isSupported || !isInitialized || isSpeaking}
            size="sm"
          >
            🎤 Test Speech
          </Button>
          
          {isSpeaking && (
            <Button 
              onClick={stopSpeech} 
              variant="outline"
              size="sm"
            >
              ⏹️ Stop
            </Button>
          )}
        </div>

        <Button 
          onClick={checkTTSSupport} 
          variant="outline"
          size="sm"
          className="w-full"
        >
          🔄 Refresh Diagnostic
        </Button>
      </div>

      <div className="mt-4 p-2 bg-muted rounded text-xs">
        <strong>Test Text:</strong> {testText}
      </div>
    </div>
  );
}
