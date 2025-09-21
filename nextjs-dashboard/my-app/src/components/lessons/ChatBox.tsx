"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconSend, IconBrain, IconUser, IconLoader2 } from "@tabler/icons-react"

interface Message {
  id: string
  role: "user" | "ai"
  text: string
  timestamp: Date
  isTyping?: boolean
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

export default function ChatBox({ lessonId }: { lessonId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hello! I'm your AI Professor. I'm here to help you understand this lesson better. Feel free to ask me any questions!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Ensure we're on the client side to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: generateAIResponse(input.trim(), lessonId),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (question: string, lessonId: string): string => {
    const responses = [
      "Great question! Let me explain that concept in more detail...",
      "That's an excellent point! Here's how it works:",
      "I'm glad you asked! This is a common area of confusion. Let me clarify:",
      "Perfect timing for that question! Here's what you need to know:",
      "That's a key concept! Let me break it down for you:"
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    if (question.toLowerCase().includes("code") || question.toLowerCase().includes("example")) {
      return `${randomResponse} Here's a code example that demonstrates this concept:\n\n\`\`\`javascript\n// Example code here\nconst example = "This shows the concept";\n\`\`\`\n\nThis example shows how the concept works in practice.`
    }
    
    if (question.toLowerCase().includes("difficult") || question.toLowerCase().includes("confused")) {
      return `${randomResponse} Don't worry, this is a challenging topic! Let me explain it step by step:\n\n1. First, understand the basic concept\n2. Then, see how it applies in practice\n3. Finally, practice with examples\n\nWould you like me to go through any of these steps in more detail?`
    }
    
    return `${randomResponse} In the context of lesson ${lessonId}, this relates to the core concepts we're covering. The key thing to remember is that understanding comes with practice. Would you like me to provide a specific example or explain any particular aspect in more detail?`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <IconBrain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Professor Chat</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Ask questions about this lesson
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "ai" && (
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                <IconBrain className="w-4 h-4" />
              </div>
            )}
            
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {isClient ? formatTime(message.timestamp) : ''}
              </p>
            </div>
            
            {message.role === "user" && (
              <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center flex-shrink-0">
                <IconUser className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
              <IconBrain className="w-4 h-4" />
            </div>
            <div className="bg-muted text-foreground rounded-lg p-3">
              <div className="flex items-center gap-2">
                <IconLoader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">AI Professor is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about this lesson..."
            className="flex-1 min-h-[40px] max-h-32 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={1}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <IconSend className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
