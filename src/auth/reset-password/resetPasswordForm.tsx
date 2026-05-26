import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { resetPasswordServerFn } from '#/server/modules/auth/auth.server-function'
import type { ResetPasswordSearch } from '#/routes/reset-password'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/reset-password' }) as ResetPasswordSearch
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      resetPasswordServerFn({ data: { ...data, token: token || '' } }),
    onSuccess: () => {
      setSuccessMessage('Password reset successfully! Redirecting to Home...')
      setErrorMessage(null)
      form.reset()
      setTimeout(() => {
        navigate({ to: '/' })
      }, 2000)
    },
    onError: (error: any) => {
      setErrorMessage(
        error?.message || 'Failed to reset password. Please try again.'
      )
      setSuccessMessage(null)
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setErrorMessage('Invalid reset link. Please request a new password reset.')
      return
    }
    mutation.mutate(data)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Password */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200"
          htmlFor="password"
        >
          New Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">
              lock
            </span>
          </div>
          <input
            id="password"
            className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary dark:focus:ring-primary/10"
            {...form.register('password')}
            placeholder="Enter new password"
            type={showPassword ? 'text' : 'password'}
            aria-describedby={
              form.formState.errors.password ? 'password-error' : undefined
            }
          />
          <button
            type="button"
            className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {showPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        </div>
        {form.formState.errors.password && (
          <p className="mt-1.5 text-xs text-red-500" id="password-error">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200"
          htmlFor="confirmPassword"
        >
          Confirm Password
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">
              lock
            </span>
          </div>
          <input
            id="confirmPassword"
            className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary dark:focus:ring-primary/10"
            {...form.register('confirmPassword')}
            placeholder="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            aria-describedby={
              form.formState.errors.confirmPassword ? 'confirmPassword-error' : undefined
            }
          />
          <button
            type="button"
            className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {showConfirmPassword ? 'visibility' : 'visibility_off'}
            </span>
          </button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-red-500" id="confirmPassword-error">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <div>
        <button
          className="cursor-pointer flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100"
          type="submit"
          disabled={mutation.isPending || !token}
        >
          {mutation.isPending ? (
            <span className="material-symbols-outlined animate-spin text-lg">
              progress_activity
            </span>
          ) : (
            <>
              Reset Password
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
