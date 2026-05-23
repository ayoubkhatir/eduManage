import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import SettingsComp from '@/components/settings/admin/settingsComp'
import type { AdminUser } from '#/types/usersTypes'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
// import { useAuth } from '#/store/auth_store'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/_auth/admin/settings')({
  component: RouteComponent,
  loader: async ({ context }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as AdminUser
    return { currentUser }
  },
  head: () => ({
    meta: [{ title: 'Admin | Settings - EduManage' }],
  }),
})

function RouteComponent() {
  const { currentUser } = Route.useLoaderData()
  // const user = useAuth((s) => s.user)
  return (
    <Skeleton name="admin-settings-page" loading={false}>
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <SettingsComp admin={currentUser} />
      </motion.div>
    </Skeleton>
  )
}
