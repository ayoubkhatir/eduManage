import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn, Icon } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/_auth/Pages/blog')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Blog - EduManage' }] }),
})

const posts = [
  { title: 'How Digital Tools Are Transforming Classroom Management', date: 'May 10, 2026', author: 'Sarah Mitchell', category: 'Education', excerpt: 'Discover how schools worldwide are leveraging technology to streamline operations and improve student outcomes.' },
  { title: 'A Guide to Modern School Fee Management', date: 'Apr 28, 2026', author: 'James Okonkwo', category: 'Product', excerpt: 'Learn how automated fee management can reduce administrative burden and improve collection rates.' },
  { title: 'The Future of Parent-Teacher Communication', date: 'Apr 15, 2026', author: 'Maria Santos', category: 'Education', excerpt: 'Why traditional parent-teacher meetings are being replaced by continuous digital engagement.' },
  { title: 'Introducing Our New Analytics Dashboard', date: 'Mar 30, 2026', author: 'Product Team', category: 'Product', excerpt: 'We rebuilt our analytics from the ground up. Here is what changed and why it matters for your school.' },
  { title: 'Security Best Practices for School Data', date: 'Mar 12, 2026', author: 'Security Team', category: 'Security', excerpt: 'Everything you need to know about keeping student and staff data safe in the digital age.' },
]

function RouteComponent() {
  return (
    <Skeleton name="blog" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-2xl text-center">
              <FadeIn>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Blog</p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Insights & updates
                </h1>
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                  Thoughts on education, technology, and how we&apos;re making schools better.
                </p>
              </FadeIn>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {posts.map((post, i) => (
                <FadeIn key={post.title} delay={i * 60}>
                  <a href="#" className="group flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 dark:border-white/6border-white/[0.06] dark:bg-white/3 dark:hover:border-primary/40">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{post.category}</span>
                      <span className="text-slate-400">{post.date}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {post.excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                      <Icon name="person" className="text-base" />
                      {post.author}
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
