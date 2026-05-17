import { Link } from '@tanstack/react-router'
import SignupForm from '../signupForm'
import { UserRoleEnum } from '#/server/db/schema'

export function RightPanel() {
  return (
    <div className="flex w-full flex-1 flex-col justify-center overflow-y-auto bg-white px-5 py-8 dark:bg-[#0d1117] sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-md">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-md shadow-primary/25">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            EduManage
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Create admin account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Start managing your school today with our comprehensive dashboard.
          </p>
        </div>

        {/* Form */}
        <SignupForm />

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-slate-400 dark:bg-[#0d1117] dark:text-slate-500">
              Already have an account?
            </span>
          </div>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          <Link
            className="font-semibold text-primary hover:underline"
            to="/log-in"
            search={{
              role: UserRoleEnum.ADMIN,
              redirectTo: '/admin/dashboard',
            }}
            replace
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
