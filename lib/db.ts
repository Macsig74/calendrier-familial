import { supabase } from './supabase'
import { User, Car, CalendarEvent, CarReservation, Task, Trip } from './types'

// ─── Row types (snake_case DB columns) ───────────────────────────────────────

type DbUser = { id: string; name: string; color: string; emoji: string; can_drive: boolean }
type DbCar  = { id: string; name: string; model: string; color: string; emoji: string }
type DbEvent = {
  id: string; title: string; category: string; date: string
  start_time: string | null; end_time: string | null
  user_ids: string[]; week_type: string; notification: boolean; notes: string | null
}
type DbReservation = {
  id: string; car_id: string; user_id: string; date: string
  return_date: string | null; destination: string; notes: string | null
}
type DbTask = {
  id: string; title: string; assigned_user_ids: string[]
  completed_by_user_id: string | null; completed_at: string | null
  status: string; date: string; category: string | null; notes: string | null
}
type DbTrip = {
  id: string; destination: string; days: number; flight_type: string
  start_date: string; end_date: string; user_ids: string[]
  notes: string | null; status: string
}

// ─── Mappers (exported for realtime use) ─────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapUserRow  = (r: any): User  => ({ id: r.id, name: r.name, color: r.color, emoji: r.emoji, canDrive: r.can_drive })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapCarRow   = (r: any): Car   => ({ id: r.id, name: r.name, model: r.model, color: r.color, emoji: r.emoji })
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapEventRow = (r: any): CalendarEvent => ({
  id: r.id, title: r.title, category: r.category as CalendarEvent['category'],
  date: r.date, startTime: r.start_time ?? undefined, endTime: r.end_time ?? undefined,
  userIds: r.user_ids, weekType: r.week_type as CalendarEvent['weekType'],
  notification: r.notification, notes: r.notes ?? undefined,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapReservationRow = (r: any): CarReservation => ({
  id: r.id, carId: r.car_id, userId: r.user_id, date: r.date,
  returnDate: r.return_date ?? undefined, destination: r.destination, notes: r.notes ?? undefined,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapTaskRow = (r: any): Task => ({
  id: r.id, title: r.title, assignedUserIds: r.assigned_user_ids,
  completedByUserId: r.completed_by_user_id ?? undefined, completedAt: r.completed_at ?? undefined,
  status: r.status as Task['status'], date: r.date,
  category: r.category as Task['category'] ?? undefined, notes: r.notes ?? undefined,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapTripRow = (r: any): Trip => ({
  id: r.id, destination: r.destination, days: r.days, flightType: r.flight_type as Trip['flightType'],
  startDate: r.start_date, endDate: r.end_date, userIds: r.user_ids,
  notes: r.notes ?? undefined, status: r.status as Trip['status'],
})

// Internal aliases
const mapUser        = mapUserRow
const mapCar         = mapCarRow
const mapEvent       = mapEventRow
const mapReservation = mapReservationRow
const mapTask        = mapTaskRow
const mapTrip        = mapTripRow

// ─── Users ───────────────────────────────────────────────────────────────────

export async function dbFetchUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*').order('created_at')
  if (error) throw error
  return (data as DbUser[]).map(mapUser)
}
export async function dbInsertUser(u: User) {
  await supabase.from('users').insert({ id: u.id, name: u.name, color: u.color, emoji: u.emoji, can_drive: u.canDrive ?? true })
}
export async function dbUpdateUser(id: string, patch: Partial<User>) {
  const p: Record<string, unknown> = {}
  if (patch.name     !== undefined) p.name      = patch.name
  if (patch.color    !== undefined) p.color     = patch.color
  if (patch.emoji    !== undefined) p.emoji     = patch.emoji
  if (patch.canDrive !== undefined) p.can_drive = patch.canDrive
  await supabase.from('users').update(p).eq('id', id)
}
export async function dbDeleteUser(id: string) {
  await supabase.from('users').delete().eq('id', id)
}

// ─── Cars ────────────────────────────────────────────────────────────────────

export async function dbFetchCars(): Promise<Car[]> {
  const { data, error } = await supabase.from('cars').select('*').order('created_at')
  if (error) throw error
  return (data as DbCar[]).map(mapCar)
}
export async function dbInsertCar(c: Car) {
  await supabase.from('cars').insert({ id: c.id, name: c.name, model: c.model, color: c.color, emoji: c.emoji })
}
export async function dbUpdateCar(id: string, patch: Partial<Car>) {
  const p: Record<string, unknown> = {}
  if (patch.name  !== undefined) p.name  = patch.name
  if (patch.model !== undefined) p.model = patch.model
  if (patch.color !== undefined) p.color = patch.color
  if (patch.emoji !== undefined) p.emoji = patch.emoji
  await supabase.from('cars').update(p).eq('id', id)
}
export async function dbDeleteCar(id: string) {
  await supabase.from('cars').delete().eq('id', id)
}

// ─── Events ──────────────────────────────────────────────────────────────────

export async function dbFetchEvents(): Promise<CalendarEvent[]> {
  const { data, error } = await supabase.from('events').select('*').order('date')
  if (error) throw error
  return (data as DbEvent[]).map(mapEvent)
}
export async function dbInsertEvent(e: CalendarEvent) {
  await supabase.from('events').insert({
    id: e.id, title: e.title, category: e.category, date: e.date,
    start_time: e.startTime ?? null, end_time: e.endTime ?? null,
    user_ids: e.userIds, week_type: e.weekType, notification: e.notification, notes: e.notes ?? null,
  })
}
export async function dbUpdateEvent(id: string, patch: Partial<CalendarEvent>) {
  const p: Record<string, unknown> = {}
  if (patch.title        !== undefined) p.title        = patch.title
  if (patch.category     !== undefined) p.category     = patch.category
  if (patch.date         !== undefined) p.date         = patch.date
  if (patch.startTime    !== undefined) p.start_time   = patch.startTime
  if (patch.endTime      !== undefined) p.end_time     = patch.endTime
  if (patch.userIds      !== undefined) p.user_ids     = patch.userIds
  if (patch.weekType     !== undefined) p.week_type    = patch.weekType
  if (patch.notification !== undefined) p.notification = patch.notification
  if (patch.notes        !== undefined) p.notes        = patch.notes
  await supabase.from('events').update(p).eq('id', id)
}
export async function dbDeleteEvent(id: string) {
  await supabase.from('events').delete().eq('id', id)
}

// ─── Car Reservations ────────────────────────────────────────────────────────

export async function dbFetchReservations(): Promise<CarReservation[]> {
  const { data, error } = await supabase.from('car_reservations').select('*').order('date')
  if (error) throw error
  return (data as DbReservation[]).map(mapReservation)
}
export async function dbInsertReservation(r: CarReservation) {
  await supabase.from('car_reservations').insert({
    id: r.id, car_id: r.carId, user_id: r.userId, date: r.date,
    return_date: r.returnDate ?? null, destination: r.destination, notes: r.notes ?? null,
  })
}
export async function dbDeleteReservation(id: string) {
  await supabase.from('car_reservations').delete().eq('id', id)
}
export async function dbUpdateReservation(id: string, patch: Partial<CarReservation>) {
  const p: Record<string, unknown> = {}
  if (patch.carId       !== undefined) p.car_id      = patch.carId
  if (patch.userId      !== undefined) p.user_id     = patch.userId
  if (patch.date        !== undefined) p.date        = patch.date
  if (patch.returnDate  !== undefined) p.return_date = patch.returnDate
  if (patch.destination !== undefined) p.destination = patch.destination
  if (patch.notes       !== undefined) p.notes       = patch.notes
  await supabase.from('car_reservations').update(p).eq('id', id)
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function dbFetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*').order('date')
  if (error) throw error
  return (data as DbTask[]).map(mapTask)
}
export async function dbInsertTask(t: Task) {
  await supabase.from('tasks').insert({
    id: t.id, title: t.title, assigned_user_ids: t.assignedUserIds,
    completed_by_user_id: t.completedByUserId ?? null, completed_at: t.completedAt ?? null,
    status: t.status, date: t.date, category: t.category ?? null, notes: t.notes ?? null,
  })
}
export async function dbUpdateTask(id: string, patch: Partial<Task>) {
  const p: Record<string, unknown> = {}
  if (patch.title               !== undefined) p.title                 = patch.title
  if (patch.assignedUserIds     !== undefined) p.assigned_user_ids     = patch.assignedUserIds
  if (patch.completedByUserId   !== undefined) p.completed_by_user_id  = patch.completedByUserId
  if (patch.completedAt         !== undefined) p.completed_at          = patch.completedAt
  if (patch.status              !== undefined) p.status                = patch.status
  if (patch.date                !== undefined) p.date                  = patch.date
  if (patch.category            !== undefined) p.category              = patch.category
  if (patch.notes               !== undefined) p.notes                 = patch.notes
  await supabase.from('tasks').update(p).eq('id', id)
}
export async function dbDeleteTask(id: string) {
  await supabase.from('tasks').delete().eq('id', id)
}

// ─── Trips ───────────────────────────────────────────────────────────────────

export async function dbFetchTrips(): Promise<Trip[]> {
  const { data, error } = await supabase.from('trips').select('*').order('start_date')
  if (error) throw error
  return (data as DbTrip[]).map(mapTrip)
}
export async function dbInsertTrip(t: Trip) {
  await supabase.from('trips').insert({
    id: t.id, destination: t.destination, days: t.days, flight_type: t.flightType,
    start_date: t.startDate, end_date: t.endDate, user_ids: t.userIds,
    notes: t.notes ?? null, status: t.status,
  })
}
export async function dbUpdateTrip(id: string, patch: Partial<Trip>) {
  const p: Record<string, unknown> = {}
  if (patch.destination !== undefined) p.destination = patch.destination
  if (patch.days        !== undefined) p.days        = patch.days
  if (patch.flightType  !== undefined) p.flight_type = patch.flightType
  if (patch.startDate   !== undefined) p.start_date  = patch.startDate
  if (patch.endDate     !== undefined) p.end_date    = patch.endDate
  if (patch.userIds     !== undefined) p.user_ids    = patch.userIds
  if (patch.notes       !== undefined) p.notes       = patch.notes
  if (patch.status      !== undefined) p.status      = patch.status
  await supabase.from('trips').update(p).eq('id', id)
}
export async function dbDeleteTrip(id: string) {
  await supabase.from('trips').delete().eq('id', id)
}
