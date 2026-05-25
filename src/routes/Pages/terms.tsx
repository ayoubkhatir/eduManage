import { motion } from 'framer-motion'
import { createFileRoute } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'
import { PageLayout, Section, FadeIn } from '#/components/landing/landing-shared'

export const Route = createFileRoute('/Pages/terms')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Terms of Service - EduManage' }] }),
})

function RouteComponent() {
  return (
    <Skeleton name="terms" loading={false}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
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
                    Terms of Service
                  </h1>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Last updated: May 1, 2026</p>
                </div>
              </FadeIn>

              <FadeIn delay={80}>
                <div className="mt-12 space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Acceptance of Terms</h2>
                  <p>By accessing or using EduManage, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Description of Service</h2>
                  <p>EduManage provides a web-based school management platform that includes features such as attendance tracking, grade management, fee processing, and communication tools.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">User Responsibilities</h2>
                  <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate information and keep it updated.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment Terms</h2>
                  <p>Paid plans are billed in advance on a monthly or annual basis. Refunds are provided within 14 days of purchase for annual plans. Monthly plans may be cancelled at any time.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Limitation of Liability</h2>
                  <p>EduManage shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Termination</h2>
                  <p>We reserve the right to suspend or terminate your account for violation of these terms or for any other reason at our discretion, with reasonable notice where possible.</p>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact</h2>
                  <p>For questions about these terms, contact us at <a href="mailto:legal@edumanage.com" className="text-primary hover:underline">legal@edumanage.com</a>.</p>
                </div>
              </FadeIn>
            </div>
          </Section>
        </div>
      </PageLayout>
      </motion.div>
    </Skeleton>
  )
}
