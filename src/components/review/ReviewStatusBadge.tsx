'use client'

import { ReviewStatus } from '@/types'
import { cn } from '@/lib/utils'

interface ReviewStatusBadgeProps {
  status: ReviewStatus
  size?: 'sm' | 'md'
}

const statusConfig: Record<ReviewStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-700',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800',
  },
  changes_requested: {
    label: 'Changes Requested',
    className: 'bg-yellow-100 text-yellow-800',
  },
}

export function ReviewStatusBadge({ status, size = 'md' }: ReviewStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-sm'
      )}
    >
      {config.label}
    </span>
  )
}
