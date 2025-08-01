
import ChatClient from "@/components/ChatClient"

export default function Page() {
  return (
    <main className="min-h-screen p-4 bg-gray-100 text-black">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🚀 SaintSAL: Your 24/7 Hyper Agent
      </h1>
      <ChatClient />
    </main>
  )
}
