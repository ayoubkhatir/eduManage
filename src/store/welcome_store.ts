import { create } from 'zustand'

export type WelcomeSideBarState = {
  isOpen: boolean
  toggle: () => void
  closeSideBar: () => void
}

const useWelcomeSideBarStore = create<WelcomeSideBarState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSideBar: () => set({ isOpen: false }),
}))

export default useWelcomeSideBarStore
