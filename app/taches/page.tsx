'use client'
import { useState, useMemo } from 'react'
import { format, parseISO, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus, CheckCircle2, Circle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import Modal from '@/components/ui/Modal'
import CategoryBadge from '@/components/ui/Badge'
import UserPills from '@/components/ui/UserPills'
import { useAppStore } from '@/hooks/StoreContext'
import { Task, CategoryId } from '@/lib/types'
import { CATEGORIES } from '@/lib/constants'
import { toDateString } from '@/lib/utils'

function TaskForm({ onSave, onClose, initial }: {
  initial?: Partial<Task>
  onSave: (t: Omit<Task, 'id'>) => void
  onClose: () => void
}) {
  const { users } = useAppStore()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [date, setDate] = useState(initial?.date ?? toDateString(new Date()))
  const [category, setCategory] = useState<CategoryId | ''>(initial?.category ?? '')
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>(initial?.assignedUserIds ?? [])
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const toggleUser = (id: string) =>
    setAssignedUserIds(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date) return
    onSave({
      title: title.trim(),
      date,
      category: category as CategoryId || undefined,
      assignedUserIds,
      status: initial?.status ?? 'pending',
      notes: notes || undefined,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Tâche *</label>
        <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Ex: Faire la lessive, Révision maths…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Date *</label>
        <input type="date" required value={date} onChange={e => setDate(e.target.value)}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Catégorie</label>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => setCategory('')}
            className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all ${
              category === '' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
            }`}>
            Aucune
          </button>
          {CATEGORIES.filter(c => c.id !== 'autre').map(cat => (
            <button key={cat.id} type="button" onClick={() => setCategory(cat.id)}
              className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all ${
                category === cat.id ? `${cat.color} ${cat.textColor} ${cat.borderColor}` : 'bg-white text-slate-600 border-slate-200'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {users.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Assigné à</label>
          <div className="flex gap-2 flex-wrap">
            {users.map(u => (
              <button key={u.id} type="button" onClick={() => toggleUser(u.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  assignedUserIds.includes(u.id) ? 'text-white border-transparent' : 'bg-white text-slate-600 border-slate-200'
                }`}
                style={assignedUserIds.includes(u.id) ? { backgroundColor: u.color, borderColor: u.color } : {}}>
                <span>{u.emoji}</span> {u.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Détails…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Annuler</button>
        <button type="submit" className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Ajouter</button>
      </div>
    </form>
  )
}

const STATUS_ICON = {
  pending: <Circle size={18} className="text-slate-400" />,
  done: <CheckCircle2 size={18} className="text-green-500" />,
}

export default function TachesPage() {
  const { tasks, users, addTask, updateTask, deleteTask } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [showDone, setShowDone] = useState(false)

  const active = useMemo(() =>
    tasks.filter(t => t.status !== 'done').sort((a, b) => a.date.localeCompare(b.date)),
    [tasks]
  )
  const done = useMemo(() =>
    tasks.filter(t => t.status === 'done').sort((a, b) => b.date.localeCompare(a.date)),
    [tasks]
  )

  const grouped = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const t of active) {
      if (!map[t.date]) map[t.date] = []
      map[t.date].push(t)
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  }, [active])

  const TaskRow = ({ task }: { task: Task }) => (
    <div className={`flex items-center gap-3 p-3 rounded-xl border bg-white transition-all ${
      task.status === 'done' ? 'opacity-60 border-slate-100' : 'border-slate-200 shadow-sm'
    }`}>
      <button onClick={() => updateTask(task.id, { status: task.status === 'done' ? 'pending' : 'done' })} className="shrink-0">
        {STATUS_ICON[task.status]}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
          {task.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {task.category && <CategoryBadge category={task.category} />}
          {task.assignedUserIds.length > 0 && (
            <UserPills userIds={task.assignedUserIds} users={users} />
          )}
          {task.notes && <span className="text-xs text-slate-400 truncate">{task.notes}</span>}
        </div>
      </div>
      <button onClick={() => deleteTask(task.id)} className="shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Tâches" />

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'À faire', count: tasks.filter(t => t.status === 'pending').length, color: 'text-slate-600', bg: 'bg-slate-50' },
            { label: 'Terminées', count: tasks.filter(t => t.status === 'done').length, color: 'text-green-600', bg: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center border border-white`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-medium text-sm hover:border-blue-400 hover:bg-blue-50 transition-colors mb-6"
        >
          <Plus size={16} /> Nouvelle tâche
        </button>

        {/* Active tasks grouped by date */}
        {grouped.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">Aucune tâche en cours</p>
        ) : (
          <div className="space-y-4">
            {grouped.map(([date, dayTasks]) => {
              const d = parseISO(date)
              const isT = isToday(d)
              return (
                <div key={date}>
                  <div className={`flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wide ${isT ? 'text-blue-600' : 'text-slate-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isT ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    {isT ? "Aujourd'hui" : format(d, 'EEEE d MMMM', { locale: fr })}
                  </div>
                  <div className="space-y-2">
                    {dayTasks.map(t => <TaskRow key={t.id} task={t} />)}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Done section */}
        {done.length > 0 && (
          <div className="mt-6">
            <button onClick={() => setShowDone(!showDone)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-2">
              {showDone ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Terminées ({done.length})
            </button>
            {showDone && (
              <div className="space-y-2">
                {done.map(t => <TaskRow key={t.id} task={t} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title="Nouvelle tâche" onClose={() => setModalOpen(false)}>
          <TaskForm onSave={addTask} onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  )
}
