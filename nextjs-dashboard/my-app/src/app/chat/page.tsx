"use client";

import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: generateAIResponse(input.trim()),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (question: string): string => {
    const responses = [
      "That's a great question! Let me explain that concept in detail...",
      "I'm glad you asked! Here's how that works:",
      "Excellent question! This is a common area of confusion. Let me clarify:",
      "Perfect! Let me break this down for you:",
      "That's a key concept! Here's what you need to know:"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    if (question.toLowerCase().includes("react") || question.toLowerCase().includes("component")) {
      return `${randomResponse} React is a powerful library for building user interfaces. Components are the building blocks of React applications. They let you split the UI into independent, reusable pieces. Would you like me to show you a specific example or explain any particular aspect in more detail?`;
    }
    
    if (question.toLowerCase().includes("javascript") || question.toLowerCase().includes("js")) {
      return `${randomResponse} JavaScript is a versatile programming language that's essential for web development. It's used for both frontend and backend development. The language has evolved significantly with ES6+ features like arrow functions, destructuring, and async/await. What specific aspect of JavaScript would you like to explore?`;
    }
    
    if (question.toLowerCase().includes("algorithm") || question.toLowerCase().includes("data structure")) {
      return `${randomResponse} Algorithms and data structures are fundamental concepts in computer science. They help you write efficient code and solve complex problems. Common data structures include arrays, linked lists, stacks, queues, trees, and graphs. Would you like me to explain any specific algorithm or data structure?`;
    }
    
    if (question.toLowerCase().includes("help") || question.toLowerCase().includes("stuck")) {
      return `${randomResponse} I'm here to help! Learning programming can be challenging, but with practice and the right approach, you'll get there. Try breaking down complex problems into smaller parts, practice regularly, and don't hesitate to ask questions. What specific challenge are you facing?`;
    }
    
    return `${randomResponse} I'm here to help you learn and grow as a developer. Feel free to ask me about any programming concept, best practices, or learning strategies. I can help with code examples, explanations, and guidance on your learning path. What would you like to explore?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chat with AI Professor</h1>
            <p className="text-muted-foreground mt-1">Get instant help with your programming questions</p>
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
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    </AppLayout>
  );
}
