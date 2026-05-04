import { create } from 'zustand'

type SideBarListeState = {
  choosenItem: string
  setChoosen: (value: string) => void
}

const getInitialPath = () => {
  if (typeof window === 'undefined') return 'calendar'
  return window.location.pathname.split('/')[2] || 'calendar'
}

const useSideBarListStore = create<SideBarListeState>((set) => ({
  choosenItem: getInitialPath(),
  setChoosen: (value: string) => set({ choosenItem: value }),
}))

export default useSideBarListStore