export interface AuthSession {
  username: string
  userId: string
  name: string
}

const CREDENTIALS: Record<string, { password: string; userId: string; name: string }> = {
  mariedo: { password: 'cresson',  userId: 'u1', name: 'Mariedo' },
  arthur:  { password: 'jspbuild', userId: 'u4', name: 'Arthur'  },
  olivier: { password: 'escalade', userId: 'u2', name: 'Olivier' },
  gaspard: { password: 'escalade', userId: 'u3', name: 'Gaspard' },
}

const SESSION_KEY = 'famille_auth_session'

export function validateCredentials(username: string, password: string): AuthSession | null {
  const cred = CREDENTIALS[username.toLowerCase().trim()]
  if (!cred || cred.password !== password) return null
  return { username: username.toLowerCase().trim(), userId: cred.userId, name: cred.name }
}

export function getStoredSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function storeSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
