import { CategoryId } from './types'

export interface Category {
  id: CategoryId
  label: string
  color: string       // bg color (Tailwind arbitrary)
  textColor: string   // text color
  borderColor: string
  hex: string
}

export const CATEGORIES: Category[] = [
  { id: 'menage',    label: 'Ménage',       color: 'bg-red-100',     textColor: 'text-red-700',     borderColor: 'border-red-300',     hex: '#ef4444' },
  { id: 'repas',     label: 'Repas',        color: 'bg-teal-100',    textColor: 'text-teal-700',    borderColor: 'border-teal-300',    hex: '#14b8a6' },
  { id: 'activites', label: 'Activités',    color: 'bg-yellow-100',  textColor: 'text-yellow-700',  borderColor: 'border-yellow-300',  hex: '#eab308' },
  { id: 'etude',     label: 'Étude',        color: 'bg-green-100',   textColor: 'text-green-700',   borderColor: 'border-green-300',   hex: '#22c55e' },
  { id: 'rdv',       label: 'Rendez-vous',  color: 'bg-cyan-100',    textColor: 'text-cyan-700',    borderColor: 'border-cyan-300',    hex: '#0891b2' },
  { id: 'sorties',   label: 'Sorties',      color: 'bg-pink-100',    textColor: 'text-pink-700',    borderColor: 'border-pink-300',    hex: '#ec4899' },
  { id: 'dormir',    label: 'Dormir ailleurs', color: 'bg-violet-100', textColor: 'text-violet-700', borderColor: 'border-violet-300', hex: '#8b5cf6' },
  { id: 'art',       label: "Centre d'art", color: 'bg-indigo-100',  textColor: 'text-indigo-700',  borderColor: 'border-indigo-300',  hex: '#818cf8' },
  { id: 'diner',     label: 'Dîner',        color: 'bg-rose-100',    textColor: 'text-rose-700',    borderColor: 'border-rose-300',    hex: '#fb7185' },
  { id: 'autre',     label: 'Autre',        color: 'bg-gray-100',    textColor: 'text-gray-700',    borderColor: 'border-gray-300',    hex: '#6b7280' },
]

export const getCategoryById = (id: CategoryId): Category =>
  CATEGORIES.find(c => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1]

export const DEFAULT_USERS = [
  { id: 'u1', name: 'Mariedo', color: '#ec4899', emoji: '👩', canDrive: true  },
  { id: 'u2', name: 'Olivier', color: '#3b82f6', emoji: '👨', canDrive: true  },
  { id: 'u3', name: 'Gaspard', color: '#f97316', emoji: '🧑', canDrive: true  },
  { id: 'u4', name: 'Arthur',  color: '#22c55e', emoji: '👦', canDrive: false },
]

export const DEFAULT_CARS = [
  { id: 'c1', name: 'La grande', model: '', color: '#e2e8f0', emoji: '🚙' },
  { id: 'c2', name: 'La petite', model: '', color: '#fde68a', emoji: '🚗' },
]

export const WEEK_A_REFERENCE = '2024-01-01' // Monday of a known Week A

export const FLIGHT_TYPE_LABELS: Record<string, string> = {
  'aller-retour':       'Aller-retour',
  'aller-simple':       'Aller simple',
  'multidestinations':  'Multidestinations',
}

export const TRIP_STATUS_LABELS: Record<string, string> = {
  planned:   'Prévu',
  confirmed: 'Confirmé',
  done:      'Passé',
}
