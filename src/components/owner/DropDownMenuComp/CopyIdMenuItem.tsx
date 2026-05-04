import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

type Props = {
  role: 'student' | 'teacher'
  id: string
}

export default function CopyIdMenuItem({ role, id }: Props) {
  return (
    <DropdownMenuItem asChild>
      <div
        className="flex items-center gap-2 cursor-pointer text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 py-1.5 rounded-sm"
        onClick={() => {
          navigator.clipboard.writeText(id)
          toast.success(`${role} ID has been copied`)
        }}
      >
        <Copy size="18" />
        <p>Copy {role} ID</p>
      </div>
    </DropdownMenuItem>
  )
}
