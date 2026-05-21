import { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { FaMeta } from 'react-icons/fa6'
import { Link } from '@tanstack/react-router'
import { UserRoleEnum } from '#/server/db/schema'
import Loginform from '../loginform'
import { loginOAuthServer } from '#/server/modules/auth/auth.server-function'
import type { logInSearch } from '#/routes/log-in'

const roleConfig: Record<
  string,
  { heading: string; sub: string; icon: string }
> = {
  Admin: {
    heading: 'Manage your school',
    sub: 'Teachers, students & operations',
    icon: 'domain',
  },
  Teacher: {
    heading: 'Welcome back, teacher',
    sub: 'Manage your classes and students',
    icon: 'auto_stories',
  },
  Student: {
    heading: 'Welcome back',
    sub: 'Access your classes and grades',
    icon: 'backpack',
  },
}
const roles = [
  UserRoleEnum.ADMIN,
  UserRoleEnum.TEACHER,
  UserRoleEnum.STUDENT,
] as const

export default function Login({ role, redirectTo }: logInSearch) {
  const otherRoles = roles.filter((r) => r !== role)
  const [errorMessageOAuth, setErrorMessageOAuth] = useState<string | null>(
    null,
  )

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      setErrorMessageOAuth(null)
      const response = await loginOAuthServer({ data: { provider } })

      if (!response.success) {
        setErrorMessageOAuth(response?.message!)
        return
      }

      const redirectUrl = response?.data?.url
      if (!redirectUrl) {
        setErrorMessageOAuth('No redirect URL received. Please try again.')
        return
      }

      window.location.assign(redirectUrl)
    } catch {
      setErrorMessageOAuth('Failed to initiate social login. Please try again.')
    }
  }

  const config = roleConfig[role] ?? roleConfig.Student

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

        {/* Role badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="material-symbols-outlined text-sm">
              {config.icon}
            </span>
            {role} Portal
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {config.heading}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {config.sub}
          </p>
        </div>

        {/* Form */}
        <Loginform redirectTo={redirectTo} role={role} />

        {/* OAuth (Admin only) */}
        {role === UserRoleEnum.ADMIN && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs font-medium">
                <span className="bg-white px-3 text-slate-400 dark:bg-[#0d1117] dark:text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => handleOAuthLogin('google')}
              >
                <FaGoogle className="h-4 w-4" />
                Google
              </button>
              <button
                type="button"
                className="cursor-pointer flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
                onClick={() => handleOAuthLogin('facebook')}
              >
                <FaMeta className="h-4 w-4" />
                Meta
              </button>
            </div>
            {errorMessageOAuth && (
              <p className="mt-3 text-center text-xs text-red-500">
                {errorMessageOAuth}
              </p>
            )}
          </div>
        )}

        {/* Sign up link (Admin only) */}
        {role === UserRoleEnum.ADMIN && (
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              to="/sign-up"
              replace
              className="font-semibold text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        )}

        {/* Role switcher */}
        <div className="mt-8">
          <p className="mb-3 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
            Login as a different role
          </p>
          <div className="flex justify-center gap-2">
            {otherRoles.map((r) => (
              <Link
                to="/log-in"
                replace
                key={r}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-primary/40 dark:hover:bg-primary/10 dark:hover:text-primary"
                search={{
                  role: r,
                  redirectTo: `/${r.toLowerCase()}/calendar`,
                }}
              >
                {r}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex justify-center gap-4 text-xs text-slate-400 dark:text-slate-500">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy
          </a>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <a className="hover:text-primary transition-colors" href="#">
            Terms
          </a>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <a className="hover:text-primary transition-colors" href="#">
            Help
          </a>
        </div>
      </div>
    </div>
  )
}
