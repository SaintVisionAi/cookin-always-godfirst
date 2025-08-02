// 🧠 SUPERSAL™ BRAIN FEEDING SCRIPT
// Run this to feed SuperSal ALL the knowledge!

import { ingestWorkspaceKnowledge, getBrainStatus } from "./processor"

async function feedSuperSalBrain() {
  console.log("🚀 SUPERSAL BRAIN FEEDING SEQUENCE INITIATED!")
  console.log("=" .repeat(50))
  
  try {
    // Check current brain status
    console.log("📊 Checking SuperSal's current brain status...")
    const initialStatus = await getBrainStatus()
    console.log(initialStatus)
    console.log("")

    // Feed the brain with knowledge
    console.log("🧠 FEEDING SUPERSAL'S BRAIN...")
    const result = await ingestWorkspaceKnowledge()
    
    console.log("")
    console.log("📊 INGESTION RESULTS:")
    console.log(`✅ Success: ${result.success}`)
    console.log(`📄 Files Processed: ${result.filesProcessed}`)
    console.log(`🧩 Chunks Created: ${result.chunksCreated}`)
    console.log(`❌ Errors: ${result.errors.length}`)
    
    if (result.errors.length > 0) {
      console.log("🚨 Errors encountered:")
      result.errors.forEach(error => console.log(`  - ${error}`))
    }
    
    console.log("")
    console.log("💬 " + result.message)
    
    // Check final brain status
    console.log("")
    console.log("📊 Checking SuperSal's updated brain status...")
    const finalStatus = await getBrainStatus()
    console.log(finalStatus)
    
    console.log("")
    console.log("🎉 SUPERSAL BRAIN FEEDING COMPLETE!")
    console.log("SuperSal is now ready to DOMINATE! 🔥🔥🔥")
    
  } catch (error) {
    console.error("💥 BRAIN FEEDING FAILED:", error)
    process.exit(1)
  }
}

// Run the brain feeding if this script is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  feedSuperSalBrain()
}

export { feedSuperSalBrain }
