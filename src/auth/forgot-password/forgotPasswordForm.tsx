import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { forgotPasswordServerFn } from '#/server/modules/auth/auth.server-function'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      forgotPasswordServerFn({ data }),
    onSuccess: () => {
      setSuccessMessage(
        'Check your email for a link to reset your password'
      )
      setErrorMessage(null)
      form.reset()
    },
    onError: (error: any) => {
      setErrorMessage(
        error?.message || 'Failed to send reset link. Please try again.'
      )
      setSuccessMessage(null)
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    mutation.mutate(data)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Email */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200"
          htmlFor="email"
        >
          Email address
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">
              mail
            </span>
          </div>
          <input
            id="email"
            className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary dark:focus:ring-primary/10"
            {...form.register('email')}
            placeholder="name@school.com"
            type="email"
            aria-describedby={
              form.formState.errors.email ? 'email-error' : undefined
            }
          />
        </div>
        {form.formState.errors.email && (
          <p className="mt-1.5 text-xs text-red-500" id="email-error">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div>
        <button
          className="cursor-pointer flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <span className="material-symbols-outlined animate-spin text-lg">
              progress_activity
            </span>
          ) : (
            <>
              Send Reset Link
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </div>

      {/* Messages */}
      {errorMessage && (
        <p className="text-center text-sm text-red-500">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-sm text-green-700 dark:text-green-300">
            {successMessage}
          </p>
        </div>
      )}
    </form>
  )
}
