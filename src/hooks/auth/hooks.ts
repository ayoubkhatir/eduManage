import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from '@hookform/resolvers/zod'
import { loginFieldsSchema, signupFieldsSchema, type LoginFields, type SignupFields } from '../../schemas/auth.schema'
import type { UserRole, AuthResult, LoginRequest, RegisterRequest } from '../../types/authTypes'
// import { useAuth } from "#/store/auth_store"
import { loginServerFn, registerServerFn, logoutServerFn } from "#/server/modules/auth/auth.server-function"

import type { SubmitHandler } from 'react-hook-form'
import { auth } from "#/server/utils/auth.server"




export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const response = await logoutServerFn()
      if (!response.success) {
        throw new Error('Failed to logout')
      }
      return ""//response.message
    },
    onSuccess: () => {
      navigate({ to: '/', replace: true })
    },
  })
}


export function useLogin(redirectTo: string, role: UserRole) {
  const navigate = useNavigate()
  /*error message */
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /* validation */
  const form = useForm<LoginFields>({
    resolver: zodResolver(loginFieldsSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })
  // const setToken = useAuth((s) => s.setToken)
  // const setUser = useAuth((s) => s.setUser)

  const loginMutation = useMutation<AuthResult, never, LoginRequest>({
    mutationFn: (data: LoginRequest) => loginServerFn({ data }),
    onSuccess: (result) => {
      if (!result.success || !result.data) {
        return
      }

      // const payload = result.data

      // setToken(payload.token || null)
      // setUser(payload.user || null)
    },
  })

  /* Submit function */
  const onSubmit: SubmitHandler<LoginFields> = async (data) => {

    setErrorMessage(null)

    const callbackURL =
      redirectTo.startsWith('http://') || redirectTo.startsWith('https://')
        ? redirectTo
        : new URL(redirectTo, window.location.origin).toString()

    const result = await loginMutation.mutateAsync({
      email: data.email,
      password: data.password,
      rememberMe: true,
      role,
      callbackURL,
    })

    if (!result.success) {
      setErrorMessage(
        result.message ?? 'Login failed. Please check your credentials.',
      )
      return
    }

    navigate({
      to:
        redirectTo.startsWith('http://') || redirectTo.startsWith('https://')
          ? (() => {
            const url = new URL(redirectTo)
            return `${url.pathname}${url.search}${url.hash}` || '/'
          })()
          : redirectTo,
      replace: true,
    })
  }

  return { form, errorMessage, onSubmit }
}

export function useSignup() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  const form = useForm<SignupFields>({
    resolver: zodResolver(signupFieldsSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',

  })
  // const setToken = useAuth((s) => s.setToken)
  // const setUser = useAuth((s) => s.setUser)

  const signupMutation = useMutation<AuthResult, never, RegisterRequest>({
    mutationFn: (data: RegisterRequest) => registerServerFn({ data }),
    onSuccess: (result) => {
      if (!result.success || !result.data) {
        return
      }

      // const payload = result.data

      // setToken(payload.token || null)
      // setUser(payload.user || null)
    },
  })

  const onSubmit: SubmitHandler<SignupFields> = async (data) => {

    setErrorMessage(null)

    const redirectPath = '/admin/dashboard'
    const callbackURL = new URL(redirectPath, window.location.origin).toString()

    const result = await signupMutation.mutateAsync({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      schoolName: data.schoolName,
      gender: data.gender,
      confirmPassword: data.confirmPassword,
      rememberMe: true,
      callbackURL,
    })

    if (!result.success) {
      setErrorMessage(
        result.message ?? 'Signup failed. Please check your credentials.',
      )
      return
    }

    navigate({ to: redirectPath, replace: true })
  }
  return { form, onSubmit, errorMessage }
}