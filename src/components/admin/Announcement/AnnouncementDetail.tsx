import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { FaUserSecret, FaUserTie } from 'react-icons/fa'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { AnnouncementWithAuthor } from '#/types/announcementTypes'
import { stripHtmlTags } from '#/lib/utils'

type RoleColors = {
  bg: string
  text: string
  darkBg: string
  ring: string
  gradient: string
  badge: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
}

const roleConfig: Record<string, RoleColors> = {
  Admin: {
    bg: 'bg-red-50',
    text: 'text-red-600 dark:text-red-400',
    darkBg: 'dark:bg-red-500/10',
    ring: 'ring-red-500/20',
    gradient: 'from-red-500 to-rose-500',
    badge: 'destructive',
  },
  Teacher: {
    bg: 'bg-blue-50',
    text: 'text-blue-600 dark:text-blue-400',
    darkBg: 'dark:bg-blue-500/10',
    ring: 'ring-blue-500/20',
    gradient: 'from-blue-500 to-indigo-500',
    badge: 'secondary',
  },
}

const roleIcons: Record<string, React.ReactNode> = {
  Admin: <FaUserSecret className="size-5" />,
  Teacher: <FaUserTie className="size-5" />,
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function AnnouncementDetail({
  announcement,
}: {
  announcement: AnnouncementWithAuthor
}) {
  const role = announcement.author.role
  const colors = roleConfig[role] ?? roleConfig.Teacher
  const icon = roleIcons[role] ?? roleIcons.Teacher
  const initials = getInitials(announcement.author.name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-white/6 dark:bg-white/2"
    >
      {/* Gradient accent bar */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${colors.gradient}`}
      />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            {/* Role icon */}
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.ring} ring-1`}
            >
              {icon}
            </div>

            <div className="min-w-0 space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {announcement.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                {announcement.createdAt && (
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      calendar_today
                    </span>
                    {format(announcement.createdAt, 'MMM d, yyyy')}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>
                  {announcement.createdAt
                    ? format(announcement.createdAt, 'h:mm a')
                    : ''}
                </span>
              </div>
            </div>
          </div>

          <Badge variant={colors.badge} className="shrink-0 self-start">
            <span className="material-symbols-outlined text-[14px]">
              {role === 'Admin' ? 'admin_panel_settings' : 'school'}
            </span>
            {role}
          </Badge>
        </div>

        {/* Author info */}
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-white/4">
          <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {announcement.author.name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {announcement.author.email}
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Body */}
        <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {announcement.description ? (
            <div className="whitespace-pre-wrap">
              {stripHtmlTags(announcement.description)}
            </div>
          ) : (
            <p className="italic text-slate-400">No content provided.</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
