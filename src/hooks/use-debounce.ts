import { useEffect, useState } from "react"


export function useDebounce<T>(value: T, delay = 1500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [delay, value])

  return debouncedValue
}

export default useDebounce
