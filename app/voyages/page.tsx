'use client'
import { useState, useMemo } from 'react'
import { format, parseISO, isFuture, isToday, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus, Plane, Calendar, Users, MapPin, Trash2, Edit3, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Modal from '@/components/ui/Modal'
import UserPills from '@/components/ui/UserPills'
import { useAppStore } from '@/hooks/StoreContext'
import { Trip, FlightType } from '@/lib/types'
import { FLIGHT_TYPE_LABELS, TRIP_STATUS_LABELS } from '@/lib/constants'
import { toDateString } from '@/lib/utils'

function TripForm({ onSave, onClose, initial }: {
  initial?: Partial<Trip>
  onSave: (t: Omit<Trip, 'id'>) => void
  onClose: () => void
}) {
  const { users } = useAppStore()
  const [destination, setDestination] = useState(initial?.destination ?? '')
  const [startDate, setStartDate] = useState(initial?.startDate ?? '')
  const [endDate, setEndDate] = useState(initial?.endDate ?? '')
  const [flightType, setFlightType] = useState<FlightType>(initial?.flightType ?? 'aller-retour')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(initial?.userIds ?? users.map(u => u.id))
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [status, setStatus] = useState<Trip['status']>(initial?.status ?? 'planned')

  const days = startDate && endDate ? differenceInDays(parseISO(endDate), parseISO(startDate)) + 1 : 0

  const toggleUser = (id: string) =>
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!destination.trim() || !startDate || !endDate) return
    onSave({
      destination: destination.trim(),
      startDate, endDate,
      days: Math.max(1, days),
      flightType, status,
      userIds: selectedUserIds,
      notes: notes || undefined,
    })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Destination *</label>
        <input type="text" required value={destination} onChange={e => setDestination(e.target.value)}
          placeholder="Ex: Barcelone, Londres…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Départ *</label>
          <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Retour *</label>
          <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      {days > 0 && <p className="text-xs text-blue-600 font-medium -mt-2">📅 {days} jour{days > 1 ? 's' : ''}</p>}

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Type de vol</label>
        <div className="flex gap-2">
          {(['aller-retour', 'aller-simple', 'multidestinations'] as FlightType[]).map(ft => (
            <button key={ft} type="button" onClick={() => setFlightType(ft)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                flightType === ft ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}>
              {FLIGHT_TYPE_LABELS[ft]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1.5">Statut</label>
        <div className="flex gap-2">
          {(['planned', 'confirmed', 'done'] as Trip['status'][]).map(s => (
            <button key={s} type="button" onClick={() => setStatus(s)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                status === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'
              }`}>
              {TRIP_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {users.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Voyageurs</label>
          <div className="flex gap-2 flex-wrap">
            {users.map(u => (
              <button key={u.id} type="button" onClick={() => toggleUser(u.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedUserIds.includes(u.id) ? 'text-white border-transparent' : 'bg-white text-slate-600 border-slate-200'
                }`}
                style={selectedUserIds.includes(u.id) ? { backgroundColor: u.color, borderColor: u.color } : {}}>
                <span>{u.emoji}</span> {u.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          placeholder="Hôtel, numéro de vol…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Annuler</button>
        <button type="submit" className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
          {initial ? 'Modifier' : 'Créer le voyage'}
        </button>
      </div>
    </form>
  )
}

const STATUS_STYLES: Record<Trip['status'], string> = {
  planned: 'bg-slate-100 text-slate-600',
  confirmed: 'bg-green-100 text-green-700',
  done: 'bg-slate-100 text-slate-400',
}

export default function VoyagesPage() {
  const { trips, users, addTrip, updateTrip, deleteTrip } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)

  const upcoming = useMemo(() =>
    trips.filter(t => t.status !== 'done').sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [trips]
  )
  const past = useMemo(() =>
    trips.filter(t => t.status === 'done').sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [trips]
  )

  const daysUntil = (dateStr: string) => differenceInDays(parseISO(dateStr), new Date())

  const TripCard = ({ trip }: { trip: Trip }) => {
    const until = daysUntil(trip.startDate)
    const isPast = trip.status === 'done'

    return (
      <div className={`bg-white rounded-2xl border p-4 shadow-sm ${isPast ? 'opacity-60 border-slate-100' : 'border-slate-200'}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">✈️</span>
            <div>
              <h3 className="font-bold text-slate-800 text-base">{trip.destination}</h3>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[trip.status]}`}>
                {TRIP_STATUS_LABELS[trip.status]}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => { setEditingTrip(trip); setModalOpen(true) }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
              <Edit3 size={14} />
            </button>
            <button onClick={() => deleteTrip(trip.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar size={13} className="text-slate-400" />
            <span>{format(parseISO(trip.startDate), 'd MMM', { locale: fr })} → {format(parseISO(trip.endDate), 'd MMM yyyy', { locale: fr })}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Clock size={13} className="text-slate-400" />
            <span>{trip.days} jour{trip.days > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Plane size={13} className="text-slate-400" />
            <span>{FLIGHT_TYPE_LABELS[trip.flightType]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-slate-400" />
            <UserPills userIds={trip.userIds} users={users} />
          </div>
        </div>

        {trip.notes && (
          <p className="mt-2 text-xs text-slate-400 italic border-t border-slate-50 pt-2">{trip.notes}</p>
        )}

        {!isPast && until >= 0 && (
          <div className={`mt-3 text-center text-xs font-semibold py-1.5 rounded-lg ${
            until === 0 ? 'bg-green-100 text-green-700' :
            until <= 7 ? 'bg-orange-100 text-orange-700' :
            'bg-blue-50 text-blue-600'
          }`}>
            {until === 0 ? "C'est aujourd'hui !" : `Dans ${until} jour${until > 1 ? 's' : ''}`}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Voyages" />

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Stats */}
        {upcoming.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white mb-6 shadow-lg">
            <div className="text-xs opacity-80 mb-1">Prochain voyage</div>
            <div className="text-xl font-bold">{upcoming[0].destination}</div>
            <div className="text-sm opacity-90 mt-0.5">
              {format(parseISO(upcoming[0].startDate), 'd MMMM yyyy', { locale: fr })}
              {' · '}{daysUntil(upcoming[0].startDate) === 0 ? "Aujourd'hui !" : `Dans ${daysUntil(upcoming[0].startDate)} jours`}
            </div>
          </div>
        )}

        <button
          onClick={() => { setEditingTrip(null); setModalOpen(true) }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-medium text-sm hover:border-blue-400 hover:bg-blue-50 transition-colors mb-6"
        >
          <Plus size={16} /> Nouveau voyage
        </button>

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <div className="mb-6">
            <h2 className="font-semibold text-slate-700 text-sm mb-3">À venir ({upcoming.length})</h2>
            <div className="space-y-3">
              {upcoming.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          </div>
        )}

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="font-semibold text-slate-400 text-sm mb-3">Passés ({past.length})</h2>
            <div className="space-y-3">
              {past.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          </div>
        )}

        {trips.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-3">✈️</div>
            <p className="text-sm">Aucun voyage planifié</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editingTrip ? 'Modifier le voyage' : 'Nouveau voyage'} onClose={() => { setModalOpen(false); setEditingTrip(null) }} size="lg">
          <TripForm
            initial={editingTrip ?? undefined}
            onSave={data => {
              if (editingTrip) updateTrip(editingTrip.id, data)
              else addTrip(data)
            }}
            onClose={() => { setModalOpen(false); setEditingTrip(null) }}
          />
        </Modal>
      )}
    </div>
  )
}
