'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthSession, getStoredSession, storeSession, clearSession, validateCredentials } from '@/lib/auth'

interface AuthContextType {
  session: AuthSession | null
  login: (username: string, password: string) => boolean
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(getStoredSession())
    setLoading(false)
  }, [])

  const login = (username: string, password: string): boolean => {
    const s = validateCredentials(username, password)
    if (!s) return false
    storeSession(s)
    setSession(s)
    return true
  }

  const logout = () => {
    clearSession()
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
