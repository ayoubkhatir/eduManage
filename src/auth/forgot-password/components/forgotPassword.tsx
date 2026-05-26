import { Link } from '@tanstack/react-router'
import ForgotPasswordForm from '../forgotPasswordForm'

export default function ForgotPassword() {
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
            Reset your password
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <ForgotPasswordForm />

        {/* Back to login link */}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Remember your password?{' '}
          <Link
            to="/"
            className="font-semibold text-primary hover:underline"
          >
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
