import type { ErrorComponentProps } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export function ErrorComponent({error ,reset} : ErrorComponentProps) {
    
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center h-screen p-4 text-center bg-background text-foreground"
        >
            <span className="material-symbols-outlined text-6xl text-destructive mb-4">error</span>
            <h1 className="text-3xl font-bold mb-2">An Error Occurred</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                {error.message}
            </p>
            <button
                type="button"
                onClick={() => reset()}
                className="cursor-pointer px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 shadow-sm transition-all active:scale-95"
            >
                Try Again
            </button>
        </motion.div>
    )
}