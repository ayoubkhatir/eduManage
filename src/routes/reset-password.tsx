import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { z } from 'zod'
import { getSession } from '#/lib/auth'
import { motion } from 'framer-motion'
import ResetPassword from '#/auth/reset-password/components/resetPassword'
import Screen from '#/auth/login/components/screen'

const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
})

export type ResetPasswordSearch = z.infer<typeof resetPasswordSearchSchema>

export const Route = createFileRoute('/reset-password')({
  beforeLoad: async () => {
    const authState = await getSession()
    if (authState && authState.user) {
      throw redirect({ to: '/student' })
    }
  },
  component: ResetPasswordRoute,
  head: () => ({
    meta: [{ title: 'Reset Password - EduManage' }],
  }),
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch =>
    resetPasswordSearchSchema.parse(search),
})

function ResetPasswordRoute() {
  return (
    <Skeleton name="reset-password-page" loading={false}>
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
          <ResetPassword />
          <Screen />
        </div>
      </motion.div>
    </Skeleton>
  )
}
    
