import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: any) => void,
      ) => {
        open: () => void
      }
    }
  }
}

type UploadResult = {
  publicId: string
  secureUrl: string
}

type CloudinaryUploaderProps = {
  onSuccess: (result: UploadResult) => void
  children: (props: { open: () => void; ready: boolean }) => React.ReactNode
}

export function CloudinaryUploader({
  onSuccess,
  children,
}: CloudinaryUploaderProps) {
  const widgetRef = useRef<{ open: () => void } | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initWidget = () => {
      if (!window.cloudinary || widgetRef.current) return false

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          folder: 'avatars',
          sources: ['local', 'camera', 'url'],
          multiple: false,
          maxFiles: 1,
          resourceType: 'image',
          clientAllowedFormats: ['png', 'jpg', 'jpeg', 'webp'],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            return
          }

          if (result?.event === 'success') {
            onSuccess({
              publicId: result.info.public_id,
              secureUrl: result.info.secure_url,
            })
          }
        },
      )

      setReady(true)
      return true
    }

    if (initWidget()) return

    const interval = window.setInterval(() => {
      if (initWidget()) {
        window.clearInterval(interval)
      }
    }, 100)

    return () => window.clearInterval(interval)
  }, [onSuccess])

  const open = () => {
    widgetRef.current?.open()
  }

  return <>{children({ open, ready })}</>
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: any) => void,
      ) => { open: () => void }
    }
  }
}

export function SimpleCloudinaryUpload({
  onSuccess,
}: {
  onSuccess: (publicId: string, secureUrl: string) => void
}) {
  const widgetRef = useRef<{ open: () => void } | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const tryInit = () => {
      if (!window.cloudinary || widgetRef.current) return false

      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary widget error:', error)
            return
          }

          if (result?.event === 'success') {
            onSuccess(result.info.public_id, result.info.secure_url)
          }
        },
      )

      setReady(true)
      return true
    }

    if (tryInit()) return

    const interval = window.setInterval(() => {
      if (tryInit()) window.clearInterval(interval)
    }, 100)

    return () => window.clearInterval(interval)
  }, [onSuccess])

  return (
    <button
      type="button"
      disabled={!ready}
      onClick={() => widgetRef.current?.open()}
      className="cursor-pointer"
    >
      {ready ? 'Upload' : 'Loading...'}
    </button>
  )
}

// the function i need until now 

export async function uploadToCloudinary(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append(
    'upload_preset',
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  )
  formData.append('folder', 'avatars')

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Cloudinary upload failed: ${errorText}`)
  }

  const data = await response.json()

  return {
    publicId: data.public_id as string,
    secureUrl: data.secure_url as string,
  }
}

//

type Props = {
  value?: string
  onChange: (publicId: string) => void
}

export function SimpleImageUpload({ value, onChange }: Props) {
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const displayUrl =
    previewUrl ||
    (value
      ? `https://res.cloudinary.com/${cloudName}/image/upload/c_thumb,w_200,g_face/${value}`
      : '')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
        'upload_preset',
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      )
      formData.append('folder', 'avatars')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text)
      }

      const data = await response.json()
      onChange(data.public_id)
      setPreviewUrl(data.secure_url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    onChange('')
    setPreviewUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div
          className="size-28 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Profile preview"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">
                person
              </span>
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer">
          <span className="material-symbols-outlined text-white text-2xl">
            {displayUrl ? 'photo_camera' : 'add_a_photo'}
          </span>
        </div>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          {displayUrl ? 'Change' : 'Upload photo'}
        </button>
        {displayUrl && (
          <>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10"
            >
              Remove
            </button>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

type DocumentUploaderProps = Omit<Props, 'onChange'> & {
  onChange: (args: {
    url: string
    format: string
    original_filename: string
    bytes: number
  }) => void
  label: string
}

export function SimpleDocumentUpload({
  value,
  onChange,
  label,
}: DocumentUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append(
        'upload_preset',
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      )
      formData.append('folder', 'documents')

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text)
      }

      const data = await response.json()
      const { bytes, resource_type, original_filename, url } = data

      onChange({
        bytes,
        format:
          resource_type === 'raw'
            ? new URL(url).pathname.split('.').pop()
            : data.format,
        original_filename,
        url,
      })
      setPreviewUrl(data.secure_url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <label>{label}</label>
      <input type="file" className="border w-fit" onChange={handleFileChange} />

      {loading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          className="h-24 w-24 rounded-full object-cover"
        />
      ) : value ? (
        <p>Saved public_id: {value}</p>
      ) : null}
    </div>
  )
}
