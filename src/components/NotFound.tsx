import { Link, useNavigate, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export function NotFound( ) {
  const navigate = useNavigate()
  const router = useRouter()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center h-screen p-4 text-center bg-background text-foreground"
    >
      <span className="material-symbols-outlined text-7xl text-muted-foreground/30 mb-4">error_outline</span>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl font-semibold mb-2">Page Not Found</p>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for does not exist.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (router.history.length > 1) {
              router.history.back()
              return
            }
            navigate({ to: '/' })
          }}
          className="cursor-pointer px-5 py-2.5 border border-border text-foreground rounded-xl hover:bg-accent transition-all active:scale-95"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-sm transition-all active:scale-95"
        >
          Go Home
        </Link>
      </div>
    </motion.div>
  )
}
