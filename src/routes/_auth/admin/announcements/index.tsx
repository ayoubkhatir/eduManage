import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import AnnouncementsList from '#/components/announcementsList'
import { motion } from 'framer-motion'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import type { AdminUser } from '#/types/usersTypes'
import Loading from '#/components/loading'
import { getAnnouncementsListQueryOptions } from '#/hooks/admin/hooks'
import {
  AnnouncementsStatCards,
  UICardSkeleton,
} from '#/components/admin/cards/UICard'
import {
  AnnouncementAudienceEnum,
  announcementAudienceList,
} from '#/server/db/schema'
import { SearchInput } from '#/components/admin/SearchInput'
import { getAnnouncementsFiltersSchema } from '#/schemas/announcement.schema'

export const Route = createFileRoute('/_auth/admin/announcements/')({
  component: Announcement,

  validateSearch: getAnnouncementsFiltersSchema,

  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as AdminUser

    context.queryClient.ensureQueryData({
      ...getAnnouncementsListQueryOptions(currentUser.id, {
        search: deps.search,
        audience: deps.audience,
      }),
    })
    return { currentUser }
  },
  staticData: {
    breadcrumb: 'Announcements',
  },
  head: () => ({
    meta: [{ title: 'Owner | Announcements - EduManage' }],
  }),
})

function Announcement() {
  const { currentUser } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { search, audience } = Route.useSearch({
    select: (s) => ({ search: s.search, audience: s.audience }),
  })

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
          <Link
            to="/admin/createAnnouncement"
            className="flex items-center gap-2 justify-center rounded-lg h-8 px-5 py-6  bg-primary  hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-md font-bold active:scale-95 cursor-pointer"
          >
            <button className="flex shrink-0 items-center gap-2 justify-center rounded-lg h-8 px-5 py-6  bg-primary  hover:bg-blue-700 dark:hover:bg-blue-500 text-white text-md font-bold active:scale-95 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Create Announcement</span>
            </button>
          </Link>
        </div>

        <Suspense fallback={<UICardSkeleton count={3} />}>
          <AnnouncementsStatCards
            schoolId={currentUser.info.id}
            filters={{ audience, search }}
          />
        </Suspense>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1e293b] p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-full md:w-96">
          <SearchInput
            placeholder="Search"
            value={search}
            onSearch={(value) =>
              navigate({
                search: (s) => ({
                  ...s,
                  search: value,
                }),
              })
            }
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <AudienceSelect />
        </div>
      </div>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Loading
              className="h-[80%] w-[80%] p-10"
              text="loading..."
              description="Please wait while we fetch the announcements for you."
            />
          </div>
        }
      >
        <AnnouncementsList
          schoolId={currentUser.info.id}
          filters={{ search, audience }}
        />
      </Suspense>

      <div className="flex justify-center py-8">
        <p className="text-[#4b5563] text-md">End of Announcements</p>
      </div>
    </motion.div>
  )
}

function AudienceSelect() {
  const navigate = Route.useNavigate()
  const audience = Route.useSearch({ select: (s) => s.audience })

  return (
    <select
      className="flex items-center h-12 rounded-lg border-none bg-gray-100 px-4 py-0 pr-8 pl-8 text-sm font-medium text-slate-500 
    focus:ring-0 border-slate-100 dark:border-gray-700/50  dark:text-white  dark:bg-[#1E2532] hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/30 dark:hover:border-primary/40 hover:text-primary dark:hover:text-blue-400 group cursor-pointer"
      style={{
        transition:
          'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
      }}
      value={audience}
      onChange={(e) =>
        navigate({
          to: '.',
          search: (s) => ({
            ...s,
            audience: announcementAudienceList.includes(
              e.target.value as AnnouncementAudienceEnum,
            )
              ? (e.target.value as AnnouncementAudienceEnum)
              : AnnouncementAudienceEnum.PUBLIC,
          }),
        })
      }
    >
      {announcementAudienceList.map((audience) => (
        <option key={audience} value={audience}>
          {audience}
        </option>
      ))}
    </select>
  )
}
