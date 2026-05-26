import { useMemo, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import type { SubjectWithGrade } from '#/types/subjectsTypes'
import { StatusEnum } from '#/server/db/schema'

type StatusProps = {
  value: StatusEnum | undefined | null
  onChange: (value: StatusEnum | 'all') => void
  placeholder?: string
}

export function StatusFilter({
  value,
  onChange,
  placeholder = 'Status',
}: StatusProps) {
  const [open, setOpen] = useState(false)
  const options = [
    { label: 'All', value: 'all' },
    ...['Active', 'Inactive', 'New', 'Pending'].map((d) => ({
      label: d,
      value: StatusEnum[d.toUpperCase() as keyof typeof StatusEnum],
    })),
  ]
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <span className="material-symbols-outlined text-[18px] text-muted-foreground">
        school
      </span>
      <Select
        open={open}
        onOpenChange={setOpen}
        defaultValue={value ? value : 'all'}
        onValueChange={(v) => onChange(v as StatusEnum)}
      >
        <SelectTrigger className="w-28 border-0 bg-transparent p-0 text-sm font-medium text-muted-foreground shadow-none focus:ring-0 hover:text-foreground">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {options?.map((option) => (
            <SelectItem
              key={option.value ?? option.label}
              value={option.value}
              className="focus:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

type SubjectsProps = {
  data: SubjectWithGrade[]
  value: string | undefined | null
  onChange: (value: string | undefined | null) => void
  placeholder?: string
}

export function SubjectsFilter({
  data,
  value,
  onChange,
  placeholder = 'Subjects',
}: SubjectsProps) {
  const [open, setOpen] = useState(false)
  const options = useMemo(
    () => [
      { label: 'All', value: 'all' },
      ...data.map((d) => ({ label: d.name, value: d.name })),
    ],
    [data],
  )
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <span className="material-symbols-outlined text-[18px] text-muted-foreground">
        school
      </span>
      <Select
        open={open}
        onOpenChange={setOpen}
        defaultValue={value ? value : 'all'}
        onValueChange={(v) => onChange(v)}
      >
        <SelectTrigger className="w-28 border-0 bg-transparent p-0 text-sm font-medium text-muted-foreground shadow-none focus:ring-0 hover:text-foreground">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {options?.map((option) => (
            <SelectItem
              key={option.value ?? option.label}
              value={option.value}
              className="focus:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

type GradesProps = {
  data: {
    label: string
    value: string
  }[]
  value: string | undefined | null
  onChange: (value: string | undefined | null) => void
  placeholder?: string
}

export function GradeFilter({
  data,
  value,
  onChange,
  placeholder = 'Grades',
}: GradesProps) {
  const [open, setOpen] = useState(false)
  const options = useMemo(
    () => [
      { label: 'All', value: 'all' },
      ...data.map((d) => ({ label: d.label, value: d.value })),
    ],
    [data],
  )
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <span className="material-symbols-outlined text-[18px] text-muted-foreground">
        school
      </span>
      <Select
        open={open}
        onOpenChange={setOpen}
        defaultValue={value ? value : 'all'}
        onValueChange={(v) => onChange(v)}
      >
        <SelectTrigger className="w-28 border-0 bg-transparent p-0 text-sm font-medium text-muted-foreground shadow-none focus:ring-0 hover:text-foreground">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {options?.map((option) => (
            <SelectItem
              key={option.value ?? option.label}
              value={option.value}
              className="focus:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

type ClassesProps = {
  data: {
    label: string
    value: string
  }[]
  value: string | undefined | null
  onChange: (value: string | undefined | null) => void
  placeholder?: string
}

export function ClasseFilter({
  data,
  value,
  onChange,
  placeholder = 'Grades',
}: ClassesProps) {
  const [open, setOpen] = useState(false)
  const options = useMemo(
    () => [
      { label: 'All', value: 'all' },
      ...data.map((d) => ({ label: d.label, value: d.value })),
    ],
    [data],
  )
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <span className="material-symbols-outlined text-[18px] text-muted-foreground">
        school
      </span>
      <Select
        open={open}
        onOpenChange={setOpen}
        defaultValue={value ? value : 'all'}
        onValueChange={(v) => onChange(v)}
      >
        <SelectTrigger className="w-28 border-0 bg-transparent p-0 text-sm font-medium text-muted-foreground shadow-none focus:ring-0 hover:text-foreground">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          {options?.map((option) => (
            <SelectItem
              key={option.value ?? option.label}
              value={option.value}
              className="focus:bg-accent"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
