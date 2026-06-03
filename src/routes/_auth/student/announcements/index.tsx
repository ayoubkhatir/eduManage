import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import AnnouncementsList from '#/components/announcementsList'
import { motion } from 'framer-motion'
import { FetchCurrentUserServerFn } from '#/routes/-fetchAuthStateInBeforeLoad'
import Loading from '#/components/loading'
import { getAnnouncementsListQueryOptions } from '#/hooks/admin/hooks'
import { SearchInput } from '#/components/admin/SearchInput'
import { AnnouncementAudienceEnum } from '#/server/db/schema'
import { getAnnouncementsFiltersSchema } from '#/schemas/announcement.schema'
import type { StudentUser } from '#/types/studentTypes'

export const Route = createFileRoute('/_auth/student/announcements/')({
  component: Announcement,

  validateSearch: getAnnouncementsFiltersSchema,

  loaderDeps: ({ search }) => ({ search: search.search }),
  loader: async ({ context, deps }) => {
    const currentUser = (await FetchCurrentUserServerFn({
      data: context.authState.user!,
    })) as StudentUser

    context.queryClient.ensureQueryData({
      ...getAnnouncementsListQueryOptions(currentUser.id, {
        search: deps.search,
        audience: AnnouncementAudienceEnum.PUBLIC,
      }),
    })
    return { currentUser }
  },
  head: () => ({
    meta: [{ title: 'Student | Announcements - EduManage' }],
  }),
  staticData: {
    breadcrumb: 'Announcements',
  },
})

function Announcement() {
  const { currentUser } = Route.useLoaderData()
  const navigate = Route.useNavigate()
  const { search } = Route.useSearch({
    select: (s) => ({ search: s.search }),
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 py-8 px-4 sm:px-8 flex flex-col w-full overflow-y-auto gap-8 relative"
    >
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
          schoolId={currentUser.info.schoolId}
          filters={{ search, audience: AnnouncementAudienceEnum.PUBLIC }}
          role="student"
        />
      </Suspense>

      <div className="flex justify-center py-8">
        <p className="text-[#4b5563] text-md">End of Announcements</p>
      </div>
    </motion.div>
  )
}
