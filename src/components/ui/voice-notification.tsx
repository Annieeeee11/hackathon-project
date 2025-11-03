"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ttsManager } from '@/lib/tts';
import { IconX, IconVolume } from '@tabler/icons-react';

interface VoiceNotificationProps {
  onEnable?: () => void;
  autoShow?: boolean;
}

export default function VoiceNotification({ onEnable, autoShow = true }: VoiceNotificationProps) {
  const [show, setShow] = useState(false);
  const [hasInteraction, setHasInteraction] = useState(true);

  useEffect(() => {
    if (!autoShow) return;

    const checkInteraction = () => {
      const needsInteraction = !ttsManager.hasUserInteraction();
      setHasInteraction(!needsInteraction);
      setShow(needsInteraction);
    };

    checkInteraction();
    
    // Check periodically
    const interval = setInterval(checkInteraction, 2000);
    
    return () => clearInterval(interval);
  }, [autoShow]);

  const enableVoice = () => {
    ttsManager.enableTTS();
    setHasInteraction(true);
    setShow(false);
    onEnable?.();
  };

  const dismiss = () => {
    setShow(false);
  };

  if (!show || hasInteraction) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <div className="flex items-start gap-3">
        <IconVolume className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-800">
            Enable AI Professor Voice
          </h4>
          <p className="text-xs text-yellow-700 mt-1">
            Click to enable voice synthesis for a more interactive learning experience.
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={enableVoice}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Enable Voice
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={dismiss}
              className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
            >
              Later
            </Button>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="text-yellow-600 hover:text-yellow-800 p-1"
          aria-label="Dismiss"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
