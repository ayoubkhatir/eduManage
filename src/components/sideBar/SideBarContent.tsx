import { useCallback } from 'react'
import { NavButton } from './NavButton'
import { UserProfile } from './UserProfile'
import { Logo } from '../logo'
import { useAuth } from '#/services/store/auth_store'

export interface SidebarItem {
  name: string
  icon: string
  key: string
  active: boolean
}

export interface SideBarContentProps {
  list: Array<SidebarItem>
  handleClick: (key: string) => void
  localPath: string
  setChoosen: (key: string) => void
  setOpen: (open: boolean) => void
  isDesktop: boolean
}

export function SideBarContent({
  list,
  handleClick,
  localPath,
  setChoosen,
  setOpen,
  isDesktop,
}: SideBarContentProps) {
  const user = useAuth((s) => s.user)

  const handleNavClick = useCallback(
    (itemKey: string) => {
      handleClick(itemKey)
      if (!isDesktop) setOpen(false)
    },
    [handleClick, setOpen, isDesktop],
  )

  const handleProfileClick = useCallback(() => {
    if (!isDesktop) setOpen(false)
    setChoosen('settings')
  }, [setOpen, setChoosen, isDesktop])

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Brand */}
        <Logo />

        {/* Navigation */}
        <nav className="flex flex-col gap-0.5" aria-label="Primary">
          {list.length > 0 ? (
            list.map((item) => (
              <NavButton
                key={item.key}
                item={item}
                onClick={() => handleNavClick(item.key)}
              />
            ))
          ) : (
            <p className="px-3 py-2 text-xs text-slate-400">No items available</p>
          )}
        </nav>
      </div>

      {/* User Profile */}
      {user && (
        <UserProfile
          user={user}
          localPath={localPath}
          onProfileClick={handleProfileClick}
        />
      )}
    </>
  )
}
