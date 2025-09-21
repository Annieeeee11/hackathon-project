"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ttsManager, TTSVoice } from '@/lib/tts';
import { 
  IconVolume, 
  IconVolumeOff, 
  IconSettings,
  IconX
} from '@tabler/icons-react';

interface VoiceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onVoiceToggle: (enabled: boolean) => void;
  isVoiceEnabled: boolean;
}

export default function VoiceSettings({ 
  isOpen, 
  onClose, 
  onVoiceToggle, 
  isVoiceEnabled 
}: VoiceSettingsProps) {
  const [voices, setVoices] = useState<TTSVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(0.85);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(0.9);
  const [testText] = useState("Hello! I'm your AI Professor. This is how I sound when teaching.");

  useEffect(() => {
    if (isOpen) {
      loadVoices();
    }
  }, [isOpen]);

  const loadVoices = async () => {
    await ttsManager.ensureInitialized();
    const availableVoices = ttsManager.getAvailableVoices();
    setVoices(availableVoices);
    
    const professorVoice = ttsManager.getProfessorVoice();
    if (professorVoice) {
      setSelectedVoice(professorVoice.name);
    }
  };

  const testVoice = () => {
    ttsManager.speak(testText, {
      rate,
      pitch,
      volume
    });
  };

  const stopTest = () => {
    ttsManager.stop();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">Voice Settings</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <IconX className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Voice Enable/Disable */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Enable Voice</label>
            <Button
              variant={isVoiceEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => onVoiceToggle(!isVoiceEnabled)}
            >
              {isVoiceEnabled ? (
                <>
                  <IconVolume className="w-4 h-4 mr-2" />
                  ON
                </>
              ) : (
                <>
                  <IconVolumeOff className="w-4 h-4 mr-2" />
                  OFF
                </>
              )}
            </Button>
          </div>

          {isVoiceEnabled && (
            <>
              {/* Voice Selection */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Voice ({voices.length} available)
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm"
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang}) {voice.gender === 'male' ? '♂' : voice.gender === 'female' ? '♀' : '⚪'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate Control */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Speaking Rate: {rate.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Pitch Control */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Voice Pitch: {pitch.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>

              {/* Volume Control */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Test Voice */}
              <div className="flex gap-2">
                <Button onClick={testVoice} className="flex-1">
                  🎤 Test Voice
                </Button>
                <Button variant="outline" onClick={stopTest}>
                  ⏹️ Stop
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
