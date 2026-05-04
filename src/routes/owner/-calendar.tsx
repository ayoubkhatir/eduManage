// import { createFileRoute } from '@tanstack/react-router'
// import { Skeleton } from 'boneyard-js/react'
// import { format, getDay, parse, startOfWeek } from 'date-fns'
// import { enUS } from 'date-fns/locale'
// import { useCallback, useMemo, useState } from 'react'
// import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
// import type { EventPropGetter, SlotInfo, View } from 'react-big-calendar'
// import type { EventForm, OwnerEvent } from '@/components/owner/calendar/model'
// import { CalendarToolbar } from '@/components/owner/calendar/CalendarToolbar'
// import { EventDetailDialog } from '@/components/owner/calendar/EventDetailDialog'
// import { EventFormDialog } from '@/components/owner/calendar/EventFormDialog'
// import {
//   EVENT_COLORS,
//   emptyForm,
//   fromEvent,
// } from '@/components/owner/calendar/model'
// import { UpcomingEventsPanel } from '@/components/owner/calendar/UpcomingEventsPanel'
// import { useOwnerCalendarData } from '@/components/owner/calendar/useOwnerCalendarData'
// import useAddEvent from '@/services/api/owner/addEvent'
// import useDeleteEvent from '@/services/api/owner/deleteEvent'
// import useEditEvent from '@/services/api/owner/editEvent'

// const locales = { 'en-US': enUS }

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// })

// export const Route = createFileRoute('/owner/calendar')({
//   component: RouteComponent,
//   pendingComponent: () => (
//     <Skeleton name="owner-calendar-page" loading>
//       <OwnerCalendarContent />
//     </Skeleton>
//   ),
//   pendingMs: 0,
//   pendingMinMs: 220,
//   head: () => ({
//     meta: [{ title: 'Owner | School Calendar - EduManage' }],
//   }),
//   loader: async () => {
//     // await new Promise((resolve) => setTimeout(resolve, 2000))
//   },
// })

// function RouteComponent() {
//   return (
//     <Skeleton name="owner-calendar-page" loading={false}>
//       <OwnerCalendarContent />
//     </Skeleton>
//   )
// }

// function OwnerCalendarContent() {
//   const {
//     classOptions,
//     displayEvents,
//     events,
//     isEventsError,
//     isEventsLoading,
//     teacherNames,
//     upcomingEvents,
//   } = useOwnerCalendarData()

//   const { mutateAsync: addEventAsync, isPending: isAdding } = useAddEvent()
//   const { mutateAsync: editEventAsync, isPending: isEditing } = useEditEvent()
//   const { mutateAsync: deleteEventAsync } = useDeleteEvent()

//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [view, setView] = useState<View>(Views.MONTH)

//   const [dialogOpen, setDialogOpen] = useState(false)
//   const [editingId, setEditingId] = useState<string | null>(null)
//   const [initialForm, setInitialForm] = useState<EventForm>(emptyForm())

//   const [detailOpen, setDetailOpen] = useState(false)
//   const [detailSelection, setDetailSelection] = useState<{
//     id: string | undefined
//     startAt: number
//   } | null>(null)

//   const eventPropGetter = useCallback<EventPropGetter<OwnerEvent>>((event) => {
//     return {
//       style: {
//         backgroundColor: event.color,
//         borderColor: event.color,
//         color: '#fff',
//         borderRadius: '6px',
//         fontWeight: 600,
//         padding: '2px 7px',
//         fontSize: '0.78rem',
//         cursor: 'pointer',
//       },
//     }
//   }, [])

//   const shiftDate = useCallback(
//     (direction: -1 | 1) => {
//       const next = new Date(selectedDate)
//       if (view === Views.DAY) next.setDate(next.getDate() + direction)
//       else if (view === Views.WEEK) next.setDate(next.getDate() + direction * 7)
//       else next.setMonth(next.getMonth() + direction)
//       setSelectedDate(next)
//     },
//     [selectedDate, view],
//   )

//   const handleSelectSlot = useCallback((slot: SlotInfo) => {
//     setEditingId(null)
//     setInitialForm(emptyForm(slot.start, slot.end))
//     setDialogOpen(true)
//   }, [])

//   const handleSelectEvent = useCallback((event: OwnerEvent) => {
//     setDetailSelection({ id: event.id, startAt: event.start.getTime() })
//     setDetailOpen(true)
//   }, [])

//   const detailEvent = useMemo(() => {
//     if (!detailSelection) return null

//     const selectedOccurrence = displayEvents.find(
//       (event) =>
//         event.id === detailSelection.id &&
//         event.start.getTime() === detailSelection.startAt,
//     )

//     if (selectedOccurrence) return selectedOccurrence

//     return events.find((event) => event.id === detailSelection.id) ?? null
//   }, [detailSelection, displayEvents, events])

//   const openCreateDialog = useCallback(() => {
//     setEditingId(null)
//     setInitialForm(emptyForm())
//     setDialogOpen(true)
//   }, [])

//   const openEditFromDetail = useCallback(() => {
//     if (!detailEvent) return

//     const base =
//       events.find((event) => event.id === detailEvent.id) ?? detailEvent
//     setDetailOpen(false)
//     setEditingId(base.id ?? null)
//     setInitialForm(fromEvent(base))
//     setDialogOpen(true)
//   }, [detailEvent, events])

//   const handleSave = useCallback(
//     async (form: EventForm) => {
//       if (!form.title.trim()) return

//       const startDate = new Date(form.start)
//       const endDate = new Date(form.end)
//       if (endDate <= startDate) return

//       if (editingId !== null) {
//         await editEventAsync(form)
//       } else {
//         await addEventAsync(form)
//       }

//       setDialogOpen(false)
//     },
//     [addEventAsync, editEventAsync, editingId],
//   )

//   const handleDelete = useCallback(
//     async (id: string | undefined) => {
//       if (!id) return
//       await deleteEventAsync(id)
//       setDetailOpen(false)
//       setDetailSelection(null)
//     },
//     [deleteEventAsync],
//   )

//   const handleDetailOpenChange = useCallback((open: boolean) => {
//     setDetailOpen(open)
//     if (!open) setDetailSelection(null)
//   }, [])

//   return (
//     <main className="flex-1 flex flex-col md:flex-row p-6 gap-6 min-h-0">
//       <aside className="w-full md:w-72 flex flex-col gap-5 shrink-0">
//         <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
//           <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
//             Schedule
//           </p>
//           <button
//             className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
//             onClick={openCreateDialog}
//             type="button"
//           >
//             <span className="material-symbols-outlined text-[18px]">
//               add_circle
//             </span>
//             New Event
//           </button>
//         </div>

//         <UpcomingEventsPanel
//           upcomingEvents={upcomingEvents}
//           onSelectEvent={handleSelectEvent}
//         />

//         <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
//           <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
//             Color Legend
//           </p>
//           <div className="grid grid-cols-2 gap-2">
//             {EVENT_COLORS.map((color) => (
//               <div key={color.value} className="flex items-center gap-2">
//                 <span
//                   className="size-2.5 rounded-full shrink-0"
//                   style={{ backgroundColor: color.value }}
//                 />
//                 <span className="text-xs text-slate-600 dark:text-slate-400">
//                   {color.label}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </aside>

//       <section className="flex-1 flex flex-col gap-4 min-w-0">
//         <CalendarToolbar
//           selectedDate={selectedDate}
//           view={view}
//           onShiftDate={shiftDate}
//           onSelectToday={() => setSelectedDate(new Date())}
//           onViewChange={setView}
//         />

//         <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex-1 flex flex-col min-h-0">
//           {isEventsLoading ? (
//             <div className="flex flex-col items-center justify-center flex-1 gap-3 text-slate-400">
//               <span className="material-symbols-outlined animate-spin text-[40px]">
//                 progress_activity
//               </span>
//               <p className="text-sm font-medium">Loading events...</p>
//             </div>
//           ) : isEventsError ? (
//             <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
//               <span className="material-symbols-outlined text-red-400 text-5xl">
//                 event_busy
//               </span>
//               <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
//                 Failed to load events
//               </p>
//               <p className="text-sm text-slate-400">
//                 Could not fetch calendar data. Please try again later.
//               </p>
//             </div>
//           ) : displayEvents.length === 0 ? (
//             <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
//               <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl">
//                 calendar_month
//               </span>
//               <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
//                 No events yet
//               </p>
//               <p className="text-sm text-slate-400">
//                 Click <strong>New Event</strong> to schedule something.
//               </p>
//             </div>
//           ) : (
//             <div className="owner-big-calendar owner-calendar-view flex-1 h-full min-h-0">
//               <Calendar
//                 date={selectedDate}
//                 events={displayEvents}
//                 eventPropGetter={eventPropGetter}
//                 localizer={localizer}
//                 onNavigate={setSelectedDate}
//                 onView={setView}
//                 onSelectSlot={handleSelectSlot}
//                 onSelectEvent={handleSelectEvent}
//                 selectable
//                 step={30}
//                 toolbar={false}
//                 view={view}
//                 views={[Views.MONTH, Views.WEEK, Views.DAY]}
//               />
//             </div>
//           )}
//         </div>
//       </section>

//       <EventFormDialog
//         open={dialogOpen}
//         mode={editingId !== null ? 'edit' : 'add'}
//         initialForm={initialForm}
//         classOptions={classOptions}
//         teacherNames={teacherNames}
//         isSaving={isAdding || isEditing}
//         onOpenChange={setDialogOpen}
//         onSubmit={handleSave}
//       />

//       <EventDetailDialog
//         open={detailOpen}
//         event={detailEvent}
//         onOpenChange={handleDetailOpenChange}
//         onEdit={openEditFromDetail}
//         onDelete={handleDelete}
//       />
//     </main>
//   )
// }
