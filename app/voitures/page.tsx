'use client'
import { useState, useMemo } from 'react'
import { format, parseISO, isFuture, isToday } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Plus, Car as CarIcon, MapPin, User, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import Modal from '@/components/ui/Modal'
import { useAppStore } from '@/hooks/StoreContext'
import { Car, CarReservation } from '@/lib/types'
import { uid } from '@/lib/utils'

function ReservationForm({
  cars, users,
  initial, onSave, onClose,
}: {
  cars: Car[]
  users: ReturnType<typeof useAppStore>['users']
  initial?: Partial<CarReservation>
  onSave: (r: Omit<CarReservation, 'id'>) => void
  onClose: () => void
}) {
  const [carId, setCarId] = useState(initial?.carId ?? cars[0]?.id ?? '')
  const [userId, setUserId] = useState(initial?.userId ?? users.find(u => u.canDrive !== false)?.id ?? '')
  const [date, setDate] = useState(initial?.date ?? '')
  const [returnDate, setReturnDate] = useState(initial?.returnDate ?? '')
  const [destination, setDestination] = useState(initial?.destination ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!carId || !userId || !date || !destination.trim()) return
    onSave({ carId, userId, date, returnDate: returnDate || undefined, destination: destination.trim(), notes: notes || undefined })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Car */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Voiture</label>
        <div className="flex gap-2 flex-wrap">
          {cars.map(c => (
            <button key={c.id} type="button" onClick={() => setCarId(c.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                carId === c.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}>
              <span>{c.emoji}</span> {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Driver */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Conducteur</label>
        <div className="flex gap-2 flex-wrap">
          {users.filter(u => u.canDrive !== false).map(u => (
            <button key={u.id} type="button" onClick={() => setUserId(u.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                userId === u.id ? 'text-white border-transparent' : 'bg-white text-slate-700 border-slate-200'
              }`}
              style={userId === u.id ? { backgroundColor: u.color, borderColor: u.color } : {}}>
              <span>{u.emoji}</span> {u.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Date départ *</label>
          <input type="date" required value={date} onChange={e => setDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Retour</label>
          <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} min={date}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {/* Destination */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Destination *</label>
        <input type="text" required value={destination} onChange={e => setDestination(e.target.value)}
          placeholder="Ex: Paris, Supermarché…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Ex: Plein d'essence, révision…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Annuler</button>
        <button type="submit" className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Réserver</button>
      </div>
    </form>
  )
}

export default function VoituresPage() {
  const { cars, users, reservations, addReservation, deleteReservation } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const upcoming = useMemo(() =>
    reservations
      .filter(r => isToday(parseISO(r.date)) || isFuture(parseISO(r.date)))
      .sort((a, b) => a.date.localeCompare(b.date)),
    [reservations]
  )

  const past = useMemo(() =>
    reservations
      .filter(r => !isToday(parseISO(r.date)) && !isFuture(parseISO(r.date)))
      .sort((a, b) => b.date.localeCompare(a.date)),
    [reservations]
  )

  const getUser = (id: string) => users.find(u => u.id === id)
  const getCar = (id: string) => cars.find(c => c.id === id)

  const ReservationCard = ({ r }: { r: CarReservation }) => {
    const car = getCar(r.carId)
    const driver = getUser(r.userId)
    const past = !isToday(parseISO(r.date)) && !isFuture(parseISO(r.date))

    return (
      <div className={`flex items-start justify-between p-3 rounded-xl border ${past ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">{car?.emoji ?? '🚗'}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 text-sm">{car?.name}</span>
              {driver && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-white font-medium"
                  style={{ backgroundColor: driver.color }}>
                  {driver.emoji} {driver.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <MapPin size={11} />
              <span>{r.destination}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {format(parseISO(r.date), 'd MMM yyyy', { locale: fr })}
              {r.returnDate && ` → ${format(parseISO(r.returnDate), 'd MMM yyyy', { locale: fr })}`}
            </div>
            {r.notes && <div className="text-xs text-slate-400 mt-0.5 italic">{r.notes}</div>}
          </div>
        </div>
        <button onClick={() => deleteReservation(r.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Voitures" />

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Car Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {cars.map(car => {
            const activeRes = upcoming.filter(r => r.carId === car.id)
            return (
              <div key={car.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{car.emoji}</span>
                  <div>
                    <div className="font-bold text-slate-800">{car.name}</div>
                    <div className="text-xs text-slate-500">{car.model}</div>
                  </div>
                </div>
                {activeRes.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {activeRes.slice(0, 2).map(r => {
                      const u = getUser(r.userId)
                      return (
                        <div key={r.id} className="flex items-center gap-1.5 text-xs bg-orange-50 text-orange-700 border border-orange-100 rounded-lg px-2 py-1">
                          <span>{u?.emoji}</span>
                          <span className="font-medium">{u?.name}</span>
                          <span className="text-orange-400">·</span>
                          <span>{format(parseISO(r.date), 'd MMM', { locale: fr })}</span>
                        </div>
                      )
                    })}
                    {activeRes.length > 2 && <div className="text-xs text-slate-400">+{activeRes.length - 2} autres</div>}
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-green-600 font-medium">✓ Disponible</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add reservation */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-medium text-sm hover:border-blue-400 hover:bg-blue-50 transition-colors mb-6"
        >
          <Plus size={16} /> Nouvelle réservation
        </button>

        {/* Upcoming reservations */}
        <div className="mb-4">
          <h2 className="font-semibold text-slate-800 text-sm mb-2">À venir ({upcoming.length})</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">Aucune réservation à venir</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map(r => <ReservationCard key={r.id} r={r} />)}
            </div>
          )}
        </div>

        {/* History */}
        {past.length > 0 && (
          <div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 mb-2"
            >
              {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Historique ({past.length})
            </button>
            {showHistory && (
              <div className="space-y-2">
                {past.map(r => <ReservationCard key={r.id} r={r} />)}
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title="Réserver une voiture" onClose={() => setModalOpen(false)}>
          <ReservationForm
            cars={cars}
            users={users}
            onSave={addReservation}
            onClose={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}
