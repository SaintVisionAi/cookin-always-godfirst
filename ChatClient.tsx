
"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export default function ChatClient() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const response = await fetch("/api/chat/azure/route", {
      method: "POST",
      body: JSON.stringify({
        chatSettings: {
          temperature: 0.7,
          model: "gpt-4o",
        },
        messages: [...messages, userMessage],
      }),
    })

    if (!response.ok) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error: " + response.status }])
    } else {
      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || data.choices?.[0]?.delta?.content || "🤖 No reply"
      setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="text-center text-2xl font-semibold mb-4">🎙️ SaintSAL – Your 24/7 Agent</div>
      <div className="space-y-4 border p-4 rounded-md bg-gray-50 max-h-[65vh] overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-4 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">💬 Thinking...</div>}
        <div ref={bottomRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          className="w-full border rounded-md p-2 resize-none"
          placeholder="Ask SaintSAL anything..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Send
        </button>
      </div>
    </div>
  )
}
