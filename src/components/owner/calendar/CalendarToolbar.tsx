import { format } from 'date-fns'
import { memo, useMemo } from 'react'
import { Views } from 'react-big-calendar'
import type { View } from 'react-big-calendar'

type CalendarToolbarProps = {
  selectedDate: Date
  view: View
  onShiftDate: (direction: -1 | 1) => void
  onSelectToday: () => void
  onViewChange: (view: View) => void
}

function CalendarToolbarComponent({
  selectedDate,
  view,
  onShiftDate,
  onSelectToday,
  onViewChange,
}: CalendarToolbarProps) {
  const title = useMemo(() => format(selectedDate, 'MMMM yyyy'), [selectedDate])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl px-5 py-3 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
          <button
            type="button"
            className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-600 dark:text-slate-300"
            onClick={() => onShiftDate(-1)}
            aria-label="Previous"
          >
            <span className="material-symbols-outlined text-[20px]">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            className="px-3 py-1 text-xs font-bold rounded hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
            onClick={onSelectToday}
          >
            Today
          </button>
          <button
            type="button"
            className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 transition-all cursor-pointer text-slate-600 dark:text-slate-300"
            onClick={() => onShiftDate(1)}
            aria-label="Next"
          >
            <span className="material-symbols-outlined text-[20px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 gap-0.5">
        {([Views.MONTH, Views.WEEK, Views.DAY] as Array<View>).map(
          (nextView) => (
            <button
              key={nextView}
              type="button"
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer capitalize ${
                view === nextView
                  ? 'bg-white dark:bg-slate-700 shadow text-primary dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
              onClick={() => onViewChange(nextView)}
            >
              {nextView}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

export const CalendarToolbar = memo(CalendarToolbarComponent)
