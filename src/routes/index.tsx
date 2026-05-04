import SideBar from '#/components/welcomePage/side-bar'
import { ModeToggle } from '#/features/theme/mode-toggle'
import useWelcomeSideBarStore from '#/services/store/welcome_store'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Skeleton } from 'boneyard-js/react'

export const Route = createFileRoute('/')({
  component: App,
  head: () => ({
    meta: [
      {
        title: 'EduManage',
      },
    ],
  }),
})

function App() {
  const toggleSideBar = useWelcomeSideBarStore((state) => state.toggle)

  /* use theme provider */

  /* for smooth scrolling when go to #*/
  const scrollToId = (id: string) => {
    if (!document || typeof document === 'undefined') return

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const scrollToSection =
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      scrollToId(id)
    }

  return (
    <Skeleton name="landing-page" loading={false}>
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display overflow-hidden antialiased">
        <div className="relative flex h-full flex-col w-full">
          <SideBar onNavigate={scrollToId} />
          {/* Navbar */}
          <div className="fixed top-0 left-0 right-0 w-full h-16 border-b border-slate-200/70 dark:border-white/10 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
            <div className="h-full px-5 md:px-10 lg:px-40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-slate-900 dark:text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl">
                    school
                  </span>
                </div>
                <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
                  EduManage
                </h2>
              </div>
              <div className="absolute right-15 md:right-100 lg:right-5 ">
                <ModeToggle />
              </div>
              <button
                className="md:hidden text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
                onClick={toggleSideBar}
                aria-label="Open menu"
              >
                <span className="material-symbols-outlined">menu</span>
              </button>
              <div className="hidden md:flex items-center gap-8">
                <a
                  className="text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-primary"
                  href="#features"
                  onClick={scrollToSection('features')}
                >
                  Features
                </a>
                <a
                  className="text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-primary"
                  href="#roles"
                  onClick={scrollToSection('roles')}
                >
                  Roles
                </a>
                <a
                  className="text-sm font-medium text-slate-600 dark:text-slate-200 hover:text-primary"
                  href="#contact"
                  onClick={scrollToSection('contact')}
                >
                  Contact
                </a>
                <a
                  href="#roles"
                  onClick={scrollToSection('roles')}
                  className="flex items-center justify-center rounded-full h-10 px-6 bg-primary text-white text-sm font-bold hover:brightness-95 cursor-pointer"
                >
                  Login
                </a>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pt-16">
            {/* Hero Section */}
            <div className="bg-background-light dark:bg-background-dark">
              <div className="px-5 md:px-10 lg:px-40 py-10 lg:py-20 flex justify-center">
                <div className="flex flex-col gap-10 lg:flex-row items-center max-w-300 w-full">
                  {/* Text Content */}
                  <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                      Managing the{' '}
                      <span className="relative inline-block after:content-[''] after:absolute after:bottom-2 after:left-0 after:w-full after:h-3 after:bg-primary/40 after:-z-10">
                        Future
                      </span>{' '}
                      of Education, Today
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
                      Streamline operations, empower teachers, and engage
                      students with the all-in-one private school management
                      platform tailored for modern education.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                      <a
                        href="#create-account"
                        onClick={scrollToSection('create-account')}
                        className="flex items-center justify-center rounded-full h-12 px-8 bg-primary text-white text-base font-bold hover:scale-105 cursor-pointer"
                        style={{ transition: 'transform 0.2s ease-in-out' }}
                      >
                        Get Started
                      </a>

                      <a
                        href="#features"
                        onClick={scrollToSection('features')}
                        className="flex items-center justify-center rounded-full h-12 px-8 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white text-base font-bold hover:bg-slate-200/80 dark:hover:bg-white/15 cursor-pointer"
                      >
                        View Demo
                      </a>
                    </div>
                  </div>
                  {/* Hero Image */}
                  <div className="flex-1 w-full relative">
                    <div
                      className="relative w-full aspect-4/3 rounded-xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0"
                      style={{ transition: 'transform 0.5s ease-out' }}
                    >
                      <div className="absolute inset-0 bg-linear-to-tr from-black/20 to-transparent z-10"></div>
                      <div
                        className="w-full h-full bg-cover bg-center"
                        data-alt="Diverse group of students studying together in a modern library"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZqbstZzqaeF8JDbgNQtXEEwKRbbPZDiZJ5rnZGrYsnS9OAlKxB38jrlYuTsdqWs8jRhyK4inxqaz5G9EZ_yv1DafWhFrrSjvi90Hz8e6KN6wLeM6xg4a_L36b6b0YuP4sQoYkO59zo1ppOnieOHjtjFujr8IUTTtyISjzo150zxVOyC8PAerA7XHnpbKHRdWaS2cHQn0aRU7B3vke4c9wDqzXec4_-Pl3dSr1N_Z_UOcnKWORVmG_tB75ILf9wq28bKVoUzYIoK0')",
                        }}
                      ></div>
                    </div>
                    {/* Decorative Elements */}
                    <div
                      className="absolute -bottom-6 -left-6 bg-white dark:bg-surface-dark p-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce border border-slate-200/70 dark:border-white/10"
                      style={{ animationDuration: '3s' }}
                    >
                      <span className="material-symbols-outlined text-green-500 text-3xl">
                        check_circle
                      </span>
                      <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wide">
                          Attendance
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          98% Today
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Statistics Section */}
            <div className="w-full bg-background-light dark:bg-surface-dark/30 border-y border-slate-200/70 dark:border-white/10">
              <div className="px-4 md:px-40 flex flex-1 justify-center py-12">
                <div className="layout-content-container flex flex-col max-w-240 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                      className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-surface-dark shadow-sm hover:shadow-lg hover:-translate-y-1 border border-slate-200/70 dark:border-white/10 hover:border-primary/30 cursor-pointer"
                      style={{
                        transition:
                          'transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary text-3xl">
                          domain
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal">
                          Schools Trust Us
                        </p>
                      </div>
                      <p className="text-slate-900 dark:text-white tracking-light text-4xl font-black leading-tight">
                        50+
                      </p>
                    </div>
                    <div
                      className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-surface-dark shadow-sm hover:shadow-lg hover:-translate-y-1 border border-slate-200/70 dark:border-white/10 hover:border-primary/30 cursor-pointer"
                      style={{
                        transition:
                          'transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary text-3xl">
                          groups
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal">
                          Active Students
                        </p>
                      </div>
                      <p className="text-slate-900 dark:text-white tracking-light text-4xl font-black leading-tight">
                        10k+
                      </p>
                    </div>
                    <div
                      className="flex flex-col gap-2 rounded-xl p-8 bg-white dark:bg-surface-dark shadow-sm hover:shadow-lg hover:-translate-y-1 border border-slate-200/70 dark:border-white/10 hover:border-primary/30 cursor-pointer"
                      style={{
                        transition:
                          'transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease-out',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-primary text-3xl">
                          cast_for_education
                        </span>
                        <p className="text-slate-600 dark:text-slate-400 text-base font-medium leading-normal">
                          Teachers Empowered
                        </p>
                      </div>
                      <p className="text-slate-900 dark:text-white tracking-light text-4xl font-black leading-tight">
                        500+
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Features Bento Grid */}
            <div
              className="w-full bg-background-light dark:bg-background-dark py-20"
              id="features"
            >
              <div className="px-5 md:px-10 lg:px-40 flex justify-center">
                <div className="max-w-300 w-full flex flex-col gap-10">
                  <div className="flex flex-col gap-2 max-w-150">
                    <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
                      Everything you need to run a modern school
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Powerful features wrapped in a simple, intuitive
                      interface.
                    </p>
                  </div>
                  {/* Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-125">
                    {/* Large Feature 1 */}
                    <div
                      className="md:col-span-2 md:row-span-2 rounded-xl bg-background-light dark:bg-surface-dark border border-gray-100 dark:border-white/10 p-8 flex flex-col overflow-hidden relative group cursor-pointer hover:shadow-lg hover:-translate-y-1"
                      style={{
                        transition: 'translate 0.2s ease-out',
                      }}
                    >
                      <div className="z-10">
                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary mb-4">
                          <span className="material-symbols-outlined text-white">
                            monitoring
                          </span>
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          Real-time Analytics
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                          Make data-driven decisions with comprehensive reports
                          on student performance and financial health.
                        </p>
                      </div>
                      <div
                        className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-linear-to-tl from-gray-100 to-transparent dark:from-white/5 rounded-tl-full translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5"
                        style={{ transition: 'transform 0.5s ease-in-out' }}
                      >
                        <div className="w-full h-full p-8 flex items-end justify-end">
                          {/* Abstract representation of a chart */}
                          <div className="flex items-end gap-2 w-full h-1/2 opacity-50">
                            <div className="w-1/5 bg-primary/40 h-[40%] rounded-t-lg"></div>
                            <div className="w-1/5 bg-primary/60 h-[70%] rounded-t-lg"></div>
                            <div className="w-1/5 bg-primary/80 h-[50%] rounded-t-lg"></div>
                            <div className="w-1/5 bg-primary h-[90%] rounded-t-lg"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Small Feature 2 */}
                    <div
                      className="rounded-xl bg-background-light dark:bg-surface-dark border border-gray-100 dark:border-white/10 p-6 flex flex-col justify-between hover:border-primary/50 cursor-pointer hover:shadow-md hover:-translate-y-1"
                      style={{
                        transition: 'translate 0.2s ease-out',
                      }}
                    >
                      <span className="material-symbols-outlined text-4xl text-primary mb-2">
                        payments
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Fee Management
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Automated billing &amp; tracking.
                        </p>
                      </div>
                    </div>
                    {/* Small Feature 3 */}
                    <div
                      className="rounded-xl bg-background-light dark:bg-surface-dark border border-gray-100 dark:border-white/10 p-6 flex flex-col justify-between hover:border-primary/50 cursor-pointer hover:shadow-md hover:-translate-y-1"
                      style={{
                        transition: 'translate 0.2s ease-out',
                      }}
                    >
                      <span className="material-symbols-outlined text-4xl text-primary mb-2">
                        chat
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Communication
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Direct teacher-parent chat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Role Selection Section */}
            <div
              className="w-full bg-background-light dark:bg-surface-dark/20 border-t border-slate-200/70 dark:border-white/10"
              id="roles"
            >
              <div className="px-5 md:px-10 lg:px-40 pt-16 pb-8 flex justify-center">
                <div className="max-w-240 w-full text-center">
                  <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                    Who is it for?
                  </span>
                  <h2 className="text-slate-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">
                    Tailored for Every Role
                  </h2>
                  <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                    Specific tools and dashboards designed to make everyone's
                    life easier, from the front office to the classroom.
                  </p>
                </div>
              </div>
            </div>
            {/* Role Cards (TextGrid Modified) */}
            <div className="w-full bg-background-light dark:bg-surface-dark/20 pb-20">
              <div className="px-5 md:px-10 lg:px-40 flex justify-center">
                <div className="max-w-300 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Owner Card */}
                  <div
                    className="flex flex-col gap-4 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-surface-dark p-8 items-center text-center hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
                    style={{ transition: 'translate 0.2s ease-out' }}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white">
                      <span className="material-symbols-outlined text-3xl">
                        domain
                      </span>
                    </div>
                    <div>
                      <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                        School Owners
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                        Simplify administration, track finances, and oversee
                        operations from a single dashboard.
                      </p>
                    </div>
                    <Link
                      to="/log-in"
                      search={{
                        role: 'owner',
                        redirectTo: '/owner/dashboard',
                      }}
                      className="mt-auto w-full py-3 rounded-full border border-slate-200/70 dark:border-white/15 hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/15 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      Login as Owner
                    </Link>
                  </div>

                  {/* Teacher Card */}
                  <div
                    className="flex flex-col gap-4 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-surface-dark p-8 items-center text-center hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
                    style={{
                      transition: 'translate 0.2s ease-out',
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white">
                      <span className="material-symbols-outlined text-3xl">
                        auto_stories
                      </span>
                    </div>
                    <div>
                      <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                        Teachers
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                        Focus on teaching, not paperwork. Manage grades,
                        attendance, and lesson plans easily.
                      </p>
                    </div>
                    <Link
                      to="/log-in"
                      search={{
                        role: 'teacher',
                        redirectTo: '/teacher/calendar',
                      }}
                      className="mt-auto w-full py-3 rounded-full border border-slate-200/70 dark:border-white/15 hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/15 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      Login as Teacher
                    </Link>
                  </div>

                  {/* Student Card */}
                  <div
                    className="flex flex-col gap-4 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white dark:bg-surface-dark p-8 items-center text-center hover:shadow-lg hover:-translate-y-1 group cursor-pointer"
                    style={{ transition: 'translate 0.2s ease-out' }}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white">
                      <span className="material-symbols-outlined text-3xl">
                        backpack
                      </span>
                    </div>
                    <div>
                      <h2 className="text-slate-900 dark:text-white text-xl font-bold">
                        Students
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                        Access grades, schedules, and assignments instantly from
                        your computer or phone.
                      </p>
                    </div>
                    <Link
                      to="/log-in"
                      search={{
                        role: 'student',
                        redirectTo: '/student/calendar',
                      }}
                      className="mt-auto w-full py-3 rounded-full border border-slate-200/70 dark:border-white/15 hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/15 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                      Login as Student
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* CTA Section */}
            <div
              className="w-full bg-background-light dark:bg-surface-dark/30 border-t border-slate-200/70 dark:border-white/10"
              id="create-account"
            >
              <div className="px-5 md:px-10 lg:px-40 py-16 flex justify-center">
                <div className="max-w-300 w-full bg-surface-light dark:bg-surface-dark border border-slate-900/10 dark:border-white/10 rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                  <div className="flex flex-col gap-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                      Ready to transform your school?
                    </h2>
                    <p className="text-slate-700 dark:text-slate-300 text-lg">
                      Join over 500+ schools modernizing education today.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      className="flex items-center justify-center rounded-full h-14 px-8 bg-primary text-white text-lg font-bold hover:brightness-110 cursor-pointer shadow-[0_0_20px_rgba(249,245,6,0.3)]"
                      style={{ transition: 'filter 0.2s ease-in-out' }}
                    >
                      <Link to="/sign-up">Create an Account</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <footer
              className="bg-background-light dark:bg-background-dark border-t border-slate-200/70 dark:border-white/10"
              id="contact"
            >
              <div className="px-5 md:px-10 lg:px-40 py-12 flex justify-center">
                <div className="max-w-300 w-full grid grid-cols-1 md:grid-cols-4 gap-10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <span className="material-symbols-outlined text-2xl">
                        school
                      </span>
                      <span className="font-bold text-lg">SchoolManage</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Making education management simple, efficient, and
                      accessible for everyone.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      Product
                    </h4>
                    <a
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                      href="#"
                    >
                      Features
                    </a>
                    <a
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                      href="#"
                    >
                      Pricing
                    </a>
                    <a
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                      href="#"
                    >
                      Security
                    </a>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      Company
                    </h4>
                    <a
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                      href="#"
                    >
                      About Us
                    </a>
                    <a
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                      href="#"
                    >
                      Careers
                    </a>
                    <a
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary"
                      href="#"
                    >
                      Contact
                    </a>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      Connect
                    </h4>
                    <div className="flex gap-4">
                      <a
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white text-slate-600 dark:text-slate-200"
                        href="#"
                      >
                        {/* Twitter Icon stub */}
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                        </svg>
                      </a>
                      <a
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white text-slate-600 dark:text-slate-200"
                        href="#"
                      >
                        {/* Linkedin Icon stub */}
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-white/5 py-6 text-center">
                <p className="text-xs text-slate-500/70">
                  © 2026 SchoolManage Inc. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </Skeleton>
  )
}
