import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/Pages/privacy')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Privacy Policy - EduManage' }] }),
})

function RouteComponent() {
  return (
    <Skeleton name="privacy" loading={false}>
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
                    Privacy Policy
                  </h1>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: May 1, 2026</p>
                </div>
              </FadeIn>

              <FadeIn delay={80}>
                <div className="mt-12 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Information We Collect</h2>
                  <p>We collect information you provide directly to us, including name, email address, school details, and payment information when you create an account or use our services.</p>
                  <p>We also automatically collect certain technical information, such as IP address, browser type, device information, and usage data when you interact with our platform.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">How We Use Your Information</h2>
                  <p>We use the information we collect to provide, maintain, and improve our services; to process transactions; to send technical notices, updates, and support messages; and to respond to your comments and inquiries.</p>
                  <p>We do not sell your personal information to third parties. We may share information with trusted service providers who assist us in operating our platform, subject to strict confidentiality agreements.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Security</h2>
                  <p>We implement industry-standard security measures including encryption, access controls, and regular security audits to protect your data. However, no method of transmission over the internet is 100% secure.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Data Retention</h2>
                  <p>We retain your information for as long as your account is active or as needed to provide you services. You can request deletion of your data at any time by contacting our support team.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Rights</h2>
                  <p>Depending on your jurisdiction, you may have the right to access, correct, delete, or port your personal data. You may also have the right to restrict or object to certain processing of your data.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact</h2>
                  <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@edumanage.com" className="text-primary hover:underline">privacy@edumanage.com</a>.</p>
                </div>
              </FadeIn>
            </div>
          </Section>
        </div>
      </PageLayout>
    </Skeleton>
  )
}
