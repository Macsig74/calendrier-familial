'use client'
import { useState } from 'react'
import { CalendarEvent, CategoryId, WeekType } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { useAppStore } from '@/hooks/StoreContext'
import { Bell, BellOff, Trash2 } from 'lucide-react'

interface Props {
  initial?: Partial<CalendarEvent>
  defaultDate?: string
  onSave: (e: Omit<CalendarEvent, 'id'>) => void
  onDelete?: () => void
  onClose: () => void
}

export default function EventForm({ initial, defaultDate, onSave, onDelete, onClose }: Props) {
  const { users } = useAppStore()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState<CategoryId>(initial?.category ?? 'autre')
  const [date, setDate] = useState(initial?.date ?? defaultDate ?? '')
  const [startTime, setStartTime] = useState(initial?.startTime ?? '')
  const [endTime, setEndTime] = useState(initial?.endTime ?? '')
  const [weekType, setWeekType] = useState<WeekType>(initial?.weekType ?? 'both')
  const [notification, setNotification] = useState(initial?.notification ?? false)
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(initial?.userIds ?? [])

  const toggleUser = (id: string) =>
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date) return
    onSave({ title: title.trim(), category, date, startTime, endTime, weekType, notification, notes, userIds: selectedUserIds })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Titre *</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ex: Escalade, Repas pasta…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Catégorie</label>
        <div className="grid grid-cols-3 gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                category === cat.id
                  ? `${cat.color} ${cat.textColor} ${cat.borderColor} ring-2 ring-offset-1`
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
              style={{}}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date + Times */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-3 sm:col-span-1">
          <label className="block text-xs font-medium text-slate-600 mb-1">Date *</label>
          <input
            type="date"
            required
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Début</label>
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Fin</label>
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Week type */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Semaine</label>
        <div className="flex gap-2">
          {(['both', 'A', 'B'] as WeekType[]).map(w => (
            <button
              key={w}
              type="button"
              onClick={() => setWeekType(w)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                weekType === w
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {w === 'both' ? 'Toutes' : `Sem. ${w}`}
            </button>
          ))}
        </div>
      </div>

      {/* Users */}
      {users.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Membres concernés</label>
          <div className="flex gap-2 flex-wrap">
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => toggleUser(u.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedUserIds.includes(u.id)
                    ? 'text-white border-transparent'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
                style={selectedUserIds.includes(u.id) ? { backgroundColor: u.color, borderColor: u.color } : {}}
              >
                <span>{u.emoji}</span>
                <span>{u.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notification */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">Notification</span>
        <button
          type="button"
          onClick={() => setNotification(!notification)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
            notification
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-white text-slate-500 border-slate-200'
          }`}
        >
          {notification ? <Bell size={14} /> : <BellOff size={14} />}
          {notification ? 'Activée' : 'Désactivée'}
        </button>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="Informations complémentaires…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {initial?.id ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  )
}
