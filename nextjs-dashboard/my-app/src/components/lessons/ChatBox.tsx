"use client"
import { useState } from "react"

interface Message {
  role: "user" | "ai"
  text: string
}

export default function ChatBox({ lessonId }: { lessonId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    const reply = `Mock AI response for lesson ${lessonId}`
    setMessages([...messages, { role: "user", text: input }, { role: "ai", text: reply }])
    setInput("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className="px-3 py-1 bg-gray-100 rounded-lg">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l px-2"
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage} className="px-4 bg-blue-600 text-white rounded-r">
          Send
        </button>
      </div>
    </div>
  )
}
