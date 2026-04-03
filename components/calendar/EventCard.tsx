'use client'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CalendarEvent } from '@/lib/types'
import { getCategoryById } from '@/lib/constants'
import { Bell, Clock, CalendarDays } from 'lucide-react'

/* ── Tooltip rendered at cursor via portal (escapes overflow) ── */
function HoverTooltip({ event, x, y }: { event: CalendarEvent; x: number; y: number }) {
  const cat = getCategoryById(event.category)
  const left = Math.min(x + 14, window.innerWidth - 230)
  const top  = y + 14 + 160 > window.innerHeight ? y - 160 : y + 14

  return createPortal(
    <div
      className="fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-slate-100 p-3.5 w-56 pointer-events-none select-none"
      style={{ left, top }}
    >
      <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${cat.color} ${cat.textColor} ${cat.borderColor}`}>
        {cat.label}
      </span>
      <p className="font-semibold text-slate-800 text-sm mt-2 leading-snug">{event.title}</p>
      {(event.startTime || event.endTime) && (
        <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
          <Clock size={11} className="shrink-0" />
          {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
        </p>
      )}
      {event.weekType !== 'both' && (
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
          <CalendarDays size={11} className="shrink-0" />
          Semaine {event.weekType} uniquement
        </p>
      )}
      {event.notification && (
        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1.5">
          <Bell size={11} className="shrink-0" /> Notification activée
        </p>
      )}
      {event.notes && (
        <p className="text-xs text-slate-400 mt-1.5 italic line-clamp-2 border-t border-slate-50 pt-1.5">
          {event.notes}
        </p>
      )}
    </div>,
    document.body
  )
}

/* ── EventCard ── */
interface Props {
  event: CalendarEvent
  compact?: boolean
  onClick: () => void
}

export default function EventCard({ event, compact = false, onClick }: Props) {
  const cat = getCategoryById(event.category)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleMouseEnter = (e: React.MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
  const handleMouseMove  = (e: React.MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
  const handleMouseLeave = () => setPos(null)

  const hoverProps = { onMouseEnter: handleMouseEnter, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave }

  if (compact) {
    return (
      <>
        <div
          onClick={onClick}
          {...hoverProps}
          className={`px-1.5 py-0.5 rounded text-xs font-medium truncate cursor-pointer hover:opacity-80 transition-opacity border ${cat.color} ${cat.textColor} ${cat.borderColor}`}
        >
          {event.notification && <Bell size={8} className="inline mr-0.5" />}
          {event.startTime && <span className="opacity-70">{event.startTime} </span>}
          {event.title}
        </div>
        {mounted && pos && <HoverTooltip event={event} x={pos.x} y={pos.y} />}
      </>
    )
  }

  return (
    <>
      <div
        onClick={onClick}
        {...hoverProps}
        className={`px-2.5 py-2 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${cat.color} ${cat.borderColor}`}
      >
        <div className="flex items-start justify-between gap-1">
          <span className={`text-sm font-medium leading-tight ${cat.textColor}`}>{event.title}</span>
          {event.notification && <Bell size={12} className={`shrink-0 mt-0.5 ${cat.textColor} opacity-70`} />}
        </div>
        {(event.startTime || event.endTime) && (
          <p className={`text-xs mt-0.5 opacity-70 ${cat.textColor}`}>
            {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
          </p>
        )}
      </div>
      {mounted && pos && <HoverTooltip event={event} x={pos.x} y={pos.y} />}
    </>
  )
}
