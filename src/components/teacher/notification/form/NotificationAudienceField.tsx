import { memo } from 'react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Button } from '../../../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '../../../ui/dialog'
import type { RecipientOption } from '@/hooks/teacher/use-notification-form'

export const NotificationAudienceField = memo(function NotificationAudienceField({
  selectedSendTo,
  sendToList,
  isSendToLoading,
  isSendToError,
  onRemove,
  onToggle,
  errorMessage,
}: {
  selectedSendTo: Array<string>
  sendToList: Array<RecipientOption>
  isSendToLoading: boolean
  isSendToError: boolean
  onRemove: (value: string) => void
  onToggle: (value: string) => void
  errorMessage?: string
}) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Send To
        </label>
        <div className="flex gap-3 flex-wrap">
          {selectedSendTo.map((value) => {
            const item = sendToList.find((option) => option.value === value)
            if (!item) return null

            return (
              <div
                key={item.value}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-300 dark:border-slate-700"
              >
                <span>{item.label}</span>
                <button
                  type="button"
                  className="size-4 flex items-center justify-center rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  onClick={() => onRemove(value)}
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )
          })}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="inline-flex items-center justify-center size-8 rounded-full border-2 border-dashed bg-transparent border-slate-300 dark:border-slate-600 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm bg-background-light dark:bg-background-dark">
              <DialogHeader>
                <DialogTitle className="font-bold text-slate-900 dark:text-white">
                  Select Audience
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Choose who will receive this announcement.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 flex flex-col gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg max-h-60 overflow-y-auto">
                {isSendToLoading ? (
                  <p className="text-center text-xs text-slate-400 py-4">
                    Loading audience list...
                  </p>
                ) : isSendToError ? (
                  <p className="text-center text-xs text-red-400 py-4">
                    Failed to load audience list.
                  </p>
                ) : sendToList.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-4">
                    No options available.
                  </p>
                ) : (
                  sendToList.map((item) => {
                    const isSelected = selectedSendTo.includes(item.value)

                    return (
                      <button
                        key={item.value}
                        type="button"
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 text-primary border border-primary'
                            : 'bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                        }`}
                        onClick={() => onToggle(item.value)}
                      >
                        <span>{item.label}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[18px]">
                            check_circle
                          </span>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {errorMessage && <span className="text-xs text-red-500 mt-1">{errorMessage}</span>}
    </>
  )
})