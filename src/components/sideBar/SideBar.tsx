import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import useSideBarStore from '../../store/sidebar_show_store'
import { SideBarContent, type SidebarItem } from './SideBarContent'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import type { AuthUser } from '#/types/authTypes'

function getCurrentSidebarKey(pathname: string) {
  return pathname.split('/')[2] || 'dashboard'
}

export interface SideBarProps {
  currentUser: AuthUser
  info?: {
    list?: Array<{ name: string; icon: string }>
    layout?: string
  }
}

export function SideBar({ info, currentUser }: SideBarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const localPath = location.pathname.split('/')[1]
  const activeItem = getCurrentSidebarKey(location.pathname)

  const list = useMemo((): Array<SidebarItem> => {
    if (!info?.list) return []
    return info.list.map((item) => {
      const key = item.name.toLowerCase()
      return { ...item, key, active: activeItem === key }
    })
  }, [info?.list, activeItem])

  const handleClick = useCallback(
    (itemKey: string) => {
      navigate({ to: `/${info?.layout}/${itemKey}` })
    },
    [info?.layout, navigate],
  )

  const isOpen = useSideBarStore((s) => s.isOpen)
  const setOpen = useSideBarStore((s) => s.setOpen)

  return (
    <>
      {/* Mobile: Drawer */}
      <div className="lg:hidden">
        <Drawer open={isOpen} onOpenChange={setOpen} direction="left">
          <DrawerTrigger asChild>
            <button
              className="fixed top-3 left-3 z-40 flex size-9 cursor-pointer items-center justify-center rounded-lg bg-white/80 text-slate-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white dark:bg-[#101622]/80 dark:text-slate-400 dark:hover:bg-[#101622]"
              aria-label="Toggle navigation menu"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">
                menu
              </span>
            </button>
          </DrawerTrigger>

          <DrawerContent className="w-72 border-r border-slate-200/60 bg-white dark:border-white/6 dark:bg-[#0d1117]">
            <div className="flex h-screen flex-col justify-between p-4">
              <SideBarContent
                currentUser={currentUser}
                list={list}
                handleClick={(key) => {
                  handleClick(key)
                  setOpen(false)
                }}
                localPath={localPath}
                setChoosen={() => {}}
                setOpen={setOpen}
                isDesktop={false}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: static sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200/60 bg-white dark:border-white/6 dark:bg-[#0d1117] lg:flex lg:flex-col">
        <div className="flex flex-1 flex-col justify-between p-4">
          <SideBarContent
            currentUser={currentUser}
            list={list}
            handleClick={handleClick}
            localPath={localPath}
            setChoosen={() => {}}
            setOpen={setOpen}
            isDesktop
          />
        </div>
      </aside>
    </>
  )
}
