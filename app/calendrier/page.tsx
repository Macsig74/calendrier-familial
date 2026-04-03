'use client'
import { useState, useMemo } from 'react'
import {
  addMonths, subMonths, addWeeks, subWeeks,
  startOfWeek,
} from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, CalendarDays, LayoutGrid } from 'lucide-react'
import { format } from 'date-fns'
import Header from '@/components/layout/Header'
import MonthView from '@/components/calendar/MonthView'
import WeekView from '@/components/calendar/WeekView'
import Modal from '@/components/ui/Modal'
import EventForm from '@/components/calendar/EventForm'
import EventDetail from '@/components/calendar/EventDetail'
import { useAppStore } from '@/hooks/StoreContext'
import { CalendarEvent } from '@/lib/types'
import { formatMonthYear, getWeekType, toDateString } from '@/lib/utils'

type ViewMode = 'month' | 'week'

export default function CalendrierPage() {
  const { events, users, addEvent, updateEvent, deleteEvent } = useAppStore()
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [view, setView] = useState<ViewMode>('month')

  // Detail popover (click on existing event)
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null)

  // Edit/add form modal
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')

  const filteredEvents = useMemo(() => {
    if (view === 'week') {
      const weekType = getWeekType(startOfWeek(currentDate, { weekStartsOn: 1 }))
      return events.filter(e => e.weekType === 'both' || e.weekType === weekType)
    }
    return events
  }, [events, view, currentDate])

  const navigatePrev = () => view === 'month' ? setCurrentDate(d => subMonths(d, 1)) : setCurrentDate(d => subWeeks(d, 1))
  const navigateNext = () => view === 'month' ? setCurrentDate(d => addMonths(d, 1)) : setCurrentDate(d => addWeeks(d, 1))

  const openAdd = (dateStr?: string) => {
    setEditingEvent(null)
    setSelectedDate(dateStr ?? toDateString(new Date()))
    setFormOpen(true)
  }

  const openDetail = (ev: CalendarEvent) => setDetailEvent(ev)

  const openEditFromDetail = () => {
    if (!detailEvent) return
    setEditingEvent(detailEvent)
    setDetailEvent(null)
    setFormOpen(true)
  }

  const headerTitle = view === 'month'
    ? formatMonthYear(currentDate)
    : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: fr })} — ${format(new Date(startOfWeek(currentDate, { weekStartsOn: 1 }).getTime() + 6 * 86400000), 'd MMM yyyy', { locale: fr })}`

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header title="Calendrier" />

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-slate-200 flex-wrap gap-y-2">
        <button onClick={navigatePrev} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
          Aujourd&apos;hui
        </button>
        <button onClick={navigateNext} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <ChevronRight size={18} />
        </button>

        <span className="flex-1 text-center font-semibold text-slate-800 capitalize text-sm md:text-base">
          {headerTitle}
        </span>

        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('month')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'month' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid size={15} /> Mois
          </button>
          <button
            onClick={() => setView('week')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
              view === 'week' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CalendarDays size={15} /> Semaine
          </button>
        </div>

        <button
          onClick={() => openAdd()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {/* Calendar body */}
      <div className="flex-1 bg-white overflow-y-auto">
        {view === 'month' ? (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDayClick={openAdd}
            onEventClick={openDetail}
          />
        ) : (
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            onDayClick={openAdd}
            onEventClick={openDetail}
          />
        )}
      </div>

      {/* Event detail popover */}
      {detailEvent && (
        <EventDetail
          event={detailEvent}
          users={users}
          onClose={() => setDetailEvent(null)}
          onEdit={openEditFromDetail}
          onDelete={() => deleteEvent(detailEvent.id)}
        />
      )}

      {/* Add / edit form modal */}
      {formOpen && (
        <Modal
          title={editingEvent ? "Modifier l'événement" : 'Nouvel événement'}
          onClose={() => setFormOpen(false)}
          size="md"
        >
          <EventForm
            initial={editingEvent ?? undefined}
            defaultDate={selectedDate}
            onSave={data => {
              if (editingEvent) updateEvent(editingEvent.id, data)
              else addEvent(data)
            }}
            onDelete={editingEvent ? () => { deleteEvent(editingEvent.id); setFormOpen(false) } : undefined}
            onClose={() => setFormOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}
