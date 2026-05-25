import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import useDebounce from '@/hooks/use-debounce'
import { cn } from '../../lib/utils';

type props = {
  value: string
  placeholder?: string
  onSearch: (value: string) => void
  className?: string  
}

export function SearchInput({
  value = '',
  onSearch,
  placeholder = 'Search',
  className
}: props) {
  //   const { search } = Route.useSearch()
  const [searchKeywords, setSearchKeywords] = useState(value)
  const debouncedSearchKeywords = useDebounce(searchKeywords, 500)

  //   const navigate = Route.useNavigate()

  useEffect(() => {
    onSearch(debouncedSearchKeywords)
  }, [debouncedSearchKeywords])

  return (
    <Input
      className={cn( "w-full pl-10 h-10 rounded-lg border-slate-200 bg-white text-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20", className)}
      value={searchKeywords}
      onChange={(e) => setSearchKeywords(e.target.value)}
      placeholder={placeholder}
    />
  )
}
