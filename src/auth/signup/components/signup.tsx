import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '../signup.schema.ts'

import type { SignupFormValues } from '../signup.schema.ts'

export function RightPanel() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (_data: SignupFormValues) => {
    // // await new Promise((resolve) => setTimeout(resolve, 1000))
    navigate({
      to: '/owner/dashboard',
      replace: true,
    })
  }
  return (
    <div className="flex w-full flex-1 self-stretch flex-col justify-center bg-white dark:bg-background-dark overflow-y-auto overflow-x-hidden px-1 py-3 lg:px-15 xl:px-20">
      <div className="mx-auto w-full max-w-130">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden mb-8 pl-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/70 border border-primary/90 text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#4c669a] dark:text-white">
            School Manager
          </h2>
        </div>
        {/* <!-- Header --> */}
        <div className="mb-5">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#0d121b] dark:text-white ">
            Owner Registration
          </h1>
          <p className="mt-1 text-[#4c669a] dark:text-[#94a3b8] text-sm">
            Start managing your school today with our comprehensive dashboard.
          </p>
        </div>
        {/* <!-- Form --> */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* <!-- Full Name --> */}
            <div>
              <div className="flex items-center justify-between mb-2 ">
                <label className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-normal">
                  Full Name
                </label>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span
                    className="material-symbols-outlined text-[#616f89] dark:text-gray-400"
                    style={{ fontSize: 20 }}
                  >
                    person
                  </span>
                </div>
                <input
                  id="full-name"
                  className="form-input block w-full rounded-lg border-0 py-0 h-10 pl-12  text-[#111318] dark:text-white dark:bg-[#1a2234] shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 placeholder:text-[#616f89] dark:placeholder:text-gray-500  focus:ring-inset  sm:text-base sm:leading-6"
                  {...register('fullName')}
                  placeholder="Enter Full Name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            {/* <!-- School Name --> */}
            <div>
              <div className="flex items-center justify-between mb-2 ">
                <label className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-normal">
                  School Name
                </label>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span
                    className="material-symbols-outlined text-[#616f89] dark:text-gray-400"
                    style={{ fontSize: 20 }}
                  >
                    domain
                  </span>
                </div>
                <input
                  id="school-name"
                  className="form-input block w-full rounded-lg border-0 py-0 h-10 pl-12  text-[#111318] dark:text-white dark:bg-[#1a2234] shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 placeholder:text-[#616f89] dark:placeholder:text-gray-500  focus:ring-inset  sm:text-base sm:leading-6"
                  {...register('schoolName')}
                  placeholder="Enter School Name"
                />
              </div>
              {errors.schoolName && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.schoolName.message}
                </p>
              )}
            </div>
          </div>
          {/* <!-- Work Email --> */}
          <div>
            <label
              className="block text-sm font-medium leading-6 text-[#111318] dark:text-white mb-2"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span
                  className="material-symbols-outlined text-[#616f89] dark:text-gray-400"
                  style={{ fontSize: 20 }}
                >
                  Email
                </span>
              </div>
              <input
                id="email"
                className="form-input block w-full rounded-lg border-0 py-0 h-10 pl-12 text-[#111318] dark:text-white dark:bg-[#1a2234] shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 placeholder:text-[#616f89] dark:placeholder:text-gray-500  focus:ring-inset  sm:text-base sm:leading-6"
                {...register('email')}
                placeholder="name@school.com"
                type="email"
              />
            </div>
            {errors.email && (
              <p className=" mt-2 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* <!-- Password Fields Row --> */}
          <div className="flex flex-col sm:flex-row gap-5">
            <div>
              <div className="flex items-center justify-between mb-2 ">
                <label className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-normal">
                  Password
                </label>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span
                    className="material-symbols-outlined text-[#616f89] dark:text-gray-400"
                    style={{ fontSize: 20 }}
                  >
                    lock
                  </span>
                </div>
                <input
                  id="password"
                  className="form-input block w-full rounded-lg border-0 py-0 h-10 pl-12  text-[#111318] dark:text-white dark:bg-[#1a2234] shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 placeholder:text-[#616f89] dark:placeholder:text-gray-500  focus:ring-inset  sm:text-base sm:leading-6"
                  {...register('password')}
                  placeholder="Enter Password"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2 ">
                <label className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-normal">
                  Confirm Password
                </label>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span
                    className="material-symbols-outlined text-[#616f89] dark:text-gray-400"
                    style={{ fontSize: 20 }}
                  >
                    lock_reset
                  </span>
                </div>
                <input
                  id="password"
                  className="form-input block w-full rounded-lg border-0 py-0 h-10 pl-12  text-[#111318] dark:text-white dark:bg-[#1a2234] shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 placeholder:text-[#616f89] dark:placeholder:text-gray-500  focus:ring-inset  sm:text-base sm:leading-6"
                  {...register('confirmPassword')}
                  placeholder="Enter Password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          {/* <!-- Terms --> */}
          <div>
            <div className="flex items-start">
              <div className="flex h-5 items-center pl-1">
                <input
                  {...register('terms')}
                  className="h-5 w-5 rounded border-slate-200 dark:border-slate-600 bg-white dark:bg-surface-dark text-primary focus:ring-primary"
                  id="terms"
                  name="terms"
                  type="checkbox"
                />
              </div>
              <div className="ml-3 text-sm leading-6">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  I agree to the{' '}
                  <a
                    className="font-semibold text-primary hover:text-primary/80"
                    href="#"
                  >
                    Terms
                  </a>{' '}
                  and{' '}
                  <a
                    className="font-semibold text-primary hover:text-primary/80"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-600 mt-1">
                {errors.terms.message}
              </p>
            )}
          </div>
          {/* <!-- Submit Button --> */}
          <button
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-blue-600 hover:shadow-primary/40 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            type="submit"
          >
            {isSubmitting ? 'Creating...' : 'Create Owner Account'}
          </button>
        </form>
        {/* <!-- Divider --> */}
        <div className="relative mt-5">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center"
          >
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background-light dark:bg-background-dark px-2 text-sm text-slate-500">
              Log in
            </span>
          </div>
        </div>
        {/* <!-- Login Link --> */}
        <p className="mt-3 mb-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?
          <Link
            className="font-semibold leading-6 text-primary hover:text-primary/80 gap-1 ml-1"
            to="/log-in"
            search={{ role: 'owner', redirectTo: '/owner/dashboard' }}
            replace={true}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
