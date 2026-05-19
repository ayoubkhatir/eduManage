import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import SettingsComp from '@/components/settings/admin/settingsComp'
import { useAuth } from '#/store/auth_store'

export const Route = createFileRoute('/admin/settings')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Admin | Settings - EduManage' }],
  }),
})

function RouteComponent() {
  const user = useAuth((s) => s.user)
  return (
    <Skeleton name="admin-settings-page" loading={false}>
      <SettingsComp admin={user} />
    </Skeleton>
  )
}
