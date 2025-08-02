// 🧠 SUPERSAL BRAIN FEEDING API - TOTAL KNOWLEDGE INGESTION
// "Feed SuperSal EVERYTHING - Every file, every folder, ALL the KRYPTONITE!"

import { activateSupermanMode, testSupermanMode } from './superman-activate'

/**
 * 🚀 POST - ACTIVATE SUPERMAN MODE & FEED SUPERSAL'S BRAIN
 */
export async function POST(request: Request): Promise<Response> {
  console.log('🧠 SUPERSAL BRAIN FEEDING INITIATED!')
  
  try {
    const body = await request.json()
    const workspacePath = body.workspacePath || '/Users/saintvisionai/Desktop/The Magic '
    
    console.log('🔥 SUPERMAN MODE ACTIVATION SEQUENCE STARTING...')
    console.log('📁 Target Workspace:', workspacePath)
    
    // 🦸‍♂️ ACTIVATE SUPERMAN MODE - TOTAL KRYPTONITE ABSORPTION!
    const result = await activateSupermanMode(workspacePath)
    
    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        message: '🦸‍♂️ SUPERMAN MODE ACTIVATED! SuperSal now has TOTAL knowledge domination!',
        stats: {
          totalFiles: result.stats?.totalFiles || 0,
          successfulIngestions: result.stats?.successfulIngestions || 0,
          successRate: result.stats ? (result.stats.successfulIngestions / result.stats.totalFiles * 100).toFixed(1) + '%' : '0%',
          companionDistribution: result.stats?.companionMapping ? Object.fromEntries(result.stats.companionMapping) : {},
          processingTime: result.stats ? `${((result.stats.endTime.getTime() - result.stats.startTime.getTime()) / 1000).toFixed(2)}s` : '0s'
        },
        supermanCapabilities: [
          '💰 Financial Analysis & Investment Intelligence',
          '🏥 Medical & Healthcare Knowledge (Athena)',
          '⚖️ Legal & Compliance Expertise (SVTLegal)', 
          '🤖 CRM & Automation Mastery (PartnerTech)',
          '🎓 Education & Training Systems (SVTTeach)',
          '🧠 Advanced AI & Neural Processing (Neuro)',
          '🏢 Complete Business Intelligence',
          '💬 Natural Conversation with UNLIMITED knowledge'
        ],
        nextSteps: [
          '🗣️ Talk to SuperSal naturally via POST /azure/chat/supersal',
          '💬 Ask about ANY file, ANY process, ANY strategy',
          '🔥 Experience warroom-style collaboration with TOTAL knowledge'
        ]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({
        success: false,
        message: '❌ Superman activation encountered issues',
        error: result.message
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
  } catch (error) {
    console.error('❌ BRAIN FEEDING ERROR:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Brain feeding failed',
      error: `${error}`
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * 🔍 GET - CHECK SUPERSAL'S BRAIN STATUS & SUPERMAN CAPABILITIES
 */
export async function GET(): Promise<Response> {
  console.log('🧠 CHECKING SUPERSAL BRAIN STATUS...')
  
  try {
    // 🧪 TEST SUPERMAN CAPABILITIES
    const isSupermanReady = await testSupermanMode()
    
    return new Response(JSON.stringify({
      status: 'SuperSal Brain Online 🧠',
      supermanMode: isSupermanReady ? 'ACTIVATED 🦸‍♂️' : 'READY FOR ACTIVATION ⚡',
      capabilities: [
        '🔥 TOTAL workspace knowledge absorption',
        '💰 Financial superman powers (lending, real estate, investments)',
        '🏥 Medical intelligence via Athena',
        '⚖️ Legal expertise via SVTLegal',
        '🤖 CRM automation via PartnerTech', 
        '🎓 Education systems via SVTTeach',
        '🧠 Advanced AI processing via Neuro',
        '💬 Natural conversation with unlimited knowledge'
      ],
      knowledgeDomains: [
        'Azure Infrastructure', 'AI Components', 'CRM Systems',
        'Financial Models', 'Real Estate Tools', 'Legal Documents',
        'Medical Processes', 'Education Content', 'Business Intelligence',
        'Warroom Strategies', 'Integration APIs', 'Chat Systems'
      ],
      instructions: {
        feedBrain: 'POST /azure/ingestion/route with optional workspacePath',
        chatWithSuperSal: 'POST /azure/chat/supersal with your message',
        conversationStyle: 'Natural, energetic, like talking to a knowledgeable friend'
      },
      message: isSupermanReady 
        ? '🔥 SuperSal is READY! Talk to him like you talk to me!' 
        : '⚡ Ready to activate Superman mode and give SuperSal TOTAL knowledge!'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'SuperSal Brain Initializing...',
      error: `${error}`,
      message: 'Brain status check failed, but SuperSal is still awesome! 🔥'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
