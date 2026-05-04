export function LeftPanel() {
  return (
    <div className="relative hidden lg:flex w-1/2 flex-col justify-between p-8 overflow-hidden bg-surface-dark group">
      {/* Logo */}
      <div className="relative z-20 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/70 border border-primary/90 text-white shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-2xl">school</span>
        </div>
        <h2 className="text-sm font-semibold tracking-tight text-white">
          School Manager
        </h2>
      </div>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-105"
        data-alt="Modern university campus building facade with sleek glass architecture at twilight"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkWAa3uZ8HcWWJzbB3NAtRBqhiNS8DkznHU7d9e68ynTQosKHAuPcQfa3FaxDs2ka0IOwt-1aRWAdq8u86wIy79aoIDpD1H_gV9zhWeq5hpBzsQiy-ltIdsvZ17b5lN09xzg5U0LrCsWX_e549oRmi-6m2WygvFzIT3m551q8BJD-i6X0dINtZQ0RmWDwT4O8tdxr7ANg8y_ZPW8orGBnxqBI8Mammdkr4oS_jZnL3pzJyypmKsEAn-lb42J5OhWB7VfYO9P-F61zh')",
          transition: 'transform 0.7s ease-in-out',
        }}
      />
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-[#111318]/70 to-[#111318]/20"></div>
      {/* Content Overlay */}
      <div className="relative z-10 max-w-xl">
        <div className="mb-3 flex items-center">
          <span className="px-2 py-1 rounded-full bg-primary/10 border border-primary/70 text-primary text-xs font-semibold uppercase tracking-wider">
            For Administrators
          </span>
        </div>
        <h1 className="text-white text-2xl font-black leading-tight tracking-[-0.02em] mb-2">
          Start Managing Your School Efficiently
        </h1>
        <p className="text-gray-300 text-xs leading-relaxed mb-4">
          Join over 5,000 education leaders who trust SchoolManager to
          streamline operations, track performance, and connect their community.
        </p>
        {/* Testimonial / Social Proof */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/20">
          <div className="flex -space-x-4">
            <img
              className="w-12 h-12 rounded-full border-2 border-[#111318]"
              data-alt="Portrait of a female school principal"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdCjN4RAh1q7xXwdP8rNm-seNhifWg-Vhz2RZhmaUJJV8I4Vqpi5nprK9WkGOV3xwiWWvzTyS9Z-lTOg_hYBQqZHlKtL76J-bGNWn2znQqhkiXEEc_lAtIPbHX83Apg-8QUbxTDlIqZG_kTeBqGU5qDAp9B7KjBUalmaV-uRtNHI9OSGWGT0Yg4_lxTeeiFbOgR6QlpYlJ6S4BiDifv1pBSRBbTO3avB73pvFNTr6-FU9Zn1sUUdWy1i5giv6STYZv1eoVaA6vsm-k"
            />
            <img
              className="w-12 h-12 rounded-full border-2 border-[#111318]"
              data-alt="Portrait of a male department head"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUsMpqftlVB_KLJZPb5Kpmu7P7t4nIKvsGwOsgk9Y9BUEyDKR2ZfRPf7ysBGGpo3FEMtgkBUUjba1ManXwCC06jCBmho7Lr_o3c_Kf-3z9Zeazy4UdaTAwyT-x7gwgo4JD15f8RR3KWcOW56FZqKJ2veZFds9d8NP1pa8TAHSMWg3_HUeUwcB7cMwClfrE10dv3eYEPAE8EoZqdJo9pqgLLk2QzD9o9RDd2ngIbZCGn-Xvks74sMORQWqx4FAVkDKwEVJW1Q-g8jFh"
            />
            <img
              className="w-12 h-12 rounded-full border-2 border-[#111318]"
              data-alt="Portrait of a board member"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAd5flBKZCMC_Lb-pDR91VDuVlWbQ7JR9LNm5p-AruhuKGKqH8IBD9cQxGx8YHv5pi46EJfqOaKOgnJEHtxQPbQfmbZ_K64qRfTK_en5qv1a1Q2mCdFML4lyhO2giF1SDIilsmsd2My4GD9KNQb5w6PmcZov9AmIcmv4xY76ck4Bg89bhgLCkyQm1cN2m2v94lXx4MMKsiNs6QhT1vVtAU5g2qP7HG22hVAoZABy6clHrmSoN_ZwcHbns3ktlv1iui6IiLUJ05QVqs5"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-yellow-400">
              <span className="material-symbols-outlined text-[10px]">
                star
              </span>
              <span className="material-symbols-outlined text-[10px]">
                star
              </span>
              <span className="material-symbols-outlined text-[10px]">
                star
              </span>
              <span className="material-symbols-outlined text-[10px]">
                star
              </span>
              <span className="material-symbols-outlined text-[10px]">
                star
              </span>
            </div>
            <span className="text-xs font-medium text-white">
              Loved by Owners
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
