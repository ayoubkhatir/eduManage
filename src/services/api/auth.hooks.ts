import { loginSchema, type LoginSchema } from "#/schemas/auth.schema"
import { loginServerFn, logoutServerFn } from "#/server/modules/auth/auth.server-functions"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function useLogout() {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async () => {
            const response = await logoutServerFn()
            if (!response.success) {
                throw new Error('Failed to logout')
            }
            return response
        },
        onSuccess: () => {
            navigate({ to: '/auth/login' })
        },
    })
}


export function useLogin() {
    const navigate = useNavigate()

    const form = useForm<LoginSchema>({
        resolver: standardSchemaResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    console.log({ errors: form.formState.errors })
    const { mutate, isPending } = useMutation({
        mutationFn: async (data: LoginSchema) => {
            const response = await loginServerFn({ data })
            if (response.success) return response.data
            throw new Error('Login failed')
        },
        onSuccess: (data) => {
            toast.success('Logged in successfully')

            const role = data.user.role

            if (role === 'Admin') {
                navigate({ to: '/owner' })
                return
            }

            if (role === 'Teacher') {
                navigate({ to: '/teacher' })
                return
            }

            if (role === 'Student') {
                navigate({ to: '/student' })
                return
            }

            // navigate({ to: '/' })
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : 'Login failed')
        },
    })

    function onSubmit(data: LoginSchema) {
        mutate(data)
    }

    return { form, onSubmit, isPending }
}