import { auth } from '#/server/utils/auth.server'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return await auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        return await auth.handler(request)
      },
    },
  },
})