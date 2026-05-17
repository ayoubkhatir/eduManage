// import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

// type Props<T extends FieldValues> = {
//   form: UseFormReturn<T>
//   name: Path<T>
//   label: string
//   placeholder?: string
//   type?: string
// }

// export default function InputWrapper<T extends FieldValues>({
//   form,
//   name,
//   type,
//   label,
//   placeholder,
// }: Props<T>) {
//   const error = form.formState.errors[name]
//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
//         {label}
//       </label>
//       <input
//         className={`w-full h-11 rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] focus:ring-2 focus:ring-primary/50 transition-all ${error ? 'ring-2 ring-red-500' : 'ring-primary/50'}`}
//         placeholder={placeholder}
//         type={type ? type : 'text'}
//         {...form.register(name)}
//       />
//       {error && (
//         <p className="text-sm text-red-500">{error.message?.toString()}</p>
//       )}
//     </div>
//   )
// }

import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  placeholder?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>['type']
  disabled?: boolean
  description?: string
  className?: string
  inputClassName?: string
}

export default function InputWrapper<T extends FieldValues>({
  form,
  name,
  type = 'text',
  label,
  placeholder,
  disabled = false,
  description,
  className,
  inputClassName,
}: Props<T>) {
  const error = form.formState.errors[name]

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <label
        htmlFor={name}
        className="text-sm font-medium text-[#111318] dark:text-gray-200"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full h-11 rounded-lg px-4 text-[#111318] dark:text-white placeholder:text-[#9ca3af] bg-[#f0f2f4] dark:bg-gray-800 focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
          error ? 'ring-2 ring-red-500' : 'ring-0 focus:ring-primary/50'
        } ${inputClassName ?? ''}`}
        {...form.register(name)}
      />

      {description && !error && (
        <p className="text-xs text-[#616f89] dark:text-gray-400">
          {description}
        </p>
      )}

      {error && (
        <p id={`${name}-error`} className="text-sm text-red-500">
          {error.message?.toString()}
        </p>
      )}
    </div>
  )
}
