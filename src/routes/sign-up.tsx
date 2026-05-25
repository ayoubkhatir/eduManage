import { LeftPanel } from '#/auth/signup/components/leftPanel'
import { RightPanel } from '#/auth/signup/components/signup'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Sign Up - EduManage' }],
  }),
})

import { motion } from 'framer-motion'

function RouteComponent() {
  return (
    <Skeleton name="signup-page" loading={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-background text-foreground antialiased h-screen overflow-hidden overflow-x-hidden relative"
      >
        <div className="flex h-full w-full flex-row">
          <LeftPanel />
          <RightPanel />
        </div>
      </motion.div>
    </Skeleton>
  )
}
