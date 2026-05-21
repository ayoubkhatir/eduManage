import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Fragment } from 'react/jsx-runtime'

type props = {
  value: number
  onChange: (value: number) => void
  options?: Array<number>
}

export function SelectPageSize({
  value = 10,
  onChange,
  options = [5, 10, 15, 20],
}: props) {
  return (
    <Select
      defaultValue={value ? `${value}` : '10'}
      onValueChange={(v) => onChange(Number(v))}
    >
      <SelectTrigger className="h-9 w-16 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 shadow-none transition-colors hover:bg-slate-50 focus:ring-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
        <SelectValue placeholder="Size" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-slate-800 dark:text-white border-slate-200 dark:border-slate-700">
        {options.map((sizeOption) => (
          <Fragment key={sizeOption}>
            <SelectItem
              value={`${sizeOption}`}
              className="focus:bg-slate-100 dark:focus:bg-slate-700"
            >
              {sizeOption}
            </SelectItem>
            {sizeOption !== options[options.length - 1] && (
              <SelectSeparator className="bg-slate-100 dark:bg-slate-700" />
            )}
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}
