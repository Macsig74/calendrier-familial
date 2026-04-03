import { User } from '@/lib/types'

interface Props {
  userIds: string[]
  users: User[]
  max?: number
}

export default function UserPills({ userIds, users, max = 3 }: Props) {
  const matched = userIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[]
  const visible = matched.slice(0, max)
  const overflow = matched.length - max

  return (
    <span className="flex items-center gap-0.5">
      {visible.map(u => (
        <span
          key={u.id}
          title={u.name}
          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: u.color }}
        >
          {u.emoji || u.name.charAt(0)}
        </span>
      ))}
      {overflow > 0 && (
        <span className="w-5 h-5 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold">
          +{overflow}
        </span>
      )}
    </span>
  )
}
