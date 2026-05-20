// import { CloudinaryUploadTrigger } from '#/components/cloudinary-uploader'
// import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

// type props<T extends FieldValues> = {
//   form: UseFormReturn<T>
// }
// export default function ProfilePicWrapper<T extends FieldValues>({
//   form,
// }: props<T>) {
//   return (
//     <div className="p-20 border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-20 items-center sm:items-start">
//       <div className="relative group cursor-pointer">
//         <div className="size-32 rounded-full bg-[#f0f2f4] dark:bg-gray-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-700 shadow-sm transition-all group-hover:border-primary/20">
//           <span className="material-symbols-outlined text-4xl text-[#9ca3af]">
//             person_add
//           </span>
//           <img
//             alt="User profile preview"
//             className="hidden w-full h-full object-cover"
//             id="avatar-preview"
//             src={undefined}
//           />
//         </div>
//         <div className="absolute flex justify-center bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md border-2 border-white dark:bg-surface-dark">
//           <span className="material-symbols-outlined text-[18px]">edit</span>
//         </div>
//       </div>
//       <div className="flex flex-col gap-2 text-center sm:text-left">
//         <h3
//           className="text-neutral-900 dark:text-white text-lg font-bold"
//           {...form.register('imgSrc' as Path<T>)}
//         >
//           Profile Photo
//         </h3>
//         <p className="text-slate-500 dark:text-gray-400 text-sm max-w-md">
//           Upload a clear photo of the teacher. Accepted formats: JPG, PNG. Max
//           size: 5MB.
//         </p>
//         <div className="flex gap-3 mt-2 justify-center sm:justify-start">
//           <CloudinaryUploadTrigger
//             cloudName={import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}
//             uploadPreset={import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}
//             folder="avatars"
//             onUploaded={({ publicId, secureUrl }) => {
//               console.log(publicId, secureUrl)
//             }}
//           >
//             {({ open, ready }) => (
//               <button
//                 type="button"
//                 onClick={open}
//                 disabled={!ready}
//                 className="cursor-pointer rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
//               >
//                 {ready ? 'Upload avatar' : 'Loading uploader...'}
//               </button>
//             )}
//           </CloudinaryUploadTrigger>

//           <button
//             type="button"
//             className="cursor-pointer px-4 py-2 bg-[#f0f2f4] dark:bg-gray-800 hover:bg-[#e2e8f0] dark:hover:bg-gray-700 text-[#111318] dark:text-white hover:text-red-400 border border-slate-300 hover:border-red-400 text-sm font-medium rounded-lg transition-colors cursor-pointer"
//           >
//             Remove
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { SimpleImageUpload } from '#/components/cloudinary-uploader'

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>
  imageField: Path<T>
}

export default function ProfilePicInput<T extends FieldValues>({
  form,
  imageField,
}: Props<T>) {
  const savedPublicId = form.watch(imageField) as string
  const [previewUrl, setPreviewUrl] = useState('')

  const handleRemove = () => {
    form.setValue(imageField, '' as T[Path<T>], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setPreviewUrl('')
  }

  return (
    <div className="flex flex-col gap-4">
      <SimpleImageUpload
        value={savedPublicId}
        onChange={(publicId) => {
          form.setValue(imageField, publicId as T[Path<T>], {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          })
        }}
      />
    </div>
  )
}
