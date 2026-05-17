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
      <SelectTrigger className="w-45">
        <SelectValue placeholder="Select a size" />
      </SelectTrigger>
      <SelectContent className="bg-background-light dark:bg-background-dark dark:text-white">
        {options.map((sizeOption) => (
          <Fragment key={sizeOption}>
            <SelectItem
              value={`${sizeOption}`}
              className="bg-background-light dark:bg-background-dark"
            >
              {sizeOption}
            </SelectItem>
            {sizeOption !== options[options.length - 1] && (
              <SelectSeparator className=" dark:bg-white bg-black" />
            )}
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  )
}
