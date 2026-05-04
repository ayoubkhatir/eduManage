import { Controller } from 'react-hook-form'
import { NotificationAudienceField } from './NotificationAudienceField'
import { NotificationAttachmentsField } from './NotificationAttachmentsField'
import { useNotificationForm } from '@/hooks/teacher/use-notification-form'
import QuillEditor from '#/components/ui/quillEditor'

export function NotificationForm({ role }: { role: 'teacher' | 'admin' }) {
  const {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    selectedSendTo,
    sendToList,
    isSendToLoading,
    isSendToError,
    removeSendTo,
    toggleSendTo,
    hasAttachments,
    isUploading,
    attachmentFiles,
    getFileProgress,
    formatFileSize,
    removeAttachment,
    clearAttachments,
    uploadProgress,
    selectionProgress,
    isPublishPending,
    isPublishError,
  } = useNotificationForm(role)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              edit_note
            </span>
            New Announcement
          </h3>
        </div>

        <div className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Subject
            </label>
            <input
              {...register('subject')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-slate-400"
              placeholder="e.g. Science Fair Registration Open"
              type="text"
            />
            {errors.subject && (
              <span className="text-xs text-red-500 mt-1">
                {errors.subject.message}
              </span>
            )}
          </div>

          {role === 'admin' && (
            <NotificationAudienceField
              selectedSendTo={selectedSendTo}
              sendToList={sendToList}
              isSendToLoading={isSendToLoading}
              isSendToError={isSendToError}
              onRemove={removeSendTo}
              onToggle={toggleSendTo}
              errorMessage={errors.sendTo?.message}
            />
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Type
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Teacher">General</option>
              <option value="Urgent">Urgent</option>
              <option value="Administrative">Administrative</option>
              <option value="User">User</option>
              <option value="Grade">Grade</option>
              <option value="Book">Book</option>
            </select>
          </div>
          {errors.type && (
            <span className="text-xs text-red-500 mt-1">{errors.type.message}</span>
          )}

          <NotificationAttachmentsField
            register={register}
            hasAttachments={hasAttachments}
            isUploading={isUploading}
            attachmentFiles={attachmentFiles}
            getFileProgress={getFileProgress}
            formatFileSize={formatFileSize}
            onRemoveAttachment={removeAttachment}
            onClearAttachments={clearAttachments}
            uploadProgress={uploadProgress}
            selectionProgress={selectionProgress}
            errorMessage={errors.attachments?.message}
          />

          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Content
          </label>
          <Controller
            name="content"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <QuillEditor value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.content && (
            <span className="text-xs text-red-500 mt-1">
              {errors.content.message}
            </span>
          )}
        </div>
        <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="px-4 py-2 min-w-40" />
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              disabled={isSubmitting || isPublishPending}
            >
              <span>Publish Now</span>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
        {isPublishError && (
          <div className="px-5 pb-4">
            <p className="text-xs text-red-500">
              Couldn&apos;t publish notification. Please try again.
            </p>
          </div>
        )}
      </form>
    </>
  )
}