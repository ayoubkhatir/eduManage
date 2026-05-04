import type { ErrorComponentProps } from '@tanstack/react-router'




export function ErrorComponent({error ,reset} : ErrorComponentProps) {
    
    return (
        <div className="flex flex-col items-center justify-center h-screen p-4 text-center bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-gray-100">
            <h1 className="text-4xl font-bold mb-4">An Error Occurred</h1>
            <p className="text-lg mb-6">
                {error.message}
            </p>
            <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            >
                Try Again
            </button>
        </div>
    )
}