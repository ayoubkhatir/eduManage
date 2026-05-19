import { addClassServerFn, getAllClassesServerFn } from "#/server/modules/classes/classes.server-functions";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { addClassSchema} from "#/schemas/classes.schema";
import type { AddClassSchema } from "#/types/classesTypes";
import { StatusEnum } from "#/server/db/schema";

export const getAllClassesQueryOptions = () => ({
    queryKey: ['classes'],
    queryFn: () => getAllClassesServerFn(),
})


export function useAddClass(
    schoolId: string,
    onSuccess?: (classId: string) => void,
    defaults?: Partial<AddClassSchema>,
) {
    const form = useForm<AddClassSchema>({
        defaultValues: {
            schoolId,
            name: '',
            gradeId: '',
            status: StatusEnum.NEW,
            ...defaults,
        },
        resolver: standardSchemaResolver(addClassSchema),
    })

    const queryClient = useQueryClient()
    const errors = useMemo(() => form.formState.errors, [form.formState])

    const { mutate: addClass, isPending } = useMutation({
        mutationFn: async (data: AddClassSchema) => {
            const response = await addClassServerFn({ data })

            if (response.success) return response.data
            throw new Error('Error occured')
        },

        onSuccess: async (classe) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['classes'] }),
                queryClient.invalidateQueries({ queryKey: ['grades'] }),
                queryClient.invalidateQueries({ queryKey: ['grade-classes'] }),
            ])

            toast.success('Class added successfully')

            form.reset({
                schoolId,
                name: '',
                gradeId: defaults?.gradeId ?? '',
                status: StatusEnum.NEW,
            })

            onSuccess?.(classe.id)
        },

        onError: (error) => {
            toast.error(
                error instanceof Error ? error.message : 'Failed to add class',
            )
        },
    })

    function onSubmit(data: AddClassSchema) {
        addClass(data)
    }

    return {
        form,
        onSubmit,
        isPending,
        errors,
    }
}