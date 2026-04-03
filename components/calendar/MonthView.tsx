'use client'
import { useMemo } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, format, parseISO,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarEvent } from '@/lib/types'
import { getWeekType, toDateString } from '@/lib/utils'
import EventCard from './EventCard'

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

interface Props {
  currentDate: Date
  events: CalendarEvent[]
  onDayClick: (dateStr: string) => void
  onEventClick: (event: CalendarEvent) => void
}

export default function MonthView({ currentDate, events, onDayClick, onEventClick }: Props) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    for (const ev of events) {
      if (!map[ev.date]) map[ev.date] = []
      map[ev.date].push(ev)
    }
    return map
  }, [events])

  return (
    <div className="flex-1 flex flex-col">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-white sticky top-0 z-10">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-slate-500 py-2">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const ds = toDateString(day)
          const dayEvents = eventsByDate[ds] ?? []
          const inMonth = isSameMonth(day, currentDate)
          const today = isToday(day)
          const wt = getWeekType(day)
          const isWeekStart = day.getDay() === 1 // Monday

          return (
            <div
              key={ds}
              className={`min-h-[110px] border-b border-r border-slate-100 p-1 flex flex-col gap-0.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                !inMonth ? 'opacity-40' : ''
              } ${idx % 7 === 0 ? 'border-l' : ''}`}
              onClick={() => onDayClick(ds)}
            >
              <div className="flex items-start justify-between mb-0.5">
                <span
                  className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                    today
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {isWeekStart && inMonth && (
                  <span className={`text-xs font-bold px-1 rounded ${
                    wt === 'A' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {wt}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                {dayEvents.slice(0, 3).map(ev => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    compact
                    onClick={() => onEventClick(ev)}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-xs text-slate-400 pl-1">+{dayEvents.length - 3} autres</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
