import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/_auth/Pages/cookie-policy')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Cookie Policy - EduManage' }] }),
})

function RouteComponent() {
  return (
    <Skeleton name="cookie-policy" loading={false}>
      <PageLayout>
        <div className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-175 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
          </div>
          <Section>
            <div className="mx-auto max-w-3xl">
              <FadeIn>
                <div className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-widest text-primary">Legal</p>
                  <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                    Cookie Policy
                  </h1>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: May 1, 2026</p>
                </div>
              </FadeIn>

              <FadeIn delay={80}>
                <div className="mt-12 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">What Are Cookies</h2>
                  <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">How We Use Cookies</h2>
                  <p>We use the following types of cookies:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential cookies:</strong> Required for the platform to function, including authentication and security.</li>
                    <li><strong>Preference cookies:</strong> Remember your settings, language, and theme preferences.</li>
                    <li><strong>Analytics cookies:</strong> Help us understand how you use our platform so we can improve it.</li>
                  </ul>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Third-Party Cookies</h2>
                  <p>We use limited third-party services (such as analytics providers) that may set their own cookies. These services are contractually bound to protect your data.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Managing Cookies</h2>
                  <p>You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our platform.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact</h2>
                  <p>If you have questions about our use of cookies, contact us at <a href="mailto:privacy@edumanage.com" className="text-primary hover:underline">privacy@edumanage.com</a>.</p>
                </div>
              </FadeIn>
            </div>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
