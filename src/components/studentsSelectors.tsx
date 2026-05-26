import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { getAllGradesQueryOptions } from '#/hooks/grades/hooks'
import { getAllClassesQueryOptions } from '#/hooks/classes/hooks'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Controller, useFormContext, type Path } from 'react-hook-form'
import { toast } from 'sonner'

export function StudentClassSelector<
  T extends { classId: string; gradeId: string },
>({ schoolId }: { schoolId: string }) {
  const form = useFormContext<T>()

  const gradeId = form.watch('gradeId' as Path<T>)
  const { data: allClasses, status: fetchStatus } = useQuery({
    ...getAllClassesQueryOptions(schoolId),
  })
  const classOptions = useMemo(
    () =>
      (allClasses ?? [])
        .filter((c) => c.gradeId === gradeId)
        .map((c) => ({ label: c.name, value: c.id })),
    [allClasses, gradeId],
  )

  if (fetchStatus === 'pending')
    return (
      <div className="flex flex-col gap-1.5">
        <Label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
          Classes
        </Label>
        <Select disabled>
          <SelectTrigger
            disabled
            className={`w-full h-11! rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-black dark:text-white focus:ring-2 focus:ring-primary/50 transition-all `}
          >
            Loading...
          </SelectTrigger>
        </Select>
      </div>
    )
  if (fetchStatus === 'error') {
    toast.error(
      "we can't create new student because we dont have access to available classes",
    )
    return 'Error happened'
  }
  const error = form.formState.errors['classId']

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
        Class
      </Label>

      <Controller
        control={form.control}
        name={'classId' as Path<T>}
        render={({ field }) => (
          <Select
            value={(field.value as string | undefined) ?? ''}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={`w-full h-11! rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-black dark:text-white focus:ring-2 focus:ring-primary/50 transition-all ${
                error ? 'ring-2 ring-red-500' : 'ring-primary/50'
              }`}
            >
              <SelectValue
                placeholder="Select class"
                className="text-[#9ca3af]"
              />
            </SelectTrigger>

            <SelectContent
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-1"
              sideOffset={6}
            >
              {classOptions.map((item, i) => (
                <div
                  key={`class-${typeof item === 'string' ? item : item.value}`}
                >
                  <SelectItem
                    value={typeof item === 'string' ? item : item.value}
                    className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-black dark:text-white cursor-pointer transition-colors"
                  >
                    {typeof item === 'string' ? item : item.label}
                  </SelectItem>

                  {classOptions.length !== i + 1 && (
                    <SelectSeparator
                      key={`class-sep-${i}`}
                      className="bg-gray-200 dark:bg-gray-700 my-1"
                    />
                  )}
                </div>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && (
        <p className="text-sm text-red-500">{error.message?.toString()}</p>
      )}
    </div>
  )
}

export function StudentGradeSelector<T extends { gradeId: string }>({
  schoolId,
}: {
  schoolId: string
}) {
  const form = useFormContext<T>()
  const { data: grades, status: fetchStatus } = useQuery({
    ...getAllGradesQueryOptions(schoolId),
  })

  const gradesOptions = useMemo(
    () => (grades ?? []).map((c) => ({ label: c.name, value: c.id })),
    [grades],
  )

  if (fetchStatus === 'pending')
    return (
      <div className="flex flex-col gap-1.5">
        <Label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
          Classes
        </Label>
        <Select disabled>
          <SelectTrigger
            disabled
            className={`w-full h-11! rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-black dark:text-white focus:ring-2 focus:ring-primary/50 transition-all `}
          >
            Loading...
          </SelectTrigger>
        </Select>
      </div>
    )
  if (fetchStatus === 'error') {
    toast.error(
      "we can't create new student because we dont have access to available grades",
    )
    return 'Error happened'
  }
  const error = form.formState.errors['gradeId']
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[#111318] dark:text-gray-200 text-sm font-medium">
        Grade
      </Label>

      <Controller
        control={form.control}
        name={'gradeId' as Path<T>}
        render={({ field }) => (
          <Select
            value={(field.value as string | undefined) ?? ''}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className={`w-full h-11! rounded-lg bg-[#f0f2f4] dark:bg-gray-800 border-none px-4 text-black dark:text-white focus:ring-2 focus:ring-primary/50 transition-all ${
                error ? 'ring-2 ring-red-500' : 'ring-primary/50'
              }`}
            >
              <SelectValue
                placeholder="Select grade"
                className="text-[#9ca3af]"
              />
            </SelectTrigger>

            <SelectContent
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-1"
              sideOffset={6}
            >
              {gradesOptions.map((item, i) => (
                <div
                  key={`grade-${typeof item === 'string' ? item : item.value}`}
                >
                  <SelectItem
                    value={typeof item === 'string' ? item : item.value}
                    className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 text-black dark:text-white cursor-pointer transition-colors"
                  >
                    {typeof item === 'string' ? item : item.label}
                  </SelectItem>

                  {gradesOptions.length !== i + 1 && (
                    <SelectSeparator
                      key={`grade-sep-${i}`}
                      className="bg-gray-200 dark:bg-gray-700 my-1"
                    />
                  )}
                </div>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {error && (
        <p className="text-sm text-red-500">{error.message?.toString()}</p>
      )}
    </div>
  )
}
