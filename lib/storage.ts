import { CalendarEvent, Car, CarReservation, Task, Trip, User } from './types'
import { DEFAULT_CARS, DEFAULT_USERS } from './constants'

// Generic helpers
function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

// --- Users ---
export const loadUsers = (): User[] => load<User[]>('fam:users', DEFAULT_USERS)
export const saveUsers = (users: User[]) => save('fam:users', users)

// --- Cars ---
export const loadCars = (): Car[] => load<Car[]>('fam:cars', DEFAULT_CARS)
export const saveCars = (cars: Car[]) => save('fam:cars', cars)

// --- Events ---
export const loadEvents = (): CalendarEvent[] => load<CalendarEvent[]>('fam:events', [])
export const saveEvents = (events: CalendarEvent[]) => save('fam:events', events)

// --- Car Reservations ---
export const loadReservations = (): CarReservation[] => load<CarReservation[]>('fam:reservations', [])
export const saveReservations = (res: CarReservation[]) => save('fam:reservations', res)

// --- Tasks ---
export const loadTasks = (): Task[] => load<Task[]>('fam:tasks', [])
export const saveTasks = (tasks: Task[]) => save('fam:tasks', tasks)

// --- Trips ---
export const loadTrips = (): Trip[] => load<Trip[]>('fam:trips', [])
export const saveTrips = (trips: Trip[]) => save('fam:trips', trips)
