import { useSignup } from '#/hooks/auth/hooks'

export default function Signup() {
  const { form, errorMessage, onSubmit } = useSignup()

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Name + School */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">
                person
              </span>
            </div>
            <input
              id="fullName"
              className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary dark:focus:ring-primary/10"
              {...form.register('fullName')}
              placeholder="John Doe"
            />
          </div>
          {form.formState.errors.fullName && (
            <p className="mt-1.5 text-xs text-red-500">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200"
            htmlFor="schoolName"
          >
            School Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">
                domain
              </span>
            </div>
            <input
              id="schoolName"
              className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary dark:focus:ring-primary/10"
              {...form.register('schoolName')}
              placeholder="Sunnydale Academy"
            />
          </div>
          {form.formState.errors.schoolName && (
            <p className="mt-1.5 text-xs text-red-500">
              {form.formState.errors.schoolName.message}
            </p>
          )}
        </div>
      </div>

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
          />
        </div>
        {form.formState.errors.email && (
          <p className="mt-1.5 text-xs text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label
          className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200"
          htmlFor="gender"
        >
          Gender
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">
              people
            </span>
          </div>
          <select
            id="gender"
            className="block h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-primary dark:focus:ring-primary/10"
            {...form.register('gender')}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </span>
        </div>
        {form.formState.errors.gender && (
          <p className="mt-1.5 text-xs text-red-500">
            {form.formState.errors.gender.message}
          </p>
        )}
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-200"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <span className="material-symbols-outlined text-[18px] text-slate-400 dark:text-slate-500">
                lock
              </span>
            </div>
            <input
              id="password"
              className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary dark:focus:ring-primary/10"
              {...form.register('password')}
              placeholder="••••••••"
              type="password"
            />
          </div>
          {form.formState.errors.password && (
            <p className="mt-1.5 text-xs text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

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
                lock_reset
              </span>
            </div>
            <input
              id="confirmPassword"
              className="block h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-primary dark:focus:ring-primary/10"
              {...form.register('confirmPassword')}
              placeholder="••••••••"
              type="password"
            />
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="mt-1.5 text-xs text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        disabled={form.formState.isSubmitting}
        className="cursor-pointer flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100"
        type="submit"
      >
        {form.formState.isSubmitting ? (
          <span className="material-symbols-outlined animate-spin text-lg">
            progress_activity
          </span>
        ) : (
          'Create Admin Account'
        )}
      </button>
      {errorMessage && (
        <p className="text-center text-xs text-red-500">{errorMessage}</p>
      )}
    </form>
  )
}
