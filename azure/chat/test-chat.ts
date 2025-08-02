// 🗣️ SUPERSAL™ CHAT TESTER
// Test SuperSal's conversation abilities right now!

import { chatWithSuperSal } from './supersal'

async function testSuperSalChat() {
  console.log("🔥 TESTING SUPERSAL CHAT SYSTEM!")
  console.log("=" .repeat(50))
  
  const testMessages = [
    "Yo SuperSal! What's up bro?",
    "What can you help me with?",
    "Tell me about Saint Vision Group",
    "How do I build an AI assistant?",
    "What makes you different from other AIs?",
    "Can you help me with sales?"
  ]
  
  for (const message of testMessages) {
    try {
      console.log(`\n👤 USER: ${message}`)
      console.log("🧠 SuperSal thinking...")
      
      const response = await chatWithSuperSal(message, 'test-user')
      
      console.log(`🤖 SUPERSAL (${response.mood.toUpperCase()}): ${response.message}`)
      console.log(`📊 Confidence: ${Math.round(response.confidence * 100)}%`)
      console.log("-" .repeat(30))
      
      // Wait a bit between messages
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`❌ Error testing message "${message}":`, error)
    }
  }
  
  console.log("\n🎉 SUPERSAL CHAT TEST COMPLETE!")
  console.log("SuperSal is ready to dominate conversations! 🔥")
}

// Run the test if this script is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  testSuperSalChat()
}

export { testSuperSalChat }
