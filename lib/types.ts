export type CategoryId =
  | 'menage'
  | 'repas'
  | 'activites'
  | 'etude'
  | 'rdv'
  | 'sorties'
  | 'dormir'
  | 'art'
  | 'diner'
  | 'autre'

export type WeekType = 'A' | 'B' | 'both'

export type FlightType = 'aller-retour' | 'aller-simple' | 'multidestinations'

export interface User {
  id: string
  name: string
  color: string
  emoji: string
  canDrive?: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  category: CategoryId
  date: string // ISO date string YYYY-MM-DD
  startTime?: string // HH:mm
  endTime?: string // HH:mm
  userIds: string[]
  weekType: WeekType
  notification: boolean
  notes?: string
}

export interface Car {
  id: string
  name: string
  model: string
  color: string
  emoji: string
}

export interface CarReservation {
  id: string
  carId: string
  userId: string
  date: string // YYYY-MM-DD
  destination: string
  returnDate?: string // YYYY-MM-DD
  notes?: string
}

export interface Task {
  id: string
  title: string
  assignedUserIds: string[]
  completedByUserId?: string
  completedAt?: string
  status: 'pending' | 'done'
  date: string // YYYY-MM-DD
  category?: CategoryId
  notes?: string
}

export interface Trip {
  id: string
  destination: string
  days: number
  flightType: FlightType
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  userIds: string[]
  notes?: string
  status: 'planned' | 'confirmed' | 'done'
}
