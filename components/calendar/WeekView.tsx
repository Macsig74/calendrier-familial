'use client'
import { useMemo } from 'react'
import { startOfWeek, endOfWeek, eachDayOfInterval, isToday, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarEvent } from '@/lib/types'
import { getWeekType, toDateString } from '@/lib/utils'
import EventCard from './EventCard'

interface Props {
  currentDate: Date
  events: CalendarEvent[]
  onDayClick: (dateStr: string) => void
  onEventClick: (event: CalendarEvent) => void
}

export default function WeekView({ currentDate, events, onDayClick, onEventClick }: Props) {
  const days = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    const end = endOfWeek(currentDate, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const weekType = getWeekType(days[0])

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
      {/* Week header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3">
        <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
          weekType === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
        }`}>
          Semaine {weekType}
        </span>
        <span className="text-sm text-slate-500">
          {format(days[0], 'd MMM', { locale: fr })} – {format(days[6], 'd MMM yyyy', { locale: fr })}
        </span>
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 divide-x divide-slate-100">
        {days.map(day => {
          const ds = toDateString(day)
          const dayEvents = (eventsByDate[ds] ?? []).filter(ev =>
            ev.weekType === 'both' || ev.weekType === weekType
          )
          const today = isToday(day)

          return (
            <div
              key={ds}
              className="flex flex-col min-h-[500px] cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => onDayClick(ds)}
            >
              {/* Day header */}
              <div className={`text-center py-3 border-b border-slate-100 shrink-0 ${today ? 'bg-blue-50' : ''}`}>
                <div className="text-xs font-medium text-slate-500 uppercase">
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className={`text-lg font-bold mt-0.5 w-9 h-9 rounded-full mx-auto flex items-center justify-center ${
                  today ? 'bg-blue-600 text-white' : 'text-slate-800'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>

              {/* Events */}
              <div className="p-1.5 flex flex-col gap-1">
                {dayEvents.length === 0 && (
                  <span className="text-xs text-slate-300 text-center pt-2">—</span>
                )}
                {dayEvents.map(ev => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    onClick={() => onEventClick(ev)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
