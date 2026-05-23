import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import SettingsComp from '@/components/settings/rest/settingsComp'
import { UserRoleEnum } from '#/server/db/schema'
import { motion } from 'framer-motion'

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
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <SettingsComp userRole={UserRoleEnum.STUDENT} user={currentUser} />
      </motion.div>
    </Skeleton>
  )
}
