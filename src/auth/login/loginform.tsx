import { useState } from 'react'
import { useLogin } from '#/hooks/auth/hooks'
import { Link } from '@tanstack/react-router'
import type { UserRole } from '#/types/authTypes'

export default function Loginform({
  redirectTo,
  role,
}: {
  redirectTo: string
  role: UserRole
}) {
  const [showPassword, setShowPassword] = useState(false)
  const { form, errorMessage, onSubmit } = useLogin(redirectTo, role)

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

      {/* Password */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
            htmlFor="password"
          >
            Password
          </label>
          <Link
            to="/forgot-password"
            className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
          >
            Forgot password?
          </Link>
        </div>
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
            placeholder="Enter your password"
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

      {/* Submit */}
      <div>
        <button
          className="cursor-pointer flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <span className="material-symbols-outlined animate-spin text-lg">
              progress_activity
            </span>
          ) : (
            <>
              Log In
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </>
          )}
        </button>
        {errorMessage && (
          <p className="mt-3 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  )
}
