'use client'
import { useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { X, Pencil, Trash2, Bell, Clock, CalendarDays, Users } from 'lucide-react'
import { CalendarEvent } from '@/lib/types'
import { getCategoryById } from '@/lib/constants'
import { User } from '@/lib/types'

interface Props {
  event: CalendarEvent
  users: User[]
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function EventDetail({ event, users, onClose, onEdit, onDelete }: Props) {
  const cat = getCategoryById(event.category)
  const eventUsers = event.userIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Colored header */}
        <div className={`px-5 pt-5 pb-4 ${cat.color} border-b ${cat.borderColor}`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60 ${cat.textColor} border ${cat.borderColor}`}>
                {cat.label}
              </span>
              <h2 className={`text-lg font-bold mt-2 leading-tight ${cat.textColor}`}>{event.title}</h2>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg hover:bg-white/40 transition-colors ${cat.textColor} opacity-70 hover:opacity-100 shrink-0`}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-3">
          {/* Date */}
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <CalendarDays size={15} className="text-slate-400 shrink-0" />
            <span className="capitalize">
              {format(parseISO(event.date), 'EEEE d MMMM yyyy', { locale: fr })}
            </span>
          </div>

          {/* Time */}
          {(event.startTime || event.endTime) && (
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Clock size={15} className="text-slate-400 shrink-0" />
              <span>{event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}</span>
            </div>
          )}

          {/* Week type */}
          {event.weekType !== 'both' && (
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                event.weekType === 'A' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
              }`}>
                Sem. {event.weekType}
              </span>
              <span className="text-slate-400 text-xs">semaine alternante</span>
            </div>
          )}

          {/* Members */}
          {eventUsers.length > 0 && (
            <div className="flex items-center gap-3">
              <Users size={15} className="text-slate-400 shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {eventUsers.map(u => (
                  <span
                    key={u.id}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full text-white"
                    style={{ backgroundColor: u.color }}
                  >
                    {u.emoji} {u.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notification */}
          {event.notification && (
            <div className="flex items-center gap-3 text-sm text-amber-600">
              <Bell size={15} className="shrink-0" />
              <span>Notification activée</span>
            </div>
          )}

          {/* Notes */}
          {event.notes && (
            <div className="bg-slate-50 rounded-xl px-3 py-2.5 text-sm text-slate-600 italic border border-slate-100">
              {event.notes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={() => { onDelete(); onClose() }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 border border-red-100 transition-colors"
          >
            <Trash2 size={14} /> Supprimer
          </button>
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 transition-colors"
          >
            <Pencil size={14} /> Modifier
          </button>
        </div>
      </div>
    </div>
  )
}
