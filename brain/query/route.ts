import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { query } = await req.json()
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Simple text search in Supabase
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .textSearch('content', query)
      .limit(10)

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }

    return NextResponse.json({
      results: data || [],
      query,
      count: data?.length || 0
    })

  } catch (error) {
    console.error('Query error:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }
}
