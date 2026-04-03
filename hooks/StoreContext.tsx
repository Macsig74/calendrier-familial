'use client'
import { createContext, useContext, ReactNode } from 'react'
import { useStore, Store } from './useStore'

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStore()

  if (!store.loaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50 z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Chargement…</p>
        </div>
      </div>
    )
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useAppStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useAppStore must be used inside StoreProvider')
  return ctx
}
