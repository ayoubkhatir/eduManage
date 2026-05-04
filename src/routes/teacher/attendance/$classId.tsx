import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teacher/attendance/$classId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/teacher/attendance/$classId"!</div>
}
