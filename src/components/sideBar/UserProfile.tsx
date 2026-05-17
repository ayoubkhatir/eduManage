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
    <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-2.5">
      <Link onClick={onProfileClick} to={`/${localPath}/settings` as any}>
        <UserAvatar image={user.image} size={9} />
        {/* <Avatar
          alt="profile picture"
          src={avatarSrc}
          sx={{ width: 36, height: 36 }}
        /> */}
      </Link>
      <div className="flex flex-col min-w-0 flex-1">
        <h1 className="text-slate-900 dark:text-slate-100 text-sm font-semibold truncate">
          {user.gender === 'Male' ? 'Mr' : 'Ms'}. {user.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-normal truncate">
          {user.role}
        </p>
      </div>
      <button
        onClick={() => logout()}
        className="text-slate-500 dark:text-slate-400 hover:text-primary cursor-pointer transition-colors"
        aria-label="Logout"
      >
        {isPending ? (
          <Loader2Icon className="size-5 animate-spin" />
        ) : (
          <LogOutIcon className="size-5" />
        )}
      </button>
    </div>
  )
}
