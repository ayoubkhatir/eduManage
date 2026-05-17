import { Link } from '@tanstack/react-router'
import { UserAvatar } from '../admin/Table/columnsData'
import { useLogout } from '#/services/api/auth.hooks'
import { Loader2Icon, LogOutIcon } from 'lucide-react'
import type { AuthUser } from '#/schemas/auth.schema'

export interface UserProfileProps {
  localPath: string
  onProfileClick: () => void
  user: AuthUser
}

export function UserProfile({
  localPath,
  onProfileClick,
  user,
}: UserProfileProps) {
  const { mutate: logout, isPending } = useLogout()

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 p-2.5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
      <Link
        onClick={onProfileClick}
        to={`/${localPath}/settings` as any}
        className="shrink-0 cursor-pointer rounded-lg transition-opacity hover:opacity-80"
      >
        <UserAvatar image={user.image} size={9} />
      </Link>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
          {user.gender === 'Male' ? 'Mr' : 'Ms'}. {user.name}
        </p>
        <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
          {user.role}
        </p>
      </div>

      <button
        onClick={() => logout()}
        disabled={isPending}
        className="cursor-pointer flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        aria-label="Logout"
        type="button"
      >
        {isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <LogOutIcon className="size-4" />
        )}
      </button>
    </div>
  )
}
