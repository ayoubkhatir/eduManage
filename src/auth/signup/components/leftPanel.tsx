import { ModeToggle } from '#/features/theme/mode-toggle'

export function LeftPanel() {
  return (
    <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-8 lg:flex">
      {/* Logo */}
      <div className="relative z-20 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-md shadow-primary/25">
          <span className="material-symbols-outlined text-xl">school</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          EduManage
        </span>
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ModeToggle />
      </div>

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        data-alt="Modern university campus building facade with sleek glass architecture at twilight"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkWAa3uZ8HcWWJzbB3NAtRBqhiNS8DkznHU7d9e68ynTQosKHAuPcQfa3FaxDs2ka0IOwt-1aRWAdq8u86wIy79aoIDpD1H_gV9zhWeq5hpBzsQiy-ltIdsvZ17b5lN09xzg5U0LrCsWX_e549oRmi-6m2WygvFzIT3m551q8BJD-i6X0dINtZQ0RmWDwT4O8tdxr7ANg8y_ZPW8orGBnxqBI8Mammdkr4oS_jZnL3pzJyypmKsEAn-lb42J5OhWB7VfYO9P-F61zh')",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-slate-900/20" />

      {/* Content */}
      <div className="relative z-10 max-w-lg space-y-5">
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          For Administrators
        </span>

        <div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white">
            Start managing your school efficiently
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            Join thousands of education leaders who trust EduManage to streamline
            operations, track performance, and connect their community.
          </p>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3 border-t border-white/10 pt-5">
          <div className="flex -space-x-2.5">
            {[
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDdCjN4RAh1q7xXwdP8rNm-seNhifWg-Vhz2RZhmaUJJV8I4Vqpi5nprK9WkGOV3xwiWWvzTyS9Z-lTOg_hYBQqZHlKtL76J-bGNWn2znQqhkiXEEc_lAtIPbHX83Apg-8QUbxTDlIqZG_kTeBqGU5qDAp9B7KjBUalmaV-uRtNHI9OSGWGT0Yg4_lxTeeiFbOgR6QlpYlJ6S4BiDifv1pBSRBbTO3avB73pvFNTr6-FU9Zn1sUUdWy1i5giv6STYZv1eoVaA6vsm-k',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBUsMpqftlVB_KLJZPb5Kpmu7P7t4nIKvsGwOsgk9Y9BUEyDKR2ZfRPf7ysBGGpo3FEMtgkBUUjba1ManXwCC06jCBmho7Lr_o3c_Kf-3z9Zeazy4UdaTAwyT-x7gwgo4JD15f8RR3KWcOW56FZqKJ2veZFds9d8NP1pa8TAHSMWg3_HUeUwcB7cMwClfrE10dv3eYEPAE8EoZqdJo9pqgLLk2QzD9o9RDd2ngIbZCGn-Xvks74sMORQWqx4FAVkDKwEVJW1Q-g8jFh',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAd5flBKZCMC_Lb-pDR91VDuVlWbQ7JR9LNm5p-AruhuKGKqH8IBD9cQxGx8YHv5pi46EJfqOaKOgnJEHtxQPbQfmbZ_K64qRfTK_en5qv1a1Q2mCdFML4lyhO2giF1SDIilsmsd2My4GD9KNQb5w6PmcZov9AmIcmv4xY76ck4Bg89bhgLCkyQm1cN2m2v94lXx4MMKsiNs6QhT1vVtAU5g2qP7HG22hVAoZABy6clHrmSoN_ZwcHbns3ktlv1iui6IiLUJ05QVqs5',
            ].map((src, i) => (
              <img
                key={i}
                className="size-9 rounded-full border-2 border-slate-900 object-cover"
                alt=""
                src={src}
              />
            ))}
          </div>
          <div>
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-xs filled">
                  star
                </span>
              ))}
            </div>
            <span className="text-xs font-medium text-white/70">
              Loved by admins
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
