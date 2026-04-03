import { startOfWeek, differenceInCalendarWeeks, parseISO, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { WEEK_A_REFERENCE } from './constants'

/** Returns 'A' or 'B' for any given date based on a fixed reference Monday */
export function getWeekType(date: Date): 'A' | 'B' {
  const ref = parseISO(WEEK_A_REFERENCE)
  const refMonday = startOfWeek(ref, { weekStartsOn: 1 })
  const targetMonday = startOfWeek(date, { weekStartsOn: 1 })
  const diff = differenceInCalendarWeeks(targetMonday, refMonday, { weekStartsOn: 1 })
  return diff % 2 === 0 ? 'A' : 'B'
}

/** Format a date to YYYY-MM-DD */
export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

/** Generate a simple unique id */
export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Format date as "lundi 3 avril" */
export function formatDayFull(date: Date): string {
  return format(date, 'EEEE d MMMM', { locale: fr })
}

/** Format date as "3 avr." */
export function formatDayShort(date: Date): string {
  return format(date, 'd MMM', { locale: fr })
}

/** Format date as "avril 2025" */
export function formatMonthYear(date: Date): string {
  return format(date, 'MMMM yyyy', { locale: fr })
}
