import { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { FaMeta } from 'react-icons/fa6'

import { Link } from '@tanstack/react-router'
import { UserRoleEnum } from '#/server/db/schema'

import Loginform from '../loginform'

import type { logInSearch } from '../../../routes/log-in'
import { loginOAuthServer } from '#/server/modules/auth/auth.server-function'

export default function Login({ role, redirectTo }: logInSearch) {
  const roles = [UserRoleEnum.ADMIN, UserRoleEnum.TEACHER, UserRoleEnum.STUDENT] as const
  const otherRoles = roles.filter((r) => r !== role)
  const [errorMessageOAuth, setErrorMessageOAuth] = useState<string | null>(null)
  
  
  // * Rebuild the full logic : 
  
  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    try {
      setErrorMessageOAuth(null)
      const response = await loginOAuthServer({ data: { provider } })

      if (!response.success) {
        setErrorMessageOAuth(response?.message!)
        return
      }

      const redirectUrl = response?.data?.url
      if (!redirectUrl) {
        setErrorMessageOAuth("No redirect URL received. Please try again.")
        return
      }

      
      window.location.assign(redirectUrl)
    } catch (error) {
      setErrorMessageOAuth("Failed to initiate social login. Please try again.")
    }
  }

  const heading =
    role === UserRoleEnum.ADMIN ? (
      <>
        Manage your <br /> Teachers & Students
      </>
    ) : role === UserRoleEnum.TEACHER ? (
      <>
        Teach your <br /> Students
      </>
    ) : (
      <>
        Learn with <br /> Your Classes
      </>
    )

  return (
    <div className="flex w-full self-stretch flex-col justify-center overflow-y-auto overflow-x-hidden px-4 py-6 sm:px-6 lg:w-[45%] lg:px-16 xl:px-20 bg-white dark:bg-background-dark z-10 shadow-xl lg:shadow-none">
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div className="mb-8">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary ring-1 ring-inset ring-primary/20">
            {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </span>
        </div>
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-[#111318] dark:text-white sm:text-3xl leading-tight">
            {heading}
          </h1>
          <p className="mt-2 text-sm text-[#616f89] dark:text-gray-400">
            Welcome back. Please enter your details.
          </p>
        </div>
        <div className="mb-5 border-b border-[#dbdfe6] dark:border-gray-700"></div>
        <Loginform redirectTo={redirectTo} role={role} />
        {role === UserRoleEnum.ADMIN &&
        <div className="mt-5">
          
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <div className="w-full border-t border-[#dbdfe6] dark:border-gray-700"></div>
            </div>

            {/* connection with third auth*/}
            
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white dark:bg-background-dark px-4 text-[#616f89] dark:text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-[#1a2234] px-3 py-3 text-sm font-semibold text-[#111318] dark:text-white shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-700 hover:bg-background-light dark:hover:bg-gray-800"
              onClick={() => handleOAuthLogin("google")}
            >
              <FaGoogle className="h-5 w-5" />
              <span>Google</span>
            </button>
            <button
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-white dark:bg-[#1a2234] px-3 py-3 text-sm font-semibold text-[#111318] dark:text-white shadow-sm ring-1 ring-inset ring-[#dbdfe6] dark:ring-gray-700 hover:bg-background-light dark:hover:bg-gray-800"
              onClick={() => handleOAuthLogin("facebook")}
            >
              <FaMeta className="h-5 w-5" />
              <span>Meta</span>
            </button>
          </div>
          {errorMessageOAuth &&
            <div className="mt-4 text-center text-sm text-red-600">
              {errorMessageOAuth}
            </div>
          }
        </div>
          }
        <div className="mt-6 text-center">
          {role === UserRoleEnum.ADMIN && (
            <p className="mb-6 text-sm text-[#637588] dark:text-[#9da6b9]">
              Don’t have an account?{' '}
              <Link
                to="/sign-up"
                replace={true}
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
          )}
          
          <div className="mb-2 text-center">
            <p className="text-[#637588] dark:text-[#9da6b9] text-sm mb-4">
              Not a Teacher? Login as:
            </p>
            <div className="flex justify-center gap-3">
              {otherRoles.map((r) => (
                <Link
                  to="/log-in"
                  replace={true}
                  key={r}
                  className="px-4 py-2 rounded-lg bg-[#f0f2f5] dark:bg-[#282e39] text-[#111418] dark:text-white text-sm font-medium hover:bg-primary/10 hover:text-primary"
                  search={{ role: r, redirectTo: `/${r.toLowerCase()}/calendar` }}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4 text-xs text-[#616f89] dark:text-gray-500">
            <a className="hover:underline hover:text-primary" href="#">
              Privacy Policy
            </a>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <a className="hover:underline hover:text-primary" href="#">
              Terms of Service
            </a>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <a className="hover:underline hover:text-primary" href="#">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
