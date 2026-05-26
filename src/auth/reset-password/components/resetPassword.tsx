import { useSearch } from '@tanstack/react-router'
import ResetPasswordForm from '../resetPasswordForm'
import type { ResetPasswordSearch } from '#/routes/reset-password'

export default function ResetPassword() {
  const { token } = useSearch({ from: '/reset-password' }) as ResetPasswordSearch

  return (
    <div className="flex w-full flex-col justify-center overflow-y-auto px-5 py-8 sm:px-8 lg:w-[45%] lg:px-12 xl:px-16 bg-white dark:bg-[#0d1117] z-10">
      <div className="mx-auto w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-blue-600 text-white shadow-md shadow-primary/25">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            EduManage
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Create new password
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Enter a new password to regain access to your account
          </p>
        </div>

        {!token && (
          <div className="rounded-xl bg-yellow-50 p-4 mb-6 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Invalid or expired reset link. Please request a new password reset.
            </p>
          </div>
        )}

        {/* Form */}
        <ResetPasswordForm />
      </div>
    </div>
  )
}
