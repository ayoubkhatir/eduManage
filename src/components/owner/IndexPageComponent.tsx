import AddButton from './AddButton'

export type filter = {
  label: string
  value: string | null
}

type props = {
  children: React.ReactNode
  role: 'student' | 'teacher'
}

export default function IndexPageComponent({ role, children }: props) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
              {role === 'student' ? 'Student Directory' : 'Faculty Directory'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              {role === 'student'
                ? 'Manage student enrollments, records, and academic status.'
                : 'Manage faculty information, courses, and academic responsibilities.'}
            </p>
          </div>
          <AddButton role={role} />
        </div>

        {children}
        <footer className="mt-12 mb-6 text-center text-xs text-slate-400">
          © 2026 EduManage School System. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
