import { LeftPanel } from '#/auth/signup/components/leftPanel'
import { RightPanel } from '#/auth/signup/components/signup'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'

export const Route = createFileRoute('/_auth/sign-up')({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: 'Sign Up - EduManage' }],
  }),
})

function RouteComponent() {
  return (
    <Skeleton name="signup-page" loading={false}>
      <div className="bg-white dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-white h-screen overflow-hidden overflow-x-hidden">
        <div className="flex h-full w-full flex-row">
          <LeftPanel />
          <RightPanel />
        </div>
      </div>
    </Skeleton>
  )
}
