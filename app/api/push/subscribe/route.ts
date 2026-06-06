import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { subscription, userId } = await req.json()
    if (!subscription?.endpoint || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint: subscription.endpoint,
        subscription: subscription,
      },
      { onConflict: 'endpoint' }
    )

    if (error) {
      console.error('Supabase push subscription error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Subscribe route error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
