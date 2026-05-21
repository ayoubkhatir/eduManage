import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import SettingsComp from '@/components/settings/rest/settingsComp'
import { UserRoleEnum } from '#/server/db/schema'

export const Route = createFileRoute('/_auth/student/settings')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Student | Settings - EduManage' }],
  }),
})

function RouteComponent() {
  const { currentUser } = Route.useRouteContext()
  return (
    <Skeleton name="student-settings-page" loading={false}>
      <SettingsComp userRole={UserRoleEnum.STUDENT} user={currentUser} />
    </Skeleton>
  )
}
