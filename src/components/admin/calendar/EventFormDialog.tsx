import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { EVENT_COLORS } from './model'
import type { EventForm } from './model'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

type EventFormDialogProps = {
  open: boolean
  mode: 'add' | 'edit'
  initialForm: EventForm
  classOptions: Array<string>
  teacherNames: Array<string>
  isSaving: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (form: EventForm) => Promise<void>
}

const fieldBase =
  'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors'

const inputClass =
  'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 pr-8 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors'

const SearchableSelect = memo(function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: Array<string>
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () =>
      query.trim() === ''
        ? options
        : options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query],
  )

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          className={inputClass}
          placeholder={value || placeholder}
          value={open ? query : value}
          onFocus={() => {
            setQuery('')
            setOpen(true)
          }}
          onChange={(e) => setQuery(e.target.value)}
        />
        {value ? (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            onMouseDown={(e) => {
              e.preventDefault()
              onChange('')
              setQuery('')
            }}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        ) : (
          <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-[16px] pointer-events-none">
            search
          </span>
        )}
      </div>
      {open && (
        <ul className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-1 text-sm">
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-center text-slate-400 text-xs">
              No results
            </li>
          ) : (
            filtered.map((option) => (
              <li
                key={option}
                className={`px-3 py-2 cursor-pointer hover:bg-primary/10 transition-colors ${
                  value === option
                    ? 'font-semibold text-primary bg-primary/5'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
                onMouseDown={() => {
                  onChange(option)
                  setOpen(false)
                  setQuery('')
                }}
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
})

const DateTimeInput = memo(function DateTimeInput({
  type,
  value,
  onChange,
}: {
  type: 'datetime-local' | 'date'
  value: string
  onChange: (v: string) => void
}) {
  const icon = type === 'date' ? 'calendar_today' : 'schedule'
  return (
    <div className="cal-datetime-wrapper">
      <span className="cal-datetime-icon material-symbols-outlined">
        {icon}
      </span>
      <input
        type={type}
        className="cal-datetime-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
})

function EventFormDialogComponent({
  open,
  mode,
  initialForm,
  classOptions,
  teacherNames,
  isSaving,
  onOpenChange,
  onSubmit,
}: EventFormDialogProps) {
  const { control, handleSubmit, register, reset, setValue, watch } =
    useForm<EventForm>({
      defaultValues: initialForm,
    })

  const allDay = watch('allDay')
  const isClass = watch('isClass')
  const repeatWeekly = watch('repeatWeekly')
  const selectedColor = watch('color')

  useEffect(() => {
    if (open) {
      reset(initialForm)
    }
  }, [initialForm, open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              {mode === 'edit' ? 'edit_calendar' : 'event'}
            </span>
            {mode === 'edit' ? 'Edit Event' : 'New Event'}
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4 mt-2"
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values)
          })}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Title
            </label>
            <Input
              placeholder="e.g. Parent-Teacher Meeting"
              {...register('title')}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-primary w-4 h-4 cursor-pointer"
              {...register('allDay')}
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              All-day event
            </span>
          </label>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-primary w-4 h-4 cursor-pointer"
                {...register('isClass')}
              />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                This is a class event
              </span>
            </label>

            {isClass && (
              <div className="flex flex-col gap-3 pl-6 border-l-2 border-primary/20">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Class
                  </label>
                  <Controller
                    control={control}
                    name="className"
                    render={({ field }) => (
                      <SearchableSelect
                        options={classOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search class..."
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Teacher
                  </label>
                  <Controller
                    control={control}
                    name="teacherName"
                    render={({ field }) => (
                      <SearchableSelect
                        options={teacherNames}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Search teacher..."
                      />
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="accent-primary w-4 h-4 cursor-pointer"
              {...register('repeatWeekly')}
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Repeat every week
            </span>
            {repeatWeekly && (
              <span className="ml-1 text-xs text-slate-400 font-medium">
                (until deleted or turned off)
              </span>
            )}
          </label>

          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Start
                </label>
                <Controller
                  control={control}
                  name="start"
                  render={({ field }) => (
                    <DateTimeInput
                      type="datetime-local"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  End
                </label>
                <Controller
                  control={control}
                  name="end"
                  render={({ field }) => (
                    <DateTimeInput
                      type="datetime-local"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          )}

          {allDay && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Date
              </label>
              <Controller
                control={control}
                name="start"
                render={({ field }) => (
                  <DateTimeInput
                    type="date"
                    value={field.value.slice(0, 10)}
                    onChange={(dateValue) => {
                      setValue('start', `${dateValue}T00:00`)
                      setValue('end', `${dateValue}T23:59`)
                    }}
                  />
                )}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Optional note..."
              className={`${fieldBase} resize-none`}
              {...register('description')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {EVENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  title={color.label}
                  className={`size-7 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${
                    selectedColor === color.value
                      ? 'border-slate-900 dark:border-white scale-110 shadow-md'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setValue('color', color.value)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all cursor-pointer shadow disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSaving}
            >
              {isSaving
                ? 'Saving...'
                : mode === 'edit'
                  ? 'Save Changes'
                  : 'Add to Calendar'}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const EventFormDialog = memo(EventFormDialogComponent)
