import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { z } from 'zod'
import { authRoleSchema } from '#/schemas/shared.schema'
import { UserRoleEnum } from '#/server/db/schema'
import Login from '#/auth/login/components/login'
import Screen from '#/auth/login/components/screen'
import { getSession } from '#/lib/auth'

const logInSearchSchema = z.object({
  role: authRoleSchema
    .catch(UserRoleEnum.STUDENT)
    .default(UserRoleEnum.STUDENT),
  redirectTo: z.string().catch('/student').default('/student'),
})

export type logInSearch = z.infer<typeof logInSearchSchema>

const getRedirectToFromRole = (role: UserRoleEnum) =>
  role === UserRoleEnum.ADMIN ? '/admin/dashboard' : `/${role.toLowerCase()}/calendar`

export const Route = createFileRoute('/log-in')({
  beforeLoad: async () => {
      const authState = await getSession()
      if (authState && authState.user) {
        const role = authState.user.role
        throw redirect({ to: getRedirectToFromRole(role) })
      }
  },
  component: login,
  head: () => ({
    meta: [{ title: ' EduManage | Log-In' }],
  }),
  validateSearch: (search: Record<string, unknown>): logInSearch =>
    logInSearchSchema.parse(search),
})

import { motion } from 'framer-motion'

function login() {
  const { role, redirectTo } = Route.useSearch()
  return (
    <Skeleton name="login-page" loading={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-background text-foreground h-screen overflow-hidden overflow-x-hidden relative"
      >
        <Link
          to="/"
          className="absolute top-4 left-4 z-20 flex items-center gap-1.5 rounded-xl border border-border bg-background/80 px-3 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:bg-accent hover:text-foreground"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to home
        </Link>
        <div className="flex h-full w-full flex-row">
          <Login role={role} redirectTo={redirectTo} />
          <Screen />
        </div>
      </motion.div>
    </Skeleton>
  )
}
