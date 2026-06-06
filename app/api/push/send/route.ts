import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { supabase } from '@/lib/supabase'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { userIds, title, body, url } = await req.json()

    if (!userIds?.length || !title) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { data: rows, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .in('user_id', userIds)

    if (error) {
      console.error('Supabase fetch subscriptions error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!rows?.length) return NextResponse.json({ ok: true, sent: 0 })

    const payload = JSON.stringify({ title, body, url: url || '/taches', tag: 'famille-task' })

    const results = await Promise.allSettled(
      rows.map(row =>
        webpush.sendNotification(row.subscription as webpush.PushSubscription, payload)
      )
    )

    const failed = results.filter(r => r.status === 'rejected')
    if (failed.length) {
      console.error(`${failed.length} push(es) failed`)
    }

    return NextResponse.json({ ok: true, sent: results.length - failed.length })
  } catch (err) {
    console.error('Send push route error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
