// import { useEffect, useRef } from 'react'
// import Quill from 'quill'
// import 'quill/dist/quill.snow.css'
// import '../../styles/quillEditor.css'

// export default function QuillEditor({
//   value,
//   onChange,
// }: {
//   value?: string
//   onChange?: (value: string) => void
// }) {
//   const hostRef = useRef<HTMLDivElement | null>(null)
//   const quillRef = useRef<Quill | null>(null)

//   useEffect(() => {
//     if (!hostRef.current || quillRef.current) return

//     const quill = new Quill(hostRef.current, {
//       theme: 'snow',
//       placeholder: 'Write your content here...',
//       modules: {
//         toolbar: [
//           [{ header: [1, 2, 3, false] }],
//           ['bold', 'italic', 'underline', 'strike'],
//           [{ list: 'ordered' }, { list: 'bullet' }],
//           [{ align: [] }],
//           ['link', 'blockquote', 'code-block'],
//           ['clean'],
//         ],
//       },
//     })

//     const initialValue = value?.trim() ? value : ''
//     if (initialValue) {
//       quill.clipboard.dangerouslyPasteHTML(initialValue)
//     }

//     quill.on('text-change', () => {
//       const html = quill.root.innerHTML
//       const nextValue = html === '<p><br></p>' ? '' : html
//       onChange?.(nextValue)
//     })

//     quillRef.current = quill
//   }, [onChange, value])

//   useEffect(() => {
//     const quill = quillRef.current
//     if (!quill) return

//     const normalizedValue = value?.trim() ? value : ''
//     const currentValue =
//       quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML

//     if (normalizedValue === currentValue) return

//     if (!normalizedValue) {
//       quill.setText('')
//       return
//     }

//     quill.clipboard.dangerouslyPasteHTML(normalizedValue)
//   }, [value])

//   return (
//     <div className="notification-quill w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
//       <div
//         ref={hostRef}
//         className="min-h-48 text-sm text-slate-900 dark:text-white"
//       />
//     </div>
//   )
// }

import { useEffect, useRef } from 'react'
import 'quill/dist/quill.snow.css'
import '../../styles/quillEditor.css'

type QuillType = typeof import('quill')

export default function QuillEditor({
  value,
  onChange,
}: {
  value?: string
  onChange?: (value: string) => void
}) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    async function setupEditor() {
      if (
        !hostRef.current ||
        quillRef.current ||
        typeof window === 'undefined'
      ) {
        return
      }

      const QuillModule: QuillType = await import('quill')
      const Quill = QuillModule.default

      if (!mounted || !hostRef.current) return

      const quill = new Quill(hostRef.current, {
        theme: 'snow',
        placeholder: 'Write your content here...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'blockquote', 'code-block'],
            ['clean'],
          ],
        },
      })

      const initialValue = value?.trim() ? value : ''
      if (initialValue) {
        quill.clipboard.dangerouslyPasteHTML(initialValue)
      }

      quill.on('text-change', () => {
        const html = quill.root.innerHTML
        const nextValue = html === '<p><br></p>' ? '' : html
        onChange?.(nextValue)
      })

      quillRef.current = quill
    }

    setupEditor()

    return () => {
      mounted = false
    }
  }, [onChange])

  useEffect(() => {
    const quill = quillRef.current
    if (!quill) return

    const normalizedValue = value?.trim() ? value : ''
    const currentValue =
      quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML

    if (normalizedValue === currentValue) return

    if (!normalizedValue) {
      quill.setText('')
      return
    }

    quill.clipboard.dangerouslyPasteHTML(normalizedValue)
  }, [value])

  return (
    <div className="notification-quill w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div
        ref={hostRef}
        className="min-h-48 text-sm text-slate-900 dark:text-white"
      />
    </div>
  )
}
