'use client'
import { useState, useEffect, useCallback } from 'react'
import { CalendarEvent, Car, CarReservation, Task, Trip, User } from '@/lib/types'
import { DEFAULT_CARS, DEFAULT_USERS } from '@/lib/constants'
import { uid } from '@/lib/utils'
import {
  dbFetchUsers, dbInsertUser, dbUpdateUser, dbDeleteUser,
  dbFetchCars, dbInsertCar, dbUpdateCar, dbDeleteCar,
  dbFetchEvents, dbInsertEvent, dbUpdateEvent, dbDeleteEvent,
  dbFetchReservations, dbInsertReservation, dbUpdateReservation, dbDeleteReservation,
  dbFetchTasks, dbInsertTask, dbUpdateTask, dbDeleteTask,
  dbFetchTrips, dbInsertTrip, dbUpdateTrip, dbDeleteTrip,
} from '@/lib/db'

export function useStore() {
  const [users, setUsers] = useState<User[]>([])
  const [cars, setCars] = useState<Car[]>([])
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [reservations, setReservations] = useState<CarReservation[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [loaded, setLoaded] = useState(false)

  // Initial load — fetch all data from Supabase; seed defaults if first run
  useEffect(() => {
    async function init() {
      try {
        const [dbUsers, dbCars, dbEvents, dbRes, dbTasks, dbTrips] = await Promise.all([
          dbFetchUsers(), dbFetchCars(), dbFetchEvents(),
          dbFetchReservations(), dbFetchTasks(), dbFetchTrips(),
        ])

        // Seed default users if DB is empty
        if (dbUsers.length === 0) {
          const defaults = DEFAULT_USERS.map(u => ({ ...u })) as User[]
          await Promise.all(defaults.map(dbInsertUser))
          setUsers(defaults)
        } else {
          setUsers(dbUsers)
        }

        // Seed default cars if DB is empty
        if (dbCars.length === 0) {
          const defaults = DEFAULT_CARS.map(c => ({ ...c })) as Car[]
          await Promise.all(defaults.map(dbInsertCar))
          setCars(defaults)
        } else {
          setCars(dbCars)
        }

        setEvents(dbEvents)
        setReservations(dbRes)
        setTasks(dbTasks)
        setTrips(dbTrips)
      } catch (err) {
        console.error('Supabase load error:', err)
      } finally {
        setLoaded(true)
      }
    }
    init()
  }, [])

  // ─── Users ─────────────────────────────────────────────────────────────────
  const addUser = useCallback((u: Omit<User, 'id'>) => {
    const newUser: User = { ...u, id: uid() }
    setUsers(prev => [...prev, newUser])
    dbInsertUser(newUser).catch(console.error)
  }, [])

  const updateUser = useCallback((id: string, patch: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u))
    dbUpdateUser(id, patch).catch(console.error)
  }, [])

  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    dbDeleteUser(id).catch(console.error)
  }, [])

  // ─── Cars ──────────────────────────────────────────────────────────────────
  const addCar = useCallback((c: Omit<Car, 'id'>) => {
    const newCar: Car = { ...c, id: uid() }
    setCars(prev => [...prev, newCar])
    dbInsertCar(newCar).catch(console.error)
  }, [])

  const updateCar = useCallback((id: string, patch: Partial<Car>) => {
    setCars(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
    dbUpdateCar(id, patch).catch(console.error)
  }, [])

  const deleteCar = useCallback((id: string) => {
    setCars(prev => prev.filter(c => c.id !== id))
    dbDeleteCar(id).catch(console.error)
  }, [])

  // ─── Events ────────────────────────────────────────────────────────────────
  const addEvent = useCallback((e: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = { ...e, id: uid() }
    setEvents(prev => [...prev, newEvent])
    dbInsertEvent(newEvent).catch(console.error)
  }, [])

  const updateEvent = useCallback((id: string, patch: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
    dbUpdateEvent(id, patch).catch(console.error)
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    dbDeleteEvent(id).catch(console.error)
  }, [])

  // ─── Reservations ──────────────────────────────────────────────────────────
  const addReservation = useCallback((r: Omit<CarReservation, 'id'>) => {
    const newRes: CarReservation = { ...r, id: uid() }
    setReservations(prev => [...prev, newRes])
    dbInsertReservation(newRes).catch(console.error)
  }, [])

  const updateReservation = useCallback((id: string, patch: Partial<CarReservation>) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))
    dbUpdateReservation(id, patch).catch(console.error)
  }, [])

  const deleteReservation = useCallback((id: string) => {
    setReservations(prev => prev.filter(r => r.id !== id))
    dbDeleteReservation(id).catch(console.error)
  }, [])

  // ─── Tasks ─────────────────────────────────────────────────────────────────
  const addTask = useCallback((t: Omit<Task, 'id'>) => {
    const newTask: Task = { ...t, id: uid() }
    setTasks(prev => [...prev, newTask])
    dbInsertTask(newTask).catch(console.error)

    if (t.assignedUserIds?.length) {
      fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: t.assignedUserIds,
          title: '📋 Nouvelle tâche',
          body: t.title,
          url: '/taches',
        }),
      }).catch(console.error)
    }
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
    dbUpdateTask(id, patch).catch(console.error)
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    dbDeleteTask(id).catch(console.error)
  }, [])

  // ─── Trips ─────────────────────────────────────────────────────────────────
  const addTrip = useCallback((t: Omit<Trip, 'id'>) => {
    const newTrip: Trip = { ...t, id: uid() }
    setTrips(prev => [...prev, newTrip])
    dbInsertTrip(newTrip).catch(console.error)
  }, [])

  const updateTrip = useCallback((id: string, patch: Partial<Trip>) => {
    setTrips(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
    dbUpdateTrip(id, patch).catch(console.error)
  }, [])

  const deleteTrip = useCallback((id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id))
    dbDeleteTrip(id).catch(console.error)
  }, [])

  return {
    loaded,
    users, addUser, updateUser, deleteUser,
    cars, addCar, updateCar, deleteCar,
    events, addEvent, updateEvent, deleteEvent,
    reservations, addReservation, updateReservation, deleteReservation,
    tasks, addTask, updateTask, deleteTask,
    trips, addTrip, updateTrip, deleteTrip,
  }
}

export type Store = ReturnType<typeof useStore>
