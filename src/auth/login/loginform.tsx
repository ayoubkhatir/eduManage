import { useState } from 'react'

import {useLogin} from "#/services/api/auth.hooks"
import type { AuthRole } from '#/schemas/shared.schema'



export default function Loginform({ redirectTo , role }: { redirectTo: string,  role: AuthRole }) {
  
  
  /* visible password */
  const [showPassword, setShowPassword] = useState(false)
  
  const {form , errorMessage , onSubmit } = useLogin(redirectTo , role)
  

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label
          className="block text-xs font-semibold text-[#111318] dark:text-white mb-1.5"
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
            className="form-input block w-full rounded-lg border-0 py-0 h-10 pl-12 text-[#111318] dark:text-white dark:bg-[#1a2234] shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 placeholder:text-[#616f89] dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary text-sm"
            {...form.register('email')}
            placeholder="name@school.com"
            type="email"
          />
        </div>
        {form.formState.errors.email && (
          <p className="mt-1 text-xs text-red-600" id="email-error">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            className="block text-xs font-semibold text-[#111318] dark:text-white"
            htmlFor="password"
          >
            Password
          </label>
          <div className="text-sm">
            <a
              className="font-medium text-primary hover:text-primary/80"
              href="#"
            >
              Forgot password?
            </a>
          </div>
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
            className="form-input block w-full rounded-lg border-0 py-0 h-10 pl-12 pr-12 text-[#111318] dark:text-white dark:bg-[#1a2234] shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 placeholder:text-[#616f89] dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary text-sm"
            {...form.register('password')}
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer group">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span
                className="material-symbols-outlined text-[#616f89] dark:text-gray-400 group-hover:text-primary cursor-pointer"
                style={{ fontSize: 20 }}
              >
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>
        {form.formState.errors.password && (
          <p className="mt-1 text-xs text-red-600" id="password-error">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div>
        <button
          className="flex w-full justify-center items-center rounded-lg bg-primary h-10 px-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transform hover:scale-[1.01] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            transition:
              'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
          }}
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          Log In
          <span className="material-symbols-outlined ml-2 text-[18px]">
            arrow_forward
          </span>
        </button>
        {errorMessage && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  )
}
