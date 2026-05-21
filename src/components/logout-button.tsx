import { useLogout } from '#/hooks/auth/hooks'

export function LogoutButton() {
  const { mutate: logout, isPending } = useLogout()

  return (
    <button
      onClick={() => logout()}
      disabled={isPending}
      className="cursor-pointer"
    >
      Logout
    </button>
  )
}
