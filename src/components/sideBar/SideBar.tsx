// import { useCallback, useMemo } from 'react'
// import { useLocation, useNavigate } from '@tanstack/react-router'
// import useSideBarListStore from '../../services/store/sidebar_list_store'
// import useSideBarStore from '../../services/store/sidebar_show_store'
// import useAvatarStore from '../../services/store/avatar_store'
// import { useMediaQuery } from '../../hooks/use-media-query'
// import { SideBarContent } from './SideBarContent'
// import type { SideBarProps, SidebarItem } from './types'
// import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'

// export function SideBar({ info }: SideBarProps) {
//   /* media query hook for responsive behavior */
//   const isDesktop = useMediaQuery('(min-width: 1024px)')

//   /* import avatar state */
//   const avatarSrc = useAvatarStore((state) => state.avatarSrc)
//   /* navigate variable*/
//   const navigate = useNavigate()
//   const localPath = useLocation().pathname.split('/')[1]
//   /* List of sidebar items  state*/
//   const choosenItem = useSideBarListStore((state) => state.choosenItem)
//   const setChoosen = useSideBarListStore((state) => state.setChoosen)

//   const list = useMemo((): Array<SidebarItem> => {
//     if (!info?.list) return []
//     return info.list.map((item) => {
//       const key = item.name.toLowerCase()
//       return { ...item, key, active: choosenItem === key }
//     })
//   }, [info?.list, choosenItem])

//   /* handle onClick button of the list*/
//   const handleClick = useCallback(
//     (itemKey: string) => {
//       setChoosen(itemKey)
//       navigate({ to: `/${info?.layout}/${itemKey}` })
//     },
//     [info?.layout, setChoosen, navigate],
//   )

//   const handleLogout = useCallback(() => {
//     // TODO: Implement logout logic
//   }, [])

//   /* sideBar variable */
//   const isOpen = useSideBarStore((state) => state.isOpen)
//   const setOpen = useSideBarStore((state) => state.setOpen)

//   return (
//     <>
//       {/* Mobile Drawer */}
//       {!isDesktop && (
//         <Drawer open={isOpen} onOpenChange={setOpen} direction="left">
//           <DrawerTrigger asChild>
//             <button
//               className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
//               aria-label="Toggle navigation menu"
//             >
//               <span className="material-symbols-outlined">menu</span>
//             </button>
//           </DrawerTrigger>
//           <DrawerContent className="w-52 h-screen justify-between bg-surface-light dark:bg-surface-dark border-r border-slate-200/80 dark:border-slate-800 p-4">
//             <SideBarContent
//               list={list}
//               handleClick={handleClick}
//               avatarSrc={avatarSrc}
//               localPath={localPath}
//               setChoosen={setChoosen}
//               setOpen={setOpen}
//               isDesktop={isDesktop}
//               handleLogout={handleLogout}
//             />
//           </DrawerContent>
//         </Drawer>
//       )}

//       {/* Desktop Sidebar */}
//       {isDesktop && (
//         <aside className="fixed lg:static inset-y-0 left-0 z-40 flex flex-col justify-between bg-surface-light dark:bg-surface-dark border-r border-slate-200/80 dark:border-slate-800 shrink-0 w-60 p-4">
//           <SideBarContent
//             list={list}
//             handleClick={handleClick}
//             avatarSrc={avatarSrc}
//             localPath={localPath}
//             setChoosen={setChoosen}
//             setOpen={setOpen}
//             isDesktop={isDesktop}
//             handleLogout={handleLogout}
//           />
//         </aside>
//       )}
//     </>
//   )
// }

import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import useSideBarStore from '../../services/store/sidebar_show_store'
import { SideBarContent, type SidebarItem } from './SideBarContent'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'

function getCurrentSidebarKey(pathname: string) {
  return pathname.split('/')[2] || 'calendar'
}


export interface SideBarProps {
  info?: {
    list?: Array<{ name: string; icon: string }>
    layout?: string
  }
}

export function SideBar({ info  }: SideBarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const localPath = location.pathname.split('/')[1]
  const activeItem = getCurrentSidebarKey(location.pathname)

  const list = useMemo((): Array<SidebarItem> => {
    if (!info?.list) return []

    return info.list.map((item) => {
      const key = item.name.toLowerCase()
      return {
        ...item,
        key,
        active: activeItem === key,
      }
    })
  }, [info?.list, activeItem])

  const handleClick = useCallback(
    (itemKey: string) => {
      navigate({ to: `/${info?.layout}/${itemKey}` })
    },
    [info?.layout, navigate],
  )

  const isOpen = useSideBarStore((state) => state.isOpen)
  const setOpen = useSideBarStore((state) => state.setOpen)

  return (
    <>
      {/* Mobile only */}
      <div className="lg:hidden">
        <Drawer open={isOpen} onOpenChange={setOpen} direction="left">
          <DrawerTrigger asChild>
            <button
              className="fixed top-4 left-4 z-40 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </DrawerTrigger>

          <DrawerContent className="w-72 h-screen justify-between bg-surface-light dark:bg-surface-dark border-r border-slate-200/80 dark:border-slate-800 p-4">
            <SideBarContent
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
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop only */}
      <aside className="hidden lg:flex lg:w-72 lg:min-w-72 lg:flex-col lg:justify-between bg-surface-light dark:bg-surface-dark border-r border-slate-200/80 dark:border-slate-800 p-4">
        <SideBarContent
          list={list}
          handleClick={handleClick}
          localPath={localPath}
          setChoosen={() => {}}
          setOpen={setOpen}
          isDesktop={true}
        />
      </aside>
    </>
  )
}
