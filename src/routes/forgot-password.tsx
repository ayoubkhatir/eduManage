import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { getSession } from '#/lib/auth'
import { motion } from 'framer-motion'
import ForgotPassword from '#/auth/forgot-password/components/forgotPassword'
import Screen from '#/auth/login/components/screen'

export const Route = createFileRoute('/forgot-password')({
  beforeLoad: async () => {
    const authState = await getSession()
    if (authState && authState.user) {
      throw redirect({ to: '/student' })
    }
  },
  component: ForgotPasswordRoute,
  head: () => ({
    meta: [{ title: 'Forgot Password - EduManage' }],
  }),
})

function ForgotPasswordRoute() {
  return (
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
          <ForgotPassword />
          <Screen />
        </div>
      </motion.div>

  )
}
