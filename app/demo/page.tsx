"use client"

import { useState } from "react"

export default function DemoPage() {
  const [response, setResponse] = useState("")

  async function sendToAgent() {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Can you tell me about pricing?",
        language: "EN",
        email: "demo@customer.com",
        name: "Ryan Vision",
      }),
    })

    const data = await res.json()
    setResponse(JSON.stringify(data, null, 2))
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-bold">💬 Test Agent</h1>
      <button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={sendToAgent}
      >
        Trigger Agent
      </button>
      <pre className="bg-gray-100 p-4 rounded text-sm">{response}</pre>
    </main>
  )
}
