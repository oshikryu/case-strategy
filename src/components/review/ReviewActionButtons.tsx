'use client'

import { ReviewStatus } from '@/types'
import { Button } from '@/components/ui/Button'

interface ReviewActionButtonsProps {
  onStatusChange: (status: ReviewStatus) => void
  currentStatus: ReviewStatus
  disabled?: boolean
}

export function ReviewActionButtons({
  onStatusChange,
  currentStatus,
  disabled = false,
}: ReviewActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentStatus === 'approved' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('approved')}
        disabled={disabled}
        className={currentStatus === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
      >
        Approve
      </Button>
      <Button
        variant={currentStatus === 'changes_requested' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('changes_requested')}
        disabled={disabled}
        className={currentStatus === 'changes_requested' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
      >
        Request Changes
      </Button>
      <Button
        variant={currentStatus === 'rejected' ? 'danger' : 'outline'}
        size="sm"
        onClick={() => onStatusChange('rejected')}
        disabled={disabled}
      >
        Reject
      </Button>
    </div>
  )
}
