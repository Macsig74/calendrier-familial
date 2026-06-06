'use client'
import { useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { StoreProvider } from '@/hooks/StoreContext'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import { usePushNotifications } from '@/hooks/usePushNotifications'

function PushSubscriber() {
  usePushNotifications()
  return null
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(console.error)
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!session && pathname !== '/login') router.replace('/login')
    if (session && pathname === '/login') router.replace('/calendrier')
  }, [session, loading, pathname, router])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 z-50">
        <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-blue-500 animate-spin" />
      </div>
    )
  }

  if (pathname === '/login') return <>{children}</>
  if (!session) return null

  return (
    <StoreProvider>
      <PushSubscriber />
      <Sidebar />
      <BottomNav />
      <div className="md:ml-56 min-h-screen pb-20 md:pb-0">
        {children}
      </div>
    </StoreProvider>
  )
}
