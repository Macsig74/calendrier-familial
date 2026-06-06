'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const AVATARS = [
  { username: 'mariedo', emoji: '👩', label: 'Mariedo' },
  { username: 'olivier', emoji: '👨', label: 'Olivier' },
  { username: 'gaspard', emoji: '🧑', label: 'Gaspard' },
  { username: 'arthur',  emoji: '👦', label: 'Arthur'  },
]

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !password) return
    setLoading(true)
    const ok = login(selected, password)
    setLoading(false)
    if (ok) {
      router.replace('/calendrier')
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 mb-4">
            <span className="text-4xl">🏠</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Famille</h1>
          <p className="text-slate-400 text-sm mt-1">Qui êtes-vous ?</p>
        </div>

        {/* Avatar grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {AVATARS.map(({ username, emoji, label }) => (
            <button
              key={username}
              type="button"
              onClick={() => { setSelected(username); setError(false); setPassword('') }}
              className={`flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all ${
                selected === username
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 active:scale-95'
              }`}
            >
              <span className="text-4xl">{emoji}</span>
              <span className="text-sm font-semibold text-white">{label}</span>
            </button>
          ))}
        </div>

        {/* Password form */}
        {selected && (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false) }}
              placeholder="Mot de passe"
              autoFocus
              autoComplete="current-password"
              className={`w-full px-4 py-3.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border ${
                error ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
              } focus:outline-none transition-colors text-base`}
            />
            {error && (
              <p className="text-red-400 text-sm text-center">Mot de passe incorrect</p>
            )}
            <button
              type="submit"
              disabled={!password || loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-base"
            >
              {loading ? 'Connexion…' : 'Entrer →'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
