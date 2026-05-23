import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import AnnouncementList from '@/components/announcementList'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/_auth/admin/announcements')({
  component: Announcement,
  head: () => ({
    meta: [{ title: 'Owner | Announcements - EduManage' }],
  }),
})

function Announcement() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedAudience, setSelectedAudience] = useState('All School')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 py-8 px-4 sm:px-8 flex flex-col w-full overflow-y-auto gap-8 relative"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Announcements Dashboard
            </h2>
            <p className="text-slate-500 dark:text-[#9da6b9] text-base font-normal">
              Manage and broadcast school-wide updates.
            </p>
          </div>

          <button
            onClick={() => navigate({ to: '/admin/creatAnnouncement' })}
            className="flex shrink-0 items-center gap-2 justify-center rounded-lg h-8 px-5 py-6  bg-primary  hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-md font-bold active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Announcement</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1e293b] shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Active Posts
              </p>
            </div>
            <p className="text-3xl font-bold leading-tight mt-2">5</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1e293b] shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <span className="material-symbols-outlined">edit_document</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Drafts
              </p>
            </div>
            <p className="text-3xl font-bold leading-tight mt-2">2</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#1e293b] shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Total Views
              </p>
            </div>
            <p className="text-3xl font-bold leading-tight mt-2">1.2k</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1e293b] p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-full md:w-96">
          <label className="group relative flex w-full md:max-w-md items-center">
            <span className="absolute left-4 text-[#9da6b9] group-focus-within:text-primary">
              <span className="material-symbols-outlined text-[24px]">
                search
              </span>
            </span>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search notification history..."
              className="bg-gray-200 dark:bg-[#282e39] border border-gray-300 h-12 w-full rounded-xl dark:border-gray-700 focus:border-primary focus:bg-gray-300 dark:focus:bg-surface-dark focus:ring-0 pl-12 pr-4 text-[#0d121b] dark:text-white placeholder-[#6b7280] text-base"
            />
          </label>
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <select
            className="flex items-center h-12 rounded-lg border-none bg-gray-100 px-4 py-0 pr-8 pl-8 text-sm font-medium text-slate-500 
    focus:ring-0 border-slate-100 dark:border-gray-700/50  dark:text-white  dark:bg-[#1E2532] hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer"
            style={{
              transition:
                'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
            }}
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
          >
            <option>All School</option>
            <option>Teachers</option>
            <option>Students</option>
          </select>
        </div>
      </div>
      <AnnouncementList
        searchText={searchText}
        selectedAudience={selectedAudience}
      />

      <div className="flex justify-center py-8">
        <p className="text-[#4b5563] text-md">End of Announcements</p>
      </div>
    </motion.div>
  )
}
