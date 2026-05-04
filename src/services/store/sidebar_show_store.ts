import { create } from 'zustand'

type SideBarState = {
  isOpen: boolean
  toggle: () => void
  setOpen: (value: boolean) => void
}

const useSideBarStore = create<SideBarState>((set) => ({
  // start open on larger screens; the UI will still hide it on mobile until opened
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (value) => set({ isOpen: value }),
}))

export default useSideBarStore
