import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getSession } from '#/lib/auth'
import { UserRoleEnum } from '#/server/db/schema'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ location }) => {
    // const session = await fetchAuthStateInBeforeLoad(location.pathname)
    const session = await getSession()

    const role = location.pathname.startsWith('/admin')
      ? UserRoleEnum.ADMIN
      : location.pathname.startsWith('/student')
        ? UserRoleEnum.STUDENT
        : UserRoleEnum.TEACHER

    if (!session) {
      throw redirect({
        to: '/log-in',
        search: { redirectTo: location.href, role },
      })
    }

    return { authState: session }
  },
  component: () => <Outlet />,
  // pendingComponent: () => <p>LOADING ...</p>,
})
