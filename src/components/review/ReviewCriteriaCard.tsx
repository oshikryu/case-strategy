'use client'

import { CriterionType, CriterionReview, CriterionState } from '@/types'
import { ReviewStatusBadge } from './ReviewStatusBadge'
import { getCriterionDefinition } from '@/lib/constants/criteria'
import { cn } from '@/lib/utils'

interface ReviewCriteriaCardProps {
  criterionType: CriterionType
  criterionState: CriterionState
  criterionReview?: CriterionReview
  isReviewer: boolean
  onClick: () => void
}

export function ReviewCriteriaCard({
  criterionType,
  criterionState,
  criterionReview,
  isReviewer,
  onClick,
}: ReviewCriteriaCardProps) {
  const definition = getCriterionDefinition(criterionType)
  if (!definition) return null

  const entryCount = criterionState.entries.length
  const hasEntries = entryCount > 0
  const status = criterionReview?.status || 'pending'

  return (
    <button
      onClick={onClick}
      disabled={!hasEntries}
      className={cn(
        'w-full text-left p-4 rounded-lg border transition-all',
        hasEntries
          ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm cursor-pointer'
          : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{definition.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{definition.shortDescription}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {hasEntries && <ReviewStatusBadge status={status} size="sm" />}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
        </span>
        {criterionReview?.overallComment && !isReviewer && (
          <span className="text-xs text-blue-600">Has feedback</span>
        )}
      </div>

      {!hasEntries && (
        <p className="mt-2 text-xs text-gray-400 italic">No entries to review</p>
      )}
    </button>
  )
}
