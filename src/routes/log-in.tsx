import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { z } from 'zod'
import Screen from '../auth/login/components/screen'
import Login from '../auth/login/components/login'
import { authRoleSchema } from '#/schemas/shared.schema'
import { UserRoleEnum } from '#/server/db/schema'

const logInSearchSchema = z.object({
  role: authRoleSchema
    .catch(UserRoleEnum.STUDENT)
    .default(UserRoleEnum.STUDENT),
  redirectTo: z.string().catch('/student').default('/student'),
})

export type logInSearch = z.infer<typeof logInSearchSchema>

export const Route = createFileRoute('/log-in')({
  component: login,
  head: () => ({
    meta: [{ title: ' EduManage | Log-In' }],
  }),
  validateSearch: (search: Record<string, unknown>): logInSearch =>
    logInSearchSchema.parse(search),
})

function login() {
  const { role, redirectTo } = Route.useSearch()
  return (
    <Skeleton name="login-page" loading={false}>
      <div className="bg-white dark:bg-background-dark text-[#111318] dark:text-white font-display h-screen overflow-hidden overflow-x-hidden">
        <div className="flex h-full w-full flex-row">
          <Login role={role} redirectTo={redirectTo} />
          <Screen />
        </div>
      </div>
    </Skeleton>
  )
}