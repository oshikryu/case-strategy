'use client'

import { cn } from '@/lib/utils'

interface HelpIconProps {
  className?: string
}

export function HelpIcon({ className }: HelpIconProps) {
  return (
    <svg
      className={cn('w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
      />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" />
    </svg>
  )
}
