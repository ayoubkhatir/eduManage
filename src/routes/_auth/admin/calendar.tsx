import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { format, getDay, parse, startOfWeek } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useCallback, useMemo, useState } from 'react'
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import type { EventPropGetter, SlotInfo, View } from 'react-big-calendar'
import type { EventForm, OwnerEvent } from '@/components/admin/calendar/model'
import { CalendarToolbar } from '@/components/admin/calendar/CalendarToolbar'
import { EventDetailDialog } from '@/components/admin/calendar/EventDetailDialog'
import { EventFormDialog } from '@/components/admin/calendar/EventFormDialog'
import {
  EVENT_COLORS,
  emptyForm,
  fromEvent,
} from '@/components/admin/calendar/model'
import { UpcomingEventsPanel } from '@/components/admin/calendar/UpcomingEventsPanel'
import { useAdminCalendarData } from '@/components/admin/calendar/useAdminCalendarData'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  addEventServerFn,
  editEventServerFn,
  deleteEventServerFn,
} from '#/server/modules/events/events.server-functions'
import { StatusEnum } from '#/server/db/schema'
import type { AdminUser } from '#/types/usersTypes'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'

const locales = { 'en-US': enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export const Route = createFileRoute('/_auth/admin/calendar')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const user = context?.authState?.user
    if (!user) throw new Error('Missing auth state')
    const currentUser = (await FetchCurrentUserServerFn({
      data: user,
    })) as AdminUser
    return { currentUser }
  },
  pendingComponent: () => (
    <Skeleton name="admin-calendar-page" loading>
      <AdminCalendarContent />
    </Skeleton>
  ),
  pendingMs: 0,
  pendingMinMs: 220,
  head: () => ({
    meta: [{ title: 'Admin | School Calendar - EduManage' }],
  }),
  staticData: {
    breadcrumb: 'Calendar',
  },
})

function RouteComponent() {
  return (
    <Skeleton name="admin-calendar-page" loading={false}>
      <AdminCalendarContent />
    </Skeleton>
  )
}

function AdminCalendarContent() {
  const { currentUser } = Route.useLoaderData()
  const schoolId = currentUser.info?.id

  const {
    classOptions,
    classLookup,
    displayEvents,
    events,
    isEventsError,
    isEventsLoading,
    teacherNames,
    teacherLookup,
    upcomingEvents,
  } = useAdminCalendarData(schoolId)

  const queryClient = useQueryClient()

  const addMutation = useMutation({
    mutationFn: async (form: any) => {
      const res = (await addEventServerFn({ data: form })) as any
      if (res?.success) return res.data
      throw new Error('Add event failed')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event added successfully')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add event',
      )
    },
  })

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = (await editEventServerFn({ data: { id, data } })) as any
      if (res?.success) return res.data
      throw new Error('Edit event failed')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event updated successfully')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update event',
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = (await deleteEventServerFn({ data: id })) as any
      if (res?.success) return res.data
      throw new Error('Delete event failed')
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Event deleted successfully')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete event',
      )
    },
  })

  const addEventAsync = addMutation.mutateAsync
  const editEventAsync = (form: any) => {
    // form has: { id, schoolId, ...payload }
    if ('id' in form) {
      const { id, ...data } = form
      return editMutation.mutateAsync({ id, data })
    }
    return Promise.reject(new Error('Missing id for edit'))
  }
  const deleteEventAsync = deleteMutation.mutateAsync
  const isAdding = (addMutation as any).isLoading
  const isEditing = (editMutation as any).isLoading

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<View>(Views.MONTH)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [initialForm, setInitialForm] = useState<EventForm>(emptyForm())

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailSelection, setDetailSelection] = useState<{
    id: string | undefined
    startAt: number
  } | null>(null)

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

  const handleSelectSlot = useCallback((slot: SlotInfo) => {
    setEditingId(null)
    setInitialForm(emptyForm(slot.start, slot.end))
    setDialogOpen(true)
  }, [])

  const handleSelectEvent = useCallback((event: OwnerEvent) => {
    setDetailSelection({ id: event.id, startAt: event.start.getTime() })
    setDetailOpen(true)
  }, [])

  const detailEvent = useMemo(() => {
    if (!detailSelection) return null

    const selectedOccurrence = displayEvents.find(
      (event) =>
        event.id === detailSelection.id &&
        event.start.getTime() === detailSelection.startAt,
    )

    if (selectedOccurrence) return selectedOccurrence

    return events.find((event) => event.id === detailSelection.id) ?? null
  }, [detailSelection, displayEvents, events])

  const openCreateDialog = useCallback(() => {
    setEditingId(null)
    setInitialForm(emptyForm())
    setDialogOpen(true)
  }, [])

  const openEditFromDetail = useCallback(() => {
    if (!detailEvent) return

    const base =
      events.find((event) => event.id === detailEvent.id) ?? detailEvent
    setDetailOpen(false)
    setEditingId(base.id ?? null)
    setInitialForm(fromEvent(base))
    setDialogOpen(true)
  }, [detailEvent, events])

  const handleSave = useCallback(
    async (form: EventForm) => {
      if (!form.title.trim()) return

      const startDate = new Date(form.start)
      const endDate = new Date(form.end)
      if (endDate <= startDate) return

      const classId = form.className
        ? classLookup.get(form.className)
        : undefined
      const teacherId = form.teacherName
        ? teacherLookup.get(form.teacherName)
        : undefined

      // Transform form to match server schema
      const payload = {
        schoolId: schoolId || '',
        classId,
        teacherId,
        subjectId: undefined,
        title: form.title,
        description: form.description,
        color: form.color,
        start: startDate,
        end: endDate,
        allDay: form.allDay,
        repeatWeekly: form.repeatWeekly,
        isClass: form.isClass,
        status: StatusEnum.NEW,
      }

      if (editingId !== null) {
        await editEventAsync({ id: editingId, ...payload })
      } else {
        await addEventAsync(payload)
      }

      setDialogOpen(false)
    },
    [
      addEventAsync,
      classLookup,
      editEventAsync,
      editingId,
      schoolId,
      teacherLookup,
    ],
  )

  const handleDelete = useCallback(
    async (id: string | undefined) => {
      if (!id) return
      await deleteEventAsync(id)
      setDetailOpen(false)
      setDetailSelection(null)
    },
    [deleteEventAsync],
  )

  const handleDetailOpenChange = useCallback((open: boolean) => {
    setDetailOpen(open)
    if (!open) setDetailSelection(null)
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col md:flex-row p-6 gap-6 min-h-0"
    >
      <aside className="w-full md:w-72 flex flex-col gap-5 shrink-0">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            Schedule
          </p>
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
            onClick={openCreateDialog}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              add_circle
            </span>
            New Event
          </button>
        </div>

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

      <section className="flex-1 flex flex-col gap-4 min-w-0">
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
          ) : displayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl">
                calendar_month
              </span>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                No events yet
              </p>
              <p className="text-sm text-slate-400">
                Click <strong>New Event</strong> to schedule something.
              </p>
            </div>
          ) : (
            <div className="admin-big-calendar admin-calendar-view admin flex-1 h-full min-h-0">
              <Calendar
                date={selectedDate}
                events={displayEvents}
                eventPropGetter={eventPropGetter}
                localizer={localizer}
                onNavigate={setSelectedDate}
                onView={setView}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                step={30}
                toolbar={false}
                view={view}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
              />
            </div>
          )}
        </div>
      </section>

      <EventFormDialog
        open={dialogOpen}
        mode={editingId !== null ? 'edit' : 'add'}
        initialForm={initialForm}
        classOptions={classOptions}
        teacherNames={teacherNames}
        isSaving={isAdding || isEditing}
        onOpenChange={setDialogOpen}
        onSubmit={handleSave}
      />

      <EventDetailDialog
        open={detailOpen}
        event={detailEvent}
        onOpenChange={handleDetailOpenChange}
        onEdit={openEditFromDetail}
        onDelete={handleDelete}
      />
    </motion.main>
  )
}
