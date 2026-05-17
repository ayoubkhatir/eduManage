import { Link} from '@tanstack/react-router'
import SignupForm from "../signupForm"
import { UserRoleEnum } from '#/server/db/schema'


export function RightPanel() {
  
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
            Admin Registration
          </h1>
          <p className="mt-1 text-[#4c669a] dark:text-[#94a3b8] text-sm">
            Start managing your school today with our comprehensive dashboard.
          </p>
        </div>
        {/* <!-- Form --> */}
        <SignupForm />
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
            search={{ role: UserRoleEnum.ADMIN, redirectTo: '/admin/dashboard' }}
            replace={true}
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
