// import { format, isValid, parseISO } from 'date-fns'
// import { Calendar as CalendarIcon, ChevronDown, X } from 'lucide-react'
// import type {
//   FieldValues,
//   Path,
//   PathValue,
//   UseFormReturn,
// } from 'react-hook-form'

// import { cn } from '@/lib/utils'
// import { Button } from '@/components/ui/button'
// import { Calendar } from '@/components/ui/calendar'
// import { Label } from '@/components/ui/label'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover'

// type Props<T extends FieldValues> = {
//   form: UseFormReturn<T>
//   name: Path<T>
//   label: string
//   placeholder?: string
// }

// export default function DatePickerField<T extends FieldValues>({
//   form,
//   name,
//   label,
//   placeholder = 'Select date',
// }: Props<T>) {
//   const stringValue = form.watch(name) as string | undefined
//   const dateValue = stringValue ? parseISO(stringValue) : undefined
//   const safeDate = dateValue && isValid(dateValue) ? dateValue : undefined
//   const error = form.formState.errors[name]

//   return (
//     <div className="flex flex-col gap-1.5">
//       <Label className="font-medium tracking-tight text-foreground/90 text-[#111318] dark:text-gray-200 text-sm ">
//         {label}
//       </Label>

//       <Popover modal={true}>
//         <div className="relative group">
//           <PopoverTrigger asChild>
//             <Button
//               variant="outline"
//               className={cn(
//                 'w-full justify-start text-left font-normal h-11 px-3 transition-all',
//                 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-[#9ca3af] focus:ring-2 focus:ring-primary/50 transition-all',
//                 !safeDate && 'text-gray-400',
//                 error ? 'ring-2 ring-red-500' : 'ring-primary/50',
//               )}
//             >
//               <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
//               <span className="truncate flex-1 text-sm">
//                 {safeDate ? format(safeDate, 'PPP') : placeholder}
//               </span>
//               <ChevronDown className="h-4 w-4 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
//             </Button>
//           </PopoverTrigger>

//           {safeDate && (
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation()
//                 form.setValue(name, '' as PathValue<T, Path<T>>, {
//                   shouldValidate: true,
//                 })
//               }}
//               className="cursor-pointer absolute right-9 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 dark:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-700 dark:hover:text-gray-400 transition-all"
//             >
//               <X className="h-3.5 w-3.5" />
//             </button>
//           )}
//         </div>

//         <PopoverContent
//           className="w-auto p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-900 rounded-lg shadow-lg"
//           align="start"
//           sideOffset={6}
//         >
//           <Calendar
//             mode="single"
//             selected={safeDate}
//             onSelect={(date) => {
//               const formatted = date ? format(date, 'yyyy-MM-dd') : ''
//               form.setValue(name, formatted as PathValue<T, Path<T>>, {
//                 shouldValidate: true,
//                 shouldDirty: true,
//               })
//             }}
//             initialFocus
//             className="bg-white"
//           />
//         </PopoverContent>
//       </Popover>

//       {error && (
//         <p className="text-sm text-red-500">{error.message?.toString()}</p>
//       )}
//     </div>
//   )
// }

import { format, isValid, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown, X } from 'lucide-react'
import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  placeholder?: string
  disabled?: boolean
  description?: string
  className?: string
}

export default function DatePickerField<T extends FieldValues>({
  form,
  name,
  label,
  placeholder = 'Select date',
  disabled = false,
  description,
  className,
}: Props<T>) {
  const error = form.formState.errors[name]

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label className="text-sm font-medium tracking-tight text-[#111318] dark:text-gray-200">
        {label}
      </Label>

      <Controller
        control={form.control}
        name={name}
        render={({ field }) => {
          const stringValue = field.value as string | undefined
          const parsedDate = stringValue ? parseISO(stringValue) : undefined
          const safeDate =
            parsedDate && isValid(parsedDate) ? parsedDate : undefined

          return (
            <Popover modal>
              <div className="relative group">
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      'w-full h-11 justify-start rounded-lg px-4 text-left font-normal transition-all',
                      'bg-[#f0f2f4] dark:bg-gray-800 text-black dark:text-white',
                      'hover:bg-gray-50 dark:hover:bg-gray-900',
                      'border border-transparent',
                      !safeDate && 'text-gray-400 dark:text-[#9ca3af]',
                      error
                        ? 'ring-2 ring-red-500'
                        : 'focus:ring-2 focus:ring-primary/50',
                    )}
                    aria-invalid={!!error}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="truncate flex-1 text-sm">
                      {safeDate ? format(safeDate, 'PPP') : placeholder}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                {safeDate && !disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      field.onChange('')
                    }}
                    className="cursor-pointer absolute right-9 top-1/2 -translate-y-1/2 p-1 rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-700 dark:hover:text-gray-300 transition-all"
                    aria-label={`Clear ${label}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <PopoverContent
                className="w-auto p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-900 rounded-lg shadow-lg"
                align="start"
                sideOffset={6}
              >
                <Calendar
                  mode="single"
                  selected={safeDate}
                  onSelect={(date) => {
                    field.onChange(date ? format(date, 'yyyy-MM-dd') : '')
                  }}
                  initialFocus
                  className="bg-white dark:bg-gray-800 text-black dark:text-white"
                />
              </PopoverContent>
            </Popover>
          )
        }}
      />

      {description && !error && (
        <p className="text-xs text-[#616f89] dark:text-gray-400">
          {description}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500">{error.message?.toString()}</p>
      )}
    </div>
  )
}
