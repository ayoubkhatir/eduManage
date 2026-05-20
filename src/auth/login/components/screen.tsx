import { ModeToggle } from '#/features/theme/mode-toggle'

export default function Screen() {
  return (
    <div className="relative hidden w-0 flex-1 lg:block bg-slate-900">
      {/* Background image */}
      <img
        alt="Modern university administration building interior with clean architecture"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1A0CvbKfTRRTzJRkPa3i7CTsp9HO4hqPvB9ypd42nh19Z12dgK3p44ula8kl1aQ5WSV8qOaO9jIiKugVZhrk4uT0o2y3kIKhXOLah_-QJKvE6CzZOKUi8gIr37UGXeWbTYq1rOpjeR0StbcXBHs7kytH-CDJ6dEYJyLbOqh9l6azbyuwrp9s561X51B4gKUzIhmJIyhMuVObjFE2v0NUEAoseBrGDT4G5a41VDYehI2cHcBWHvK4MDg-DyhKXu5DeiN6J8I1KJTrz"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent" />

      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ModeToggle />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-12 xl:p-16">
        <div className="max-w-xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
            <span className="material-symbols-outlined text-sm text-emerald-400">
              verified
            </span>
            Trusted by 500+ schools worldwide
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white xl:text-4xl leading-tight">
            Empowering education leaders worldwide
          </h2>

          {/* Testimonial */}
          <blockquote className="relative border-l-2 border-white/20 pl-5">
            <p className="text-base font-light italic leading-relaxed text-white/80">
              &ldquo;The most comprehensive platform we&apos;ve used. It
              completely transformed how we manage our campuses and engage with
              parents.&rdquo;
            </p>
            <footer className="mt-4 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                S
              </div>
              <div>
                <span className="text-sm font-semibold text-white">
                  Sarah J. Collins
                </span>
                <span className="block text-xs text-white/50">
                  Director of Education, Westview Academy
                </span>
              </div>
            </footer>
          </blockquote>

          {/* Stats */}
          <div className="flex gap-8 border-t border-white/10 pt-5">
            {[
              { value: '50+', label: 'Schools' },
              { value: '10k+', label: 'Students' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
