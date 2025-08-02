// Server-side chat helper functions for SuperSal platform

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function checkApiKey(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return {
        isValid: false,
        error: 'OpenAI API key not configured'
      }
    }
    
    return {
      isValid: true,
      apiKey
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate API key'
    }
  }
}

export async function getServerProfile() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return {
        profile: null,
        error: 'Not authenticated'
      }
    }
    
    return {
      profile: {
        id: session.user.email || 'anonymous',
        name: session.user.name || 'SuperSal User',
        email: session.user.email || null
      },
      error: null
    }
  } catch (error) {
    return {
      profile: null,
      error: 'Failed to get user profile'
    }
  }
}
