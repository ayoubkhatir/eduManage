import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { resourceSchema } from './res.schema'

import type { ResourceType } from './res.schema'
import type { SubmitHandler } from 'react-hook-form'
import type { Collection } from '@/services/api/teacher/types/modelType'

export default function SendResForm({
  folders,
}: {
  folders: Array<Collection>
}) {
  /* form validation  */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResourceType>({
    resolver: zodResolver(resourceSchema),
    mode: 'onSubmit',
  })

  /* Submit function */
  const onSubmit: SubmitHandler<ResourceType> = async (_data) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    reset()
  }

  /* default value*/
  const defaultValue = {
    category: 'Mathematics',
    class: ['Grade 10 - Math', 'Grade 11 - Math', 'Grade 12 - Math'].join(
      '   |   ',
    ),
  }

  return (
    <div className="px-6 mb-8">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <div className="p-1.5 flex justify-center rounded-md bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[20px]">send</span>
          </div>
          Send New Resource
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-12 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Resource Title
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-primary shadow-sm text-sm py-2.5 px-3"
                placeholder="e.g. Algebra Chapter 5 Summary"
                type="text"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <input
                    disabled
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-primary shadow-sm text-sm py-2.5 px-3 cursor-not-allowed"
                    type="text"
                    value={defaultValue.category}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Class/Student Selection
                </label>
                <div className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm min-h-11 px-2 py-1.5 flex flex-wrap gap-2 items-center cursor-text focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                  <input
                    className="flex-1 bg-transparent border-none p-0 text-sm text-slate-900 dark:text-white focus:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 min-w-20 cursor-not-allowed"
                    value={defaultValue.class}
                    disabled
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Destination Folder
              </label>
              <div className="relative">
                <select
                  {...register('folder')}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500  shadow-sm text-sm py-2.5 px-3 pr-10  appearance-none cursor-pointer "
                >
                  <option value="">Select a folder...</option>
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
                {errors.folder && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.folder.message}
                  </p>
                )}
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary focus:border-primary shadow-sm text-sm p-2.5 resize-none"
                placeholder="Add specific instructions for students..."
                rows={3}
                {...register('description')}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer bg-primary hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:bg-primary/50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
                Save Resource
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
