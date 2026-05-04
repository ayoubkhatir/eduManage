import { Link } from '@tanstack/react-router'
import type { Collection } from '@/services/api/teacher/types/modelType'

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-red-600',
  'from-violet-500 to-purple-600',
  'from-slate-500 to-slate-700',
]

function getGradientById(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }

  return gradients[Math.abs(hash) % gradients.length]
}

function formatDate(dateString: string) {
  const date = new Date(dateString)

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

type CollectionCardProps = {
  folder: Collection
  onDelete: (id: string) => void
  onEdit: (folder: Pick<Collection, 'id' | 'name'>) => void
}

export function CollectionCard({
  folder,
  onDelete,
  onEdit,
}: CollectionCardProps) {
  return (
    <div key={folder.id} className="relative">
      <button
        onClick={() => onDelete(folder.id)}
        className="size-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 z-30 absolute top-2 right-2 cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">delete</span>
      </button>
      <button
        onClick={() => onEdit({ id: folder.id, name: folder.name })}
        className="size-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 z-30 absolute top-2 right-12 cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg">edit</span>
      </button>
      <Link
        to={`/teacher/classes/$folderId`}
        params={{ folderId: folder.id.toString() }}
      >
        <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div
            className={`h-32 bg-linear-to-br ${getGradientById(folder.id)} p-4 flex justify-between items-start relative overflow-hidden`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <span className="material-symbols-outlined text-8xl text-white">
                folder
              </span>
            </div>
            <span className="material-symbols-outlined text-white text-3xl">
              folder
            </span>
          </div>
          <div className="p-4">
            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-1 group-hover:text-primary transition-colors">
              {folder.name}
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                <span className="material-symbols-outlined text-sm">description</span>
                <span>{folder.filesCount} files</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <span className="material-symbols-outlined text-xs">history</span>
                <span>Last updated: {formatDate(folder.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
