import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import {
    addSubjectSchema,
} from '#/schemas/subjects.schema'
import type { AddSubjectSchema } from '#/types/subjectsTypes'
import { addSubjectServerFn, getAllSchoolSubjectsServerFn, getStudentSubjectsServerFn, getTeacherSubjectsServerFn } from '#/server/modules/subjects/subjects.server-functions'
import { StatusEnum } from '#/server/db/schema'

export function useAddSubject(
    schoolId: string,
    onSuccess?: (subjectId: string) => void,
    defaults?: Partial<AddSubjectSchema>,
) {
    const form = useForm<AddSubjectSchema>({
        defaultValues: {
            schoolId,
            name: '',
            code: '',
            status: StatusEnum.ACTIVE,
            gradeIds: [],
            ...defaults,
        },
        resolver: standardSchemaResolver(addSubjectSchema),
    })

    const queryClient = useQueryClient()
    const errors = useMemo(() => form.formState.errors, [form.formState])

    const { mutate: addSubject, isPending } = useMutation({
        mutationFn: async (data: AddSubjectSchema) => {
            const response = await addSubjectServerFn({ data })

            if (response.success) return response.data
            throw new Error('Error occured')
        },

        onSuccess: async (subject) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['subjects'] }),
                queryClient.invalidateQueries({ queryKey: ['grades'] }),
                queryClient.invalidateQueries({ queryKey: ['grade-subjects'] }),
            ])

            toast.success('Subject added successfully')

            form.reset({
                schoolId,
                name: '',
                code: '',
                gradeIds: defaults?.gradeIds ?? [],
                status: StatusEnum.ACTIVE
            })

            onSuccess?.(subject.id)
        },

        onError: (error) => {
            toast.error(
                error instanceof Error ? error.message : 'Failed to add subject',
            )
        },
    })

    function onSubmit(data: AddSubjectSchema) {
        addSubject(data)
    }

    return {
        form,
        onSubmit,
        isPending,
        errors,
    }
}

export const getAllSubjectsQueryOptions = (schoolId: string) => {
    return {
        queryKey: ['subjects'],
        queryFn: async () => {
            const response = await getAllSchoolSubjectsServerFn({ data: schoolId })
            if (response.success) {
                return response.data
            }
            else throw new Error()
        },
    }
}

export const getStudentSubjectsQueryOptions = (studentUserId: string) => ({
    queryKey: ["students", `userId-{studentUserId}`, "subjects"],
    queryFn: async () => {
        const response = await getStudentSubjectsServerFn({ data: studentUserId })
        if (response.success) return response.data;
        throw new Error("Error occured")
    }
})

export const getTeacherSubjectsQueryOptions = (teacherUserId: string) => ({
    queryKey: ["teachers", `userId-{teacherUserId}`, "subjects"],
    queryFn: async () => {
        const response = await getTeacherSubjectsServerFn({ data: teacherUserId })
        if (response.success) return response.data;
        throw new Error("Error occured")
    }
})