import { Link } from '@tanstack/react-router'

export default function AddButton({ role }: { role: string }) {
  const isStudent = role.toLowerCase() === 'student'
  return (
    <Link to={isStudent ? '/admin/students/add' : '/admin/teachers/add'}>
      <button className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600">
        <span className="material-symbols-outlined text-[18px]">add</span>
        <span>Add New {isStudent ? 'Student' : 'Teacher'}</span>
      </button>
    </Link>
  )
}
