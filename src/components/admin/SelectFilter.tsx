import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

type props = {
  value: string
  onChange: (value: string) => void
  options?:
    | Array<Record<string, string> | string>
    | { label: string; value: string }[]
  placeholder?: string
}

export default function SelectFilter({
  value,
  onChange,
  placeholder = 'Select a size',
  options,
}: props) {
  return (
    <Select
      defaultValue={`${value}`}
      onValueChange={(v) => onChange(String(v))}
    >
      <SelectTrigger className="w-45">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-background-light dark:bg-background-dark dark:text-white">
        {options?.map((filterOption) => (
          <SelectItem
            key={
              typeof filterOption === 'string'
                ? filterOption
                : filterOption.label
                  ? filterOption.label
                  : Object.keys(filterOption)[0]
            }
            value={`${typeof filterOption === 'string' ? filterOption : filterOption.value ? filterOption.value : Object.keys(filterOption)[0]}`}
            className="bg-background-light dark:bg-background-dark"
          >
            {filterOption && typeof filterOption === 'object'
              ? filterOption.label
                ? filterOption.label
                : Object.values(filterOption)[0]
              : filterOption}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
