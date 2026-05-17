import AddButton from './AddButton'

export type filter = {
  label: string
  value: string | null
}

type props = {
  children: React.ReactNode
  role: 'Student' | 'Teacher'
}

export default function IndexPageComponent({ role, children }: props) {
  return (
    <div className="flex-1 overflow-y-auto p-6 pt-2">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {role === 'Student' ? 'Student Directory' : 'Faculty Directory'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {role === 'Student'
                ? 'Manage student enrollments, records, and academic status.'
                : 'Manage faculty information, courses, and academic responsibilities.'}
            </p>
          </div>
          <AddButton role={role} />
        </div>

        {children}

        <footer className="mt-8 mb-4 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} EduManage School System. All rights
          reserved.
        </footer>
      </div>
    </div>
  )
}
