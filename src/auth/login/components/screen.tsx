
export default function Screen() {
  return (<div className="relative hidden w-0 flex-1 lg:block bg-background-light">
          <img
            alt="Modern university administration building interior with clean architecture"
            className="absolute inset-0 h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1A0CvbKfTRRTzJRkPa3i7CTsp9HO4hqPvB9ypd42nh19Z12dgK3p44ula8kl1aQ5WSV8qOaO9jIiKugVZhrk4uT0o2y3kIKhXOLah_-QJKvE6CzZOKUi8gIr37UGXeWbTYq1rOpjeR0StbcXBHs7kytH-CDJ6dEYJyLbOqh9l6azbyuwrp9s561X51B4gKUzIhmJIyhMuVObjFE2v0NUEAoseBrGDT4G5a41VDYehI2cHcBWHvK4MDg-DyhKXu5DeiN6J8I1KJTrz"
          />
          <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/60 to-transparent opacity-90"></div>
          <div className="absolute bottom-0 left-0 right-0 p-16 xl:p-24 text-white">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <span
                  className="material-symbols-outlined text-white"
                  style={{ fontSize: 18 }}
                >
                  verified_user
                </span>
                <span className="text-xs font-bold tracking-widest uppercase">
                  Trusted by 500+ Schools
                </span>
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tight mb-8 leading-tight">
                Empowering Education Leaders Worldwide
              </h2>
              <blockquote className="relative border-l-4 border-white/40 pl-6 py-2">
                <p className="text-xl font-light italic opacity-95 leading-relaxed">
                  "The most comprehensive platform we've used. It completely
                  transformed how we manage our campuses and engage with
                  parents."
                </p>
                <footer className="mt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                    S
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-base">
                      Sarah J. Collins
                    </span>
                    <span className="text-sm opacity-80">
                      Director of Education, Westview Academy
                    </span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>)
}
