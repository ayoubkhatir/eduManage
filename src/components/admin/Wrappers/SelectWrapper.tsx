// import { Label } from '../../ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectSeparator,
//   SelectTrigger,
//   SelectValue,
// } from '../../ui/select'
// import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

// type Props<T extends FieldValues> = {
//   form: UseFormReturn<T>
//   label: string
//   name: Path<T>
//   values: Array<string>
//   placeholder?: string
// }

// export default function SelectWrapper<T extends FieldValues>({
//   form,
//   label,
//   name,
//   values,
//   placeholder,
// }: Props<T>) {
//   const error = form.formState.errors[name]
//   const value = form.watch(name)

//   return (
//     <div className="flex flex-col gap-2">
//       <Label className="text-sm font-semibold tracking-tight text-foreground/90">
//         {label}
//       </Label>

//       <Select
//         value={value as string}
//         onValueChange={(val) =>
//           form.setValue(name, val as any, {
//             shouldValidate: true,
//             shouldDirty: true,
//           })
//         }
//       >
//         <SelectTrigger className="w-full h-11 px-4 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-700 transition-all">
//           <SelectValue placeholder={value ? value : placeholder} />
//         </SelectTrigger>

//         <SelectContent
//           className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-1"
//           sideOffset={6}
//         >
//           {values.map((item, i) => (
//             <div key={item}>
//               <SelectItem
//                 value={item}
//                 className="px-3 py-1 rounded-md hover:bg-gray-100  dark:hover:bg-gray-900 cursor-pointer transition-colors"
//               >
//                 {item}
//               </SelectItem>

//               {values.length !== i + 1 && (
//                 <SelectSeparator className="bg-gray-200 my-1" />
//               )}
//             </div>
//           ))}
//         </SelectContent>
//       </Select>

//       {error && (
//         <p className="text-sm text-red-500">{error.message?.toString()}</p>
//       )}
//     </div>
//   )
// }

import { Label } from '../../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../ui/select'
import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form'

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
  label: string
  name: Path<T>
  values: Array<string> | { label: string; value: string }[]
  placeholder?: string
}

export default function SelectWrapper<T extends FieldValues>({
  form,
  label,
  name,
  values,
  placeholder = 'Select an option',
}: Props<T>) {
  const error = form.formState.errors[name]

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
        {label}
      </Label>

      <Controller
        control={form.control}
        name={name}
        render={({ field }) => (
          <Select
            value={(field.value as string | undefined) ?? ''}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={`w-full h-11! rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-black dark:text-white focus:ring-2 focus:ring-primary/50 transition-all ${
                error ? 'ring-2 ring-red-500' : 'ring-primary/50'
              }`}
            >
              <SelectValue
                placeholder={placeholder}
                className="text-[#9ca3af]"
              />
            </SelectTrigger>

            <SelectContent
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-1"
              sideOffset={6}
            >
              {values.map((item, i) => (
                <div key={typeof item === 'string' ? item : item.label}>
                  <SelectItem
                    value={typeof item === 'string' ? item : item.value}
                    className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-black dark:text-white cursor-pointer transition-colors"
                  >
                    {typeof item === 'string' ? item : item.label}
                  </SelectItem>

                  {values.length !== i + 1 && (
                    <SelectSeparator className="bg-gray-200 dark:bg-gray-700 my-1" />
                  )}
                </div>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && (
        <p className="text-sm text-red-500">{error.message?.toString()}</p>
      )}
    </div>
  )
}
