import { memo } from 'react'
import type { UseFormRegister } from 'react-hook-form'
import type { PubNotificationType } from '../pubnotification.schema.ts'

export const NotificationAttachmentsField = memo(function NotificationAttachmentsField({
  register,
  hasAttachments,
  isUploading,
  attachmentFiles,
  getFileProgress,
  formatFileSize,
  onRemoveAttachment,
  onClearAttachments,
  uploadProgress,
  selectionProgress,
  errorMessage,
}: {
  register: UseFormRegister<PubNotificationType>
  hasAttachments: boolean
  isUploading: boolean
  attachmentFiles: Array<File>
  getFileProgress: (index: number) => number
  formatFileSize: (size: number) => string
  onRemoveAttachment: (index: number) => void
  onClearAttachments: () => void
  uploadProgress: number
  selectionProgress: number
  errorMessage?: string
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        attachments
      </p>
      <input
        id="file-upload"
        type="file"
        {...register('attachments')}
        multiple
        className="sr-only"
      />
      <label
        htmlFor="file-upload"
        className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/70 hover:border-slate-400 dark:hover:border-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <span className="material-symbols-outlined text-[18px]">upload_file</span>
        Add Attachments
      </label>
      {hasAttachments && (
        <button
          type="button"
          className="ml-2 mt-2 inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          onClick={onClearAttachments}
          disabled={isUploading}
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
          Clear All
        </button>
      )}
      {errorMessage && <span className="text-xs text-red-500 mt-1 block">{errorMessage}</span>}

      {(hasAttachments || isUploading) && (
        <div className="mt-3 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/30 p-3 space-y-2">
          {attachmentFiles.map((file, index) => {
            const fileProgress = getFileProgress(index)
            const isCompleted = fileProgress >= 100

            return (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 p-2.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 dark:text-slate-300 text-[20px]">
                      draft
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formatFileSize(file.size)} - {file.type || 'Unknown file'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300 whitespace-nowrap">
                      {isCompleted ? 'Completed' : `${fileProgress}%`}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveAttachment(index)}
                      disabled={isUploading}
                      className="size-6 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${fileProgress}%` }}
                  />
                </div>
              </div>
            )
          })}

          <div className="pt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
            <span>{isUploading ? 'Uploading attachments...' : 'Attachments ready'}</span>
            <span>{isUploading ? `${uploadProgress}%` : `${selectionProgress}%`}</span>
          </div>
        </div>
      )}
    </div>
  )
})