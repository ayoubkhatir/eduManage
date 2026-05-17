import { uploadToCloudinary } from '#/components/cloudinary-uploader'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '#/components/ui/dialog'
import { cld } from '#/lib/cloudinary'
import { AdvancedImage } from '@cloudinary/react'
import { thumbnail } from '@cloudinary/url-gen/actions/resize'
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners'
import { CameraIcon, Loader2Icon, Trash2Icon, UploadIcon, UserCircleIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

type AvatarUploadCardProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  imageField: Path<T>
  title?: string
  description?: string
}

export function AvatarUploadCard<T extends FieldValues>({
  form,
  imageField,
  title = 'Profile Picture',
  description = 'Click the avatar to update the picture',
}: AvatarUploadCardProps<T>) {
  const savedPublicId = (form.watch(imageField) as string) || ''
  const [previewUrl, setPreviewUrl] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleOpenFilePicker = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    form.setValue(imageField, '' as T[Path<T>], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setPreviewUrl('')
    setError('')

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const { publicId, secureUrl } = await uploadToCloudinary(file)

      form.setValue(imageField, publicId as T[Path<T>], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      })

      setPreviewUrl(secureUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const hasImage = Boolean(previewUrl || savedPublicId)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <aside className="order-1 lg:order-2">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#f0f2f4] bg-[#f8f9fc] p-6 dark:border-gray-800 dark:bg-[#151a25]">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="group relative cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <div className="overflow-hidden rounded-full">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="size-40 rounded-full object-cover"
                />
              ) : savedPublicId ? (
                <AdvancedImage
                  cldImg={cld
                    .image(savedPublicId)
                    .resize(thumbnail().width(160).height(160))
                    .roundCorners(byRadius(999))}
                  className="size-40 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="size-40 text-gray-300 dark:text-gray-600" />
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
              <div className="flex flex-col items-center gap-1 text-white">
                <CameraIcon className="size-5" />
                <span className="text-xs font-medium">Change</span>
              </div>
            </div>
          </button>

          <div className="text-center">
            <p className="text-sm font-medium text-[#111318] dark:text-white">
              {title}
            </p>
            <p className="text-xs text-[#616f89] dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </aside>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>Update profile picture</DialogTitle>
            <DialogDescription>
              Choose a new image and upload it as the avatar.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-5 py-2">
            <div className="overflow-hidden rounded-full border border-[#f0f2f4] dark:border-gray-800">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="size-36 rounded-full object-cover"
                />
              ) : savedPublicId ? (
                <AdvancedImage
                  cldImg={cld
                    .image(savedPublicId)
                    .resize(thumbnail().width(144).height(144))
                    .roundCorners(byRadius(999))}
                  className="size-36 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="size-36 text-gray-300 dark:text-gray-600" />
              )}
            </div>

            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={handleOpenFilePicker}
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="size-4" />
                    Choose image
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={loading || !hasImage}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-[#111318] transition-colors hover:border-red-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-white"
              >
                <Trash2Icon className="size-4" />
                Remove picture
              </button>

              <button
                type="button"
                onClick={() => setDialogOpen(false)}
                disabled={loading}
                className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-[#616f89] transition-colors hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Done
              </button>
            </div>

            {error ? (
              <p className="w-full text-sm text-red-500 wrap-break-word">{error}</p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
