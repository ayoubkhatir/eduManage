import { enUS } from 'date-fns/locale'
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import {
  format,
  getDay,
  isToday,
  isTomorrow,
  parse,
  parseISO,
  startOfWeek,
} from 'date-fns'
import { useMemo, useState, type ReactNode } from 'react'
import type { EventPropGetter, View } from 'react-big-calendar'
import type { EventForm } from '@/components/admin/calendar/model'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import useGetEvents from '#/services/api/getEvents'

const locales = { 'en-US': enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const EVENT_COLORS = [
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Cyan', value: '#0891b2' },
]

type CalEvent = Omit<EventForm, 'start' | 'end'> & {
  id?: string
  start: Date
  end: Date
}

export function GlobalCalendar({
  isTeacher,
  rawEvents,
  children,
}: {
  isTeacher: boolean
  rawEvents: EventForm[]
  children: ReactNode
}) {
  const [view, setView] = useState<View>(Views.MONTH)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [detailEvent, setDetailEvent] = useState<CalEvent | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const events = useMemo<Array<CalEvent>>(
    () =>
      (Array.isArray(rawEvents) ? rawEvents : []).map((ev: EventForm) => ({
        ...ev,
        start: parseISO(ev.start),
        end: parseISO(ev.end),
      })),
    [rawEvents],
  )

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => isToday(e.start) || isTomorrow(e.start))
        .sort((a, b) => a.start.getTime() - b.start.getTime()),
    [events],
  )

  const title = useMemo(() => {
    if (view === Views.MONTH) return format(selectedDate, 'MMMM yyyy')
    if (view === Views.WEEK)
      return `Week of ${format(selectedDate, 'MMM d, yyyy')}`
    return format(selectedDate, 'MMMM d, yyyy')
  }, [view, selectedDate])

  const shiftDate = (dir: number) => {
    const date = new Date(selectedDate)
    if (view === Views.MONTH) date.setMonth(date.getMonth() + dir)
    else if (view === Views.WEEK) date.setDate(date.getDate() + dir * 7)
    else date.setDate(date.getDate() + dir)
    setSelectedDate(date)
  }

  const eventPropGetter: EventPropGetter<CalEvent> = (event) => ({
    style: {
      backgroundColor: event.color,
      borderColor: event.color,
      color: '#fff',
    },
  })

  return (
    <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-4 md:gap-6 min-h-0">
      {/* Sidebar */}
      <aside className="hidden 2xl:flex w-64 flex-col gap-5 shrink-0">
        {/* Upcoming Events */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Today &amp; Tomorrow
            </h3>
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
              {upcomingEvents.length}
            </span>
          </div>

          {upcomingEvents.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No events today or tomorrow
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className="flex items-start gap-3 group text-left w-full cursor-pointer"
                  onClick={() => {
                    setDetailEvent(event)
                    setDetailOpen(true)
                  }}
                >
                  <div
                    className="w-1 self-stretch rounded-full shrink-0 mt-0.5"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
                      {isTeacher && event.className
                        ? event.className
                        : event.title}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">
                      {format(event.start, 'MMM dd')}
                      {!event.allDay && ` • ${format(event.start, 'h:mm a')}`}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Legend */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Color Legend
          </p>
          <div className="grid grid-cols-2 gap-2">
            {EVENT_COLORS.map((c) => (
              <div key={c.value} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: c.value }}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Calendar */}
      <section className="flex-1 flex flex-col gap-4 min-w-0 min-h-[65vh]">
        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl px-5 py-1.5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
              <button
                type="button"
                className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-600 dark:text-slate-300"
                onClick={() => shiftDate(-1)}
                aria-label="Previous"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                className="px-3 py-1 text-xs font-bold rounded hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
                onClick={() => setSelectedDate(new Date())}
              >
                Today
              </button>
              <button
                type="button"
                className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-600 dark:text-slate-300"
                onClick={() => shiftDate(1)}
                aria-label="Next"
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          {/* View switcher */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 gap-0.5">
            {([Views.MONTH, Views.WEEK, Views.DAY] as Array<View>).map((v) => (
              <button
                key={v}
                type="button"
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer capitalize ${
                  view === v
                    ? 'bg-white dark:bg-slate-700 shadow text-primary dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
                onClick={() => setView(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex-1 flex flex-col min-h-[58vh]">
          {children}
        </div>
      </section>

      {/* Event Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-sm">
          {detailEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full shrink-0"
                    style={{ backgroundColor: detailEvent.color }}
                  />
                  {isTeacher && detailEvent.className
                    ? detailEvent.className
                    : detailEvent.title}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3 mt-2 text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">
                    calendar_today
                  </span>
                  <span>
                    {detailEvent.allDay
                      ? format(detailEvent.start, 'MMMM d, yyyy')
                      : `${format(detailEvent.start, 'MMM d, yyyy · h:mm a')} → ${format(detailEvent.end, 'h:mm a')}`}
                  </span>
                </div>
                {detailEvent.isClass && (
                  <>
                    {detailEvent.className && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">
                          school
                        </span>
                        <span>{detailEvent.className}</span>
                      </div>
                    )}
                    {detailEvent.teacherName && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[18px]">
                          person
                        </span>
                        <span>{detailEvent.teacherName}</span>
                      </div>
                    )}
                  </>
                )}
                {detailEvent.repeatWeekly && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">
                      repeat
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      Repeats weekly · unlimited
                    </span>
                  </div>
                )}
                {detailEvent.description && (
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-[18px]">
                      notes
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {detailEvent.description}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

function TESTING({ teacherUserId }: { teacherUserId: string }) {
  const { data: events, status: fetchStatus } = useGetEvents(teacherUserId)
  return (
    <>
      {fetchStatus === 'pending' ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-slate-400">
          <span className="material-symbols-outlined animate-spin text-[40px]">
            progress_activity
          </span>
          <p className="text-sm font-medium">Loading events…</p>
        </div>
      ) : fetchStatus === 'error' ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-red-400">
          <span className="material-symbols-outlined text-[40px]">error</span>
          <p className="text-sm font-medium">Failed to load events</p>
          <p className="text-xs text-slate-400">
            Check your connection and try again
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-slate-400">
          <span className="material-symbols-outlined text-[48px]">
            calendar_month
          </span>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            No events scheduled
          </p>
          <p className="text-xs">
            There are no events to display for this period
          </p>
        </div>
      ) : (
        <div className="admin-big-calendar flex-1 h-full min-h-[52vh]">
          <Calendar
            date={selectedDate}
            events={events}
            eventPropGetter={eventPropGetter}
            localizer={localizer}
            onNavigate={setSelectedDate}
            onSelectEvent={(event) => {
              setDetailEvent(event)
              setDetailOpen(true)
            }}
            onView={setView}
            titleAccessor={(event) =>
              isTeacher && event.className ? event.className : event.title
            }
            step={30}
            toolbar={false}
            view={view}
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
          />
        </div>
      )}
    </>
  )
}
