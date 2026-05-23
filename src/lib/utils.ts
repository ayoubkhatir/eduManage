import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
}

export function stripHtmlTags(html: string): string {
  if (!html) return ''
  // Remove all HTML tags and decode HTML entities
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}
