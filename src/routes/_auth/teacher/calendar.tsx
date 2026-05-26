import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useCallback, useMemo, useState } from 'react'
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import type { EventPropGetter, View } from 'react-big-calendar'
import type { OwnerEvent } from '@/components/admin/calendar/model'
import { CalendarToolbar } from '@/components/admin/calendar/CalendarToolbar'
import { EventDetailDialog } from '@/components/admin/calendar/EventDetailDialog'
import { EVENT_COLORS } from '@/components/admin/calendar/model'
import { UpcomingEventsPanel } from '@/components/admin/calendar/UpcomingEventsPanel'
import useGetEvents from '@/hooks/events/hooks'
import { motion } from 'framer-motion'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { TeacherUser } from '#/types/teacherTypes'

const locales = { 'en-US': enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export const Route = createFileRoute('/_auth/teacher/calendar')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const user = context?.authState?.user
    if (!user) throw new Error('Missing auth state')
    const currentUser = (await FetchCurrentUserServerFn({
      data: user,
    })) as TeacherUser
    return { currentUser }
  },
  pendingComponent: () => (
    <Skeleton name="teacher-calendar-page" loading>
      <TeacherCalendarContent />
    </Skeleton>
  ),
  pendingMs: 0,
  pendingMinMs: 220,
  staticData: {
    breadcrumb: 'Calendar',
  },
  head: () => ({
    meta: [{ title: 'Teacher | School Calendar - EduManage' }],
  }),
})

function RouteComponent() {
  return (
    <Skeleton name="teacher-calendar-page" loading={false}>
      <TeacherCalendarContent />
    </Skeleton>
  )
}

function TeacherCalendarContent() {
  const { currentUser } = Route.useLoaderData()
  const teacherId = currentUser.info.id

  const {
    data: eventsData,
    isLoading: isEventsLoading,
    isError: isEventsError,
  } = useGetEvents(undefined, teacherId)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<View>(Views.MONTH)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailSelection, setDetailSelection] = useState<{
    id: string | undefined
    startAt: number
  } | null>(null)

  const events = useMemo<Array<OwnerEvent>>(
    () =>
      (eventsData ?? []).map((ev: any) => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
      })),
    [eventsData],
  )

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStart = new Date(tomorrow)
    tomorrowStart.setHours(0, 0, 0, 0)

    return events
      .filter((e) => {
        const eventDate = new Date(e.start)
        eventDate.setHours(0, 0, 0, 0)
        const nowDate = new Date(now)
        nowDate.setHours(0, 0, 0, 0)
        return (
          eventDate.getTime() === nowDate.getTime() ||
          eventDate.getTime() === tomorrowStart.getTime()
        )
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  }, [events])

  const eventPropGetter = useCallback<EventPropGetter<OwnerEvent>>((event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderColor: event.color,
        color: '#fff',
        borderRadius: '6px',
        fontWeight: 600,
        padding: '2px 7px',
        fontSize: '0.78rem',
        cursor: 'pointer',
      },
    }
  }, [])

  const shiftDate = useCallback(
    (direction: -1 | 1) => {
      const next = new Date(selectedDate)
      if (view === Views.DAY) next.setDate(next.getDate() + direction)
      else if (view === Views.WEEK) next.setDate(next.getDate() + direction * 7)
      else next.setMonth(next.getMonth() + direction)
      setSelectedDate(next)
    },
    [selectedDate, view],
  )

  const handleSelectEvent = useCallback((event: OwnerEvent) => {
    setDetailSelection({ id: event.id, startAt: event.start.getTime() })
    setDetailOpen(true)
  }, [])

  const detailEvent = useMemo(() => {
    if (!detailSelection) return null
    return events.find((event) => event.id === detailSelection.id) ?? null
  }, [detailSelection, events])

  function DateCellWrapper({ children, value }: any) {
    return (
      <div
        onClick={() => {
          setSelectedDate(value)
          setView(Views.DAY)
        }}
        className="w-full h-full group relative  border border-zinc-800  p-6 transition-all duration-300 hover:border-indigo-500 hover:shadow-[inset_0_-8px_12px_rgba(99,102,241,0.45)] cursor-pointer"
      >
        {children}
      </div>
    )
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col md:flex-row p-6 gap-6 min-h-screen"
    >
      <aside className="w-full md:w-72 flex flex-col gap-5 shrink-0">
        <UpcomingEventsPanel
          upcomingEvents={upcomingEvents}
          onSelectEvent={handleSelectEvent}
        />

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Color Legend
          </p>
          <div className="grid grid-cols-2 gap-2">
            {EVENT_COLORS.map((color) => (
              <div key={color.value} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {color.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex-1 flex flex-col gap-4 min-w-0 min-h-0">
        <CalendarToolbar
          selectedDate={selectedDate}
          view={view}
          onShiftDate={shiftDate}
          onSelectToday={() => setSelectedDate(new Date())}
          onViewChange={setView}
        />

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex-1 flex flex-col min-h-0">
          {isEventsLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-slate-400">
              <span className="material-symbols-outlined animate-spin text-[40px]">
                progress_activity
              </span>
              <p className="text-sm font-medium">Loading events...</p>
            </div>
          ) : isEventsError ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
              <span className="material-symbols-outlined text-red-400 text-5xl">
                event_busy
              </span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Failed to load events
              </p>
              <p className="text-sm text-slate-400">
                Could not fetch calendar data. Please try again later.
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl">
                calendar_month
              </span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                No events yet
              </p>
              <p className="text-sm text-slate-400">
                Your class schedule will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-big-calendar admin-calendar-view other flex-1 h-full min-h-0">
              <Calendar
                date={selectedDate}
                events={events}
                eventPropGetter={eventPropGetter}
                localizer={localizer}
                onNavigate={setSelectedDate}
                onView={setView}
                onSelectEvent={handleSelectEvent}
                selectable={false}
                step={30}
                toolbar={false}
                view={view}
                components={{ dateCellWrapper: DateCellWrapper }}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
              />
            </div>
          )}
        </div>
      </section>

      <EventDetailDialog
        open={detailOpen}
        event={detailEvent}
        onOpenChange={() => setDetailOpen(false)}
        onEdit={() => {}}
        onDelete={() => {}}
        readOnly
      />
    </motion.main>
  )
}
