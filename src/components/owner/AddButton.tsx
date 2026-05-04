import { Link } from '@tanstack/react-router'

export default function AddButton({ role }: { role: string }) {
  return role.toLowerCase() === 'student' ? (
    <Link to="/owner/students/add">
      <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm shadow-blue-500/30 active:scale-95 cursor-pointer">
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span>Add New Student</span>
      </button>
    </Link>
  ) : (
    <Link to="/owner/teachers/add">
      <button className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm shadow-blue-500/30 active:scale-95 cursor-pointer">
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span className="font-medium">Add New Teacher</span>
      </button>
    </Link>
  )
}
