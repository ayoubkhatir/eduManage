import { Link, useNavigate, useRouter } from '@tanstack/react-router'


export function NotFound( ) {
  const navigate = useNavigate()
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">
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
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Go Back
        </button>
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
