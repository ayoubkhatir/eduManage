import { Controller } from 'react-hook-form'
import QuillEditor from '@/components/ui/quillEditor'
import { useAnnouncementForm } from '@/hooks/use-announcement-form'
import type { AdminUser } from '#/types/usersTypes'
import type { TeacherUser } from '#/types/teacherTypes'
import { announcementAudienceList } from '#/server/db/schema'

export function AnnouncementForm({ user }: { user: AdminUser | TeacherUser }) {
  const {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    isLoading,
    isError,
  } = useAnnouncementForm(user)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              campaign
            </span>
            New Announcement
          </h3>
        </div>

        <div className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Title
            </label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
              placeholder="e.g. Science Fair Registration Open"
              type="text"
            />
            {errors.title && (
              <span className="text-xs text-red-500 mt-1">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Audience
            </label>
            <select
              {...register('audience')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              {announcementAudienceList
                .filter((s) => s.toLowerCase() !== 'teachers')
                .map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
            </select>
            {errors.audience && (
              <span className="text-xs text-red-500 mt-1">
                {errors.audience.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Content
            </label>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <QuillEditor value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.description && (
              <span className="text-xs text-red-500 mt-1">
                {errors.description.message}
              </span>
            )}
          </div>
        </div>

        <div className="px-5 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="px-4 py-2 min-w-40" />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-primary border border-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              disabled={isSubmitting || isLoading}
            >
              <span>Publish</span>
              <span className="material-symbols-outlined text-[12px]">
                send
              </span>
            </button>
          </div>
        </div>
        {isError && (
          <div className="px-5 pb-4">
            <p className="text-xs text-red-500">
              Couldn&apos;t publish announcement. Please try again.
            </p>
          </div>
        )}
      </form>
    </>
  )
}
