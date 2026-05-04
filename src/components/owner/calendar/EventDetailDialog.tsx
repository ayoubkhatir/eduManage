import { format } from 'date-fns'
import { memo } from 'react'
import type { OwnerEvent } from './model'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type EventDetailDialogProps = {
  open: boolean
  event: OwnerEvent | null
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDelete: (id: string | undefined) => void
}

function EventDetailDialogComponent({
  open,
  event,
  onOpenChange,
  onEdit,
  onDelete,
}: EventDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        {event && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span
                  className="size-3 rounded-full shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                {event.title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3 mt-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">
                  calendar_today
                </span>
                <span>
                  {event.allDay
                    ? format(event.start, 'MMMM d, yyyy')
                    : `${format(event.start, 'MMM d, yyyy · h:mm a')} -> ${format(event.end, 'h:mm a')}`}
                </span>
              </div>
              {event.isClass && (
                <>
                  {event.className && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">
                        school
                      </span>
                      <span>{event.className}</span>
                    </div>
                  )}
                  {event.teacherName && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-[18px]">
                        person
                      </span>
                      <span>{event.teacherName}</span>
                    </div>
                  )}
                </>
              )}
              {event.repeatWeekly && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">
                    repeat
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    Repeats weekly · unlimited
                  </span>
                </div>
              )}
              {event.description && (
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">
                    notes
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {event.description}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
                onClick={onEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all cursor-pointer"
                onClick={() => onDelete(event.id)}
              >
                {event.repeatWeekly ? 'Delete all' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export const EventDetailDialog = memo(EventDetailDialogComponent)
