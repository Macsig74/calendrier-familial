'use client'
import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAppStore } from '@/hooks/StoreContext'
import { User, Car } from '@/lib/types'
import { uid } from '@/lib/utils'

const EMOJIS = ['👨', '👩', '🧒', '👦', '👧', '🧑', '👴', '👵', '🧓', '🐶', '🐱']
const COLORS = ['#3b82f6', '#ec4899', '#22c55e', '#f97316', '#8b5cf6', '#14b8a6', '#ef4444', '#eab308', '#6366f1']
const CAR_EMOJIS = ['🚗', '⚡', '🚙', '🏎️', '🚐']

function UserEditor({ user, onSave, onCancel }: { user?: Partial<User>; onSave: (u: Omit<User, 'id'>) => void; onCancel: () => void }) {
  const [name, setName] = useState(user?.name ?? '')
  const [color, setColor] = useState(user?.color ?? COLORS[0])
  const [emoji, setEmoji] = useState(user?.emoji ?? EMOJIS[0])
  const [canDrive, setCanDrive] = useState(user?.canDrive ?? true)

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), color, emoji, canDrive })
  }

  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-3">
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Prénom"
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
      <div>
        <div className="text-xs font-medium text-slate-500 mb-1.5">Emoji</div>
        <div className="flex gap-1.5 flex-wrap">
          {EMOJIS.map(e => (
            <button key={e} type="button" onClick={() => setEmoji(e)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${emoji === e ? 'bg-slate-900 scale-110' : 'bg-white border border-slate-200 hover:border-slate-300'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-xs font-medium text-slate-500 mb-1.5">Couleur</div>
        <div className="flex gap-1.5 flex-wrap">
          {COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">Peut conduire</span>
        <button type="button" onClick={() => setCanDrive(!canDrive)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            canDrive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
          {canDrive ? '🚗 Oui' : '✗ Non'}
        </button>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1">
          <X size={13} /> Annuler
        </button>
        <button onClick={handleSave} className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center justify-center gap-1">
          <Check size={13} /> Enregistrer
        </button>
      </div>
    </div>
  )
}

function CarEditor({ car, onSave, onCancel }: { car?: Partial<Car>; onSave: (c: Omit<Car, 'id'>) => void; onCancel: () => void }) {
  const [name, setName] = useState(car?.name ?? '')
  const [model, setModel] = useState(car?.model ?? '')
  const [emoji, setEmoji] = useState(car?.emoji ?? CAR_EMOJIS[0])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), model: model.trim(), emoji, color: '#e2e8f0' })
  }

  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nom (Tesla)"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
        <input type="text" value={model} onChange={e => setModel(e.target.value)} placeholder="Modèle (Model 3)"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
      </div>
      <div>
        <div className="text-xs font-medium text-slate-500 mb-1.5">Emoji</div>
        <div className="flex gap-1.5">
          {CAR_EMOJIS.map(e => (
            <button key={e} type="button" onClick={() => setEmoji(e)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all ${emoji === e ? 'bg-slate-900 scale-110' : 'bg-white border border-slate-200'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-1">
          <X size={13} /> Annuler
        </button>
        <button onClick={handleSave} className="flex-1 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 flex items-center justify-center gap-1">
          <Check size={13} /> Enregistrer
        </button>
      </div>
    </div>
  )
}

export default function ParametresPage() {
  const { users, addUser, updateUser, deleteUser, cars, addCar, updateCar, deleteCar } = useAppStore()
  const [addingUser, setAddingUser] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [addingCar, setAddingCar] = useState(false)
  const [editingCarId, setEditingCarId] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Paramètres" />

      <div className="flex-1 p-4 max-w-xl mx-auto w-full space-y-8">
        {/* Family members */}
        <section>
          <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-lg">👨‍👩‍👧‍👦</span> Membres de la famille
          </h2>
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id}>
                {editingUserId === user.id ? (
                  <UserEditor
                    user={user}
                    onSave={data => { updateUser(user.id, data); setEditingUserId(null) }}
                    onCancel={() => setEditingUserId(null)}
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ backgroundColor: user.color }}>
                      {user.emoji}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-slate-800">{user.name}</span>
                      {user.canDrive && <span className="ml-2 text-xs text-green-600">🚗</span>}
                    </div>
                    <button onClick={() => setEditingUserId(user.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteUser(user.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {addingUser ? (
              <UserEditor
                onSave={data => { addUser(data); setAddingUser(false) }}
                onCancel={() => setAddingUser(false)}
              />
            ) : (
              <button onClick={() => setAddingUser(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Plus size={15} /> Ajouter un membre
              </button>
            )}
          </div>
        </section>

        {/* Cars */}
        <section>
          <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-lg">🚗</span> Voitures
          </h2>
          <div className="space-y-2">
            {cars.map(car => (
              <div key={car.id}>
                {editingCarId === car.id ? (
                  <CarEditor
                    car={car}
                    onSave={data => { updateCar(car.id, data); setEditingCarId(null) }}
                    onCancel={() => setEditingCarId(null)}
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
                    <span className="text-2xl">{car.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{car.name}</div>
                      <div className="text-xs text-slate-400">{car.model}</div>
                    </div>
                    <button onClick={() => setEditingCarId(car.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deleteCar(car.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {addingCar ? (
              <CarEditor
                onSave={data => { addCar(data); setAddingCar(false) }}
                onCancel={() => setAddingCar(false)}
              />
            ) : (
              <button onClick={() => setAddingCar(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 text-sm hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Plus size={15} /> Ajouter une voiture
              </button>
            )}
          </div>
        </section>

        {/* Data reset */}
        <section>
          <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <span className="text-lg">⚙️</span> Données
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs text-slate-500">Toutes les données sont stockées localement dans votre navigateur.</p>
            <button
              onClick={() => {
                if (confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) {
                  localStorage.clear()
                  window.location.reload()
                }
              }}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Réinitialiser toutes les données →
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
