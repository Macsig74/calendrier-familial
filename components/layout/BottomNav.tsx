'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Car, CheckSquare, Plane, Settings } from 'lucide-react'

const NAV = [
  { href: '/calendrier', label: 'Calendrier', icon: CalendarDays },
  { href: '/voitures',   label: 'Voitures',   icon: Car },
  { href: '/taches',     label: 'Tâches',     icon: CheckSquare },
  { href: '/voyages',    label: 'Voyages',     icon: Plane },
  { href: '/parametres', label: 'Réglages',   icon: Settings },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-700 md:hidden">
      <div className="flex">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 pt-2.5 pb-3 transition-colors ${
                active ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[9px] font-medium leading-none">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
