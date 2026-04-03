'use client'
import { useAppStore } from '@/hooks/StoreContext'

interface Props {
  title: string
}

export default function Header({ title }: Props) {
  const { users } = useAppStore()

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-slate-200 sticky top-0 z-20">
      <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      <div className="flex items-center gap-1.5">
        {users.map(u => (
          <div
            key={u.id}
            title={u.name}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm cursor-default select-none"
            style={{ backgroundColor: u.color }}
          >
            {u.emoji || u.name.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
    </header>
  )
}
