'use client'
import { useEffect } from 'react'
import { useAuth } from './useAuth'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray.buffer as ArrayBuffer
}

async function subscribeUser(userId: string) {
  try {
    const reg = await navigator.serviceWorker.ready
    let sub = await reg.pushManager.getSubscription()

    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })
    }

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub.toJSON(), userId }),
    })
  } catch (err) {
    console.error('Push subscription error:', err)
  }
}

export function usePushNotifications() {
  const { session } = useAuth()

  useEffect(() => {
    if (!session) return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    if (Notification.permission === 'granted') {
      subscribeUser(session.userId)
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') subscribeUser(session.userId)
      })
    }
  }, [session])
}
