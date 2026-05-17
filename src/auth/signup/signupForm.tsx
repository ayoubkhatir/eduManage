import {useSignup} from "#/services/api/auth.hooks"



export default function Signup() {


			
			const {form , errorMessage , onSubmit } = useSignup()


    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                  {...form.register('fullName')}
                  placeholder="Enter Full Name"
                />
              </div>
              {form.formState.errors.fullName && (
                <p className="mt-2 text-xs text-red-600">
                  {form.formState.errors.fullName.message}
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
                  {...form.register('schoolName')}
                  placeholder="Enter School Name"
                />
              </div>
              {form.formState.errors.schoolName && (
                <p className="mt-2 text-xs text-red-600">
                  {form.formState.errors.schoolName.message}
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
                {...form.register('email')}
                placeholder="name@school.com"
                type="email"
              />
            </div>
            {form.formState.errors.email && (
              <p className=" mt-2 text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          {/* <!-- Gender --> */}
          <div>
            <div className="flex items-center justify-between mb-2 ">
              <label className="text-slate-700 dark:text-slate-300 text-xs font-medium leading-normal">
                Gender
              </label>
            </div>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span
                  className="material-symbols-outlined text-[#616f89] dark:text-gray-400"
                  style={{ fontSize: 20 }}
                >
                  people
                </span>
              </div>
              <select
                id="gender"
                className="form-input block w-full rounded-lg border-0 py-0 h-10 pl-12 pr-3 text-[#111318] dark:text-white dark:bg-[#1a2234] shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-600 placeholder:text-[#616f89] dark:placeholder:text-gray-500 focus:ring-inset sm:text-base sm:leading-6 appearance-none"
                {...form.register('gender')}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {form.formState.errors.gender && (
              <p className="mt-2 text-xs text-red-600">
                {form.formState.errors.gender.message}
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
                  {...form.register('password')}
                  placeholder="Enter Password"
                />
              </div>
              {form.formState.errors.password && (
                <p className="mt-2 text-xs text-red-600">
                  {form.formState.errors.password.message}
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
                  {...form.register('confirmPassword')}
                  placeholder="Enter Password"
                />
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="mt-2 text-xs text-red-600">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
          {/* <!-- Terms --> */}
          {/* <div>
            <div className="flex items-start">
              <div className="flex h-5 items-center pl-1">
                <input
                  {...form.register('terms')}
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
          </div>*/}
          {/* <!-- Submit Button --> */}
          <button
            disabled={form.formState.isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-blue-600 hover:shadow-primary/40 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            type="submit"
          >
              {form.formState.isSubmitting ? 'Creating...' : 'Create Admin Account'}
          </button>
					{errorMessage && (
						<p className="mt-2 text-xs text-red-600">
							{errorMessage}
						</p>
					)}
        </form>
    )
}