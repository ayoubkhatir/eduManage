import type { FieldError, UseFormRegister } from 'react-hook-form'

type CollectionFormValues = {
  name: string
}

type CollectionFormProps = {
  inputId: string
  role: 'add' | 'edit'
  register: UseFormRegister<CollectionFormValues>
  error?: FieldError
  isSubmitting: boolean
}

export function CollectionForm({
  inputId,
  role,
  register,
  error,
  isSubmitting,
}: CollectionFormProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor={inputId}>
          Name
        </label>
        <input
          id={inputId}
          type="text"
          required
          className="w-full rounded border border-slate-300 dark:border-slate-700 px-3 py-2 bg-transparent text-slate-900 dark:text-white"
          {...register('name')}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded bg-primary text-white hover:bg-blue-700 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {role === 'edit'
          ? isSubmitting
            ? 'Saving...'
            : 'Save Changes'
          : isSubmitting
            ? 'Creating...'
            : 'Create Collection'}
      </button>
    </>
  )
}
