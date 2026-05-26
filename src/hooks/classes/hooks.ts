import { addClassServerFn, deleteClassByIdServerFn, getAllClassesServerFn } from "#/server/modules/classes/classes.server-functions";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { addClassSchema } from "#/schemas/classes.schema";
import type { AddClassSchema } from "#/types/classesTypes";
import { StatusEnum } from "#/server/db/schema";
import { useRouter } from "@tanstack/react-router";


export const getAllClassesQueryOptions = (schoolId: string) => ({
    queryKey: ['classes', schoolId],
    queryFn: async () => {
        try {
            const response = await getAllClassesServerFn({ data: schoolId })
            if (!response.success) {
                throw new Error('Announcement not found')
            }
            return response.data
        }
        catch (error) {
            throw new Error("Error when fetching classes")
        }
    }
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

export function useDeleteClass() {
    const queryClient = useQueryClient()
    const router = useRouter()
    return useMutation({
        mutationFn: (classId: string) => deleteClassByIdServerFn({ data: classId }),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['classes'] }),
                queryClient.invalidateQueries({ queryKey: ['grades'] }),
                await router.invalidate()
            ])
        },
        onError: (error) => {
            toast.error(
                error instanceof Error ? error.message : 'Failed to add class',
            )
        },

    })
}