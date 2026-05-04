import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import SettingsComp from '@/components/settings/owner/settingsComp'

export const Route = createFileRoute('/owner/settings')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Owner | Settings - EduManage' }],
  }),
})

function RouteComponent() {
  const { authState } = Route.useRouteContext()
  return (
    <Skeleton name="owner-settings-page" loading={false}>
      <SettingsComp admin={authState.user} />
    </Skeleton>
  )
}
