import Lottie from 'lottie-react'
import loading from '../assets/animation/sandy_loading.json'
import { cn } from '../lib/utils'

export type LoadingProps = {
  className?: string
  text?: string
  description?: string
}

export default function Loading({
  className,
  text = 'Loading...',
  description = 'Please wait while we fetch the data for you.',
}: LoadingProps) {


  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-2 bg-background-light dark:bg-background-dark',
        className,
      )}
    >
      <Lottie animationData={loading} loop={true} className="h-32 w-32" />
      {text ? (
        <h2 className="text-center text-lg font-semibold text-black dark:text-white">{text}</h2>
      ) : null}
      {description ? (
        <p className="max-w-sm text-center text-muted-foreground text-gray-600 dark:text-gray-400">
          {description}
        </p>
      ) : null}
    </div>
  )
}
