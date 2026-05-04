import { format } from 'date-fns'

export type OwnerEvent = {
  id?: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  color: string
  description?: string
  repeatWeekly?: boolean
  isClass?: boolean
  className?: string
  teacherName?: string
}

export type EventForm = {
  id: string
  title: string
  start: string
  end: string
  color: string
  description: string
  allDay: boolean
  repeatWeekly: boolean
  isClass: boolean
  className: string
  teacherName: string
}

export const EVENT_COLORS = [
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Cyan', value: '#0891b2' },
] as const

export const toDatetimeLocal = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm")

export function emptyForm(start?: Date, end?: Date): EventForm {
  const s = start ?? new Date()
  const e = end ?? new Date(s.getTime() + 60 * 60 * 1000)

  return {
    id: crypto.randomUUID(),
    title: '',
    start: toDatetimeLocal(s),
    end: toDatetimeLocal(e),
    color: EVENT_COLORS[0].value,
    description: '',
    allDay: false,
    repeatWeekly: false,
    isClass: false,
    className: '',
    teacherName: '',
  }
}

export function fromEvent(ev: OwnerEvent): EventForm {
  return {
    id: ev.id ?? '',
    title: ev.title,
    start: toDatetimeLocal(ev.start),
    end: toDatetimeLocal(ev.end),
    color: ev.color,
    description: ev.description ?? '',
    allDay: ev.allDay ?? false,
    repeatWeekly: ev.repeatWeekly ?? false,
    isClass: ev.isClass ?? false,
    className: ev.className ?? '',
    teacherName: ev.teacherName ?? '',
  }
}
