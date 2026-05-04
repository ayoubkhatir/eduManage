import { createFileRoute } from '@tanstack/react-router'
import { EyeIcon, EyeOffIcon, Loader2Icon, LogInIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLogin } from '#/services/api/auth.hooks'
import { Logo } from '#/components/logo'
import { FormProvider, useFormContext } from 'react-hook-form'
import { useState } from 'react'
import type { LoginSchema } from '#/schemas/auth.schema'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { form, onSubmit, isPending } = useLogin()
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-center w-full mb-8">
          <Logo />
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Login
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your school dashboard.
          </p>
        </div>

        <FormProvider {...form}>
          {' '}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...form.register('email')}
                className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              {form.formState.errors.email ? (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Password
              </label>
              <PasswordInput />
              {form.formState.errors.password ? (
                <p className="text-sm text-red-500">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="mr-2 size-4 animate-spin" />
              ) : (
                <LogInIcon className="mr-2 size-4" />
              )}
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

function PasswordInput() {
  const form = useFormContext<LoginSchema>()
  const [showPassword, setShowPassword] = useState(false)
  const ShowPasswordButton = showPassword ? EyeOffIcon : EyeIcon
  function toggle() {
    setShowPassword((s) => !s)
  }
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        {...form.register('password')}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
      <button
        type="button"
        onClick={toggle}
        className="h-11 absolute right-2 top-0 cursor-pointer"
        title={showPassword ? 'hide' : 'show'}
      >
        <ShowPasswordButton />
      </button>
    </div>
  )
}
