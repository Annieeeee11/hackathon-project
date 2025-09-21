"use client";

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import Avatar3D from "@/components/lessons/Avatar3D";
import { 
  IconSend,
  IconLoader2,
  IconUser,
  IconRobot
} from "@tabler/icons-react";
import { ModeToggle } from "@/components/modeToggle";


interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
}

// Utility function to format time consistently for SSR
const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hello! I'm your AI Professor. I'm here to help you with any questions about programming, concepts, or your learning journey. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<'neutral' | 'happy' | 'thinking' | 'explaining'>('neutral');
  const [currentAvatarMessage, setCurrentAvatarMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ensure we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsLoading(true);
    
    // Set avatar to thinking state
    setAvatarEmotion('thinking');
    setCurrentAvatarMessage("Processing your question...");

    try {
      // Call the AI chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentInput,
          context: 'general_chat'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: data.answer || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      // Set avatar to explaining state with the response
      setAvatarEmotion('explaining');
      setCurrentAvatarMessage(aiResponse.text);
      
      setMessages(prev => [...prev, aiResponse]);
      
      // After 3 seconds, set avatar back to neutral
      setTimeout(() => {
        setAvatarEmotion('neutral');
        setCurrentAvatarMessage("");
      }, 3000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Set avatar to neutral on error
      setAvatarEmotion('neutral');
      setCurrentAvatarMessage("");
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppLayout>
    <div className="flex h-screen bg-background">
        {/* 3D Avatar Section */}
        <div className="w-1/3 border-r bg-card/50">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">AI Professor</h2>
              <p className="text-sm text-muted-foreground">Your interactive learning companion</p>
            </div>
            <div className="flex-1">
              <Avatar3D 
                isSpeaking={isLoading || avatarEmotion === 'explaining'}
                currentMessage={currentAvatarMessage}
                emotion={avatarEmotion}
                showControls={true}
                className="h-full"
                enableVoice={true}
                onSpeakingChange={(speaking) => {
                  // Update UI based on actual speech state
                  if (speaking && avatarEmotion !== 'explaining') {
                    setAvatarEmotion('explaining');
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          <header className="flex justify-between items-center p-6 border-b">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Chat Interface</h1>
              <p className="text-muted-foreground mt-1">Ask questions and get instant AI responses</p>
            </div>
            <ModeToggle />
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "ai" && (
                  <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                    <IconRobot className="w-5 h-5" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {isClient ? formatTime(message.timestamp) : ''}
                  </p>
                </div>
                
                {message.role === "user" && (
                  <div className="w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                    <IconUser className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                  <IconRobot className="w-5 h-5" />
                </div>
                <div className="bg-muted text-foreground rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <IconLoader2 className="w-4 h-4 animate-spin" />
                    <span>AI Professor is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

          {/* Input */}
          <div className="p-6 border-t bg-card">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about programming, concepts, or your learning journey..."
                  className="flex-1 min-h-[50px] max-h-32 px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={1}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="lg"
                  className="px-6"
                >
                  <IconSend className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
