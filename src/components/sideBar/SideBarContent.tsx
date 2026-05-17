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
  console.log('Rendering SideBarContent with user:', user)
  const handleNavClick = useCallback(
    (itemKey: string) => {
      handleClick(itemKey)
      if (!isDesktop) {
        setOpen(false)
      }
    },
    [handleClick, setOpen, isDesktop],
  )

  const handleProfileClick = useCallback(() => {
    if (!isDesktop) {
      setOpen(false)
    }
    setChoosen('settings')
  }, [setOpen, setChoosen, isDesktop])

  return (
    <>
      <div className="flex flex-col gap-8 overflow-hidden">
        {/* Brand */}
        <Logo />

        {/* Navigation */}
        <nav className="flex flex-col gap-2" aria-label="Primary">
          {/* Search Bar - visible only on desktop and tablet */}
          {/* <SearchBar /> */}

          {/* Navigation Items */}
          {list.length > 0 ? (
            list.map((item) => (
              <NavButton
                key={item.key}
                item={item}
                onClick={() => handleNavClick(item.key)}
              />
            ))
          ) : (
            <p className="text-xs text-slate-500 p-2">No items available</p>
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
