import * as React from "react"
import {  cva } from "class-variance-authority"
import{ AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type {VariantProps} from "class-variance-authority";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

function AnimatedAlert({state ,type,message} : {state: boolean; type: "error" | "success" | "warning" ;  message : string} ) {
  const reduceMotion = useReducedMotion();
  return<AnimatePresence>
        {state && (
          <motion.div
            
            initial={
                reduceMotion
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: -12, scale: 0.98 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 1, y: 0, scale: 1.02 }
              }
              exit={
                reduceMotion
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: -12, scale: 0.98 }
              }
              transition={{
                opacity: { duration: 1 },
                y: reduceMotion
                  ? { duration: 0.2 }
                  : { type: 'spring', stiffness: 600, damping: 28, mass: 0.4 },
                scale: reduceMotion
                  ? { duration: 0.2 }
                  : { type: 'spring', stiffness: 800, damping: 32, mass: 0.35 },
              }}
          >
          
            <Alert
              className={
                type === 'error'
                  ? 'bg-red-600 text-white border-red-700'
                  : 'bg-emerald-600 text-white border-emerald-700'
                
              }
              variant={type === 'error' ? 'destructive' : 'default'}
            >
              <AlertTitle>
                {type === 'error' ? 'Error' : 'Success'}
              </AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          
        </motion.div>
        )}
        </AnimatePresence>
}

export { Alert, AlertTitle, AlertDescription , AnimatedAlert }
