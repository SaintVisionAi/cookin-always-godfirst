import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId, stripeCustomerId } = await req.json()

    const customer = await stripe.customers.retrieve(stripeCustomerId)
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      expand: ['data.default_payment_method'],
    })

    const activePlan = subscriptions.data.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing'
    )

    const plan = activePlan?.items?.data[0]?.price?.id || 'free'

    // Sync user tier to Supabase
    const { error: supabaseError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { plan },
    })

    if (supabaseError) {
      console.error('Supabase sync failed:', supabaseError)
    }

    const upsellNeeded = plan === 'free'

    return NextResponse.json({
      userId,
      plan,
      upsellNeeded,
      message: upsellNeeded
        ? 'User on FREE — consider upgrade prompt'
        : 'User on active plan',
    })
  } catch (err) {
    console.error('Plan check error:', err)
    return NextResponse.json({ error: 'Plan check failed' }, { status: 500 })
  }
}
