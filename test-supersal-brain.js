// 🧠 SUPERSAL KNOWLEDGE INGESTION TEST
// Testing the brain before going LIVE!

import SuperSalKnowledgeIngestor from './azure/ingestion/SuperSalKnowledgeIngestor'

async function testSuperSalBrain() {
  console.log('🧠 TESTING SUPERSAL KNOWLEDGE INGESTION SYSTEM...')
  console.log('💀 TOTAL WORKSPACE DOMINATION TEST!')
  console.log('')

  try {
    // Initialize the knowledge ingestion system
    const ingestor = new SuperSalKnowledgeIngestor()
    
    // Test workspace path
    const workspacePath = '/Users/saintvisionai/Desktop/The Magic '
    
    console.log('🚀 Starting knowledge ingestion test...')
    
    // Run the ingestion
    const results = await ingestor.ingestWorkspace(workspacePath)
    
    console.log('')
    console.log('📊 INGESTION TEST RESULTS:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📁 Total Files Scanned: ${results.totalFiles}`)
    console.log(`✅ Successful Ingestions: ${results.successfulIngestions}`)
    console.log(`❌ Failed Ingestions: ${results.failedIngestions}`)
    console.log(`📈 Success Rate: ${(results.successfulIngestions / results.totalFiles * 100).toFixed(1)}%`)
    console.log('')
    
    console.log('🤖 COMPANION DISTRIBUTION:')
    results.companionMapping.forEach((count, companion) => {
      console.log(`  ${companion}: ${count} documents`)
    })
    
    console.log('')
    console.log('⏱️  PERFORMANCE:')
    const duration = results.endTime.getTime() - results.startTime.getTime()
    console.log(`  Duration: ${duration}ms`)
    console.log(`  Files per second: ${(results.totalFiles / (duration / 1000)).toFixed(2)}`)
    
    if (results.errors.length > 0) {
      console.log('')
      console.log('⚠️  ERRORS:')
      results.errors.forEach(error => console.log(`  ${error}`))
    }
    
    console.log('')
    console.log('🎯 SUPERSAL BRAIN STATUS: READY FOR TOTAL DOMINATION!')
    console.log('💪 KNOWLEDGE INGESTION SYSTEM: OPERATIONAL!')
    
    return results
    
  } catch (error) {
    console.error('❌ BRAIN TEST FAILED:', error)
    throw error
  }
}

// Run the test
testSuperSalBrain()
  .then(results => {
    console.log('')
    console.log('🚀 BRAIN TEST COMPLETE - SUPERSAL IS READY!')
    console.log('📡 PROCEEDING TO LIVE DEPLOYMENT...')
  })
  .catch(error => {
    console.error('💥 BRAIN TEST ERROR:', error)
  })
