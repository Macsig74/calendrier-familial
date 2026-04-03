'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Car, CheckSquare, Plane, Settings } from 'lucide-react'

const NAV = [
  { href: '/calendrier',  label: 'Calendrier', icon: CalendarDays },
  { href: '/voitures',    label: 'Voitures',   icon: Car },
  { href: '/taches',      label: 'Tâches',     icon: CheckSquare },
  { href: '/voyages',     label: 'Voyages',    icon: Plane },
  { href: '/parametres',  label: 'Paramètres', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-16 md:w-56 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-slate-700">
        <span className="text-2xl">🏠</span>
        <span className="hidden md:block text-white font-bold text-sm leading-tight">
          Famille<br/>
          <span className="text-slate-400 font-normal text-xs">Organisateur</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-lg transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden md:block text-sm font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
