import { format } from 'date-fns'
import { memo } from 'react'
import type { OwnerEvent } from './model'

type UpcomingEventsPanelProps = {
  upcomingEvents: Array<OwnerEvent>
  onSelectEvent: (event: OwnerEvent) => void
}

function UpcomingEventsPanelComponent({
  upcomingEvents,
  onSelectEvent,
}: UpcomingEventsPanelProps) {
  return (
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
              key={`${event.id ?? event.title}-${event.start.getTime()}`}
              type="button"
              className="flex items-start gap-3 group text-left w-full cursor-pointer"
              onClick={() => onSelectEvent(event)}
            >
              <div
                className="w-1 self-stretch rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: event.color }}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-primary transition-colors">
                  {event.title}
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
  )
}

export const UpcomingEventsPanel = memo(UpcomingEventsPanelComponent)
