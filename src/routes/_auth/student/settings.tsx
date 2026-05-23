import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import SettingsComp from '@/components/settings/rest/settingsComp'
import { UserRoleEnum } from '#/server/db/schema'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { StudentUser } from '#/types/studentTypes'

export const Route = createFileRoute('/_auth/student/settings')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as StudentUser
    return { currentUser }
  },
  head: () => ({
    meta: [{ title: 'Student | Settings - EduManage' }],
  }),
})

function RouteComponent() {
  const { currentUser } = Route.useLoaderData()
  return (
    <Skeleton name="student-settings-page" loading={false}>
      <SettingsComp userRole={UserRoleEnum.STUDENT} user={currentUser} />
    </Skeleton>
  )
}
