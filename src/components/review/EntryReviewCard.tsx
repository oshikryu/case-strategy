'use client'

import { CriterionEntry, EntryReview, ReviewStatus } from '@/types'
import { ReviewStatusBadge } from './ReviewStatusBadge'
import { ReviewActionButtons } from './ReviewActionButtons'
import { ReviewCommentInput } from './ReviewCommentInput'
import { useState } from 'react'

interface EntryReviewCardProps {
  entry: CriterionEntry
  entryReview?: EntryReview
  isReviewer: boolean
  onReviewChange?: (entryId: string, status: ReviewStatus, comment?: string) => void
  renderEntryContent: (entry: CriterionEntry) => React.ReactNode
}

export function EntryReviewCard({
  entry,
  entryReview,
  isReviewer,
  onReviewChange,
  renderEntryContent,
}: EntryReviewCardProps) {
  const [comment, setComment] = useState(entryReview?.comment || '')

  const handleStatusChange = (status: ReviewStatus) => {
    onReviewChange?.(entry.id, status, comment)
  }

  const handleCommentChange = (newComment: string) => {
    setComment(newComment)
    if (entryReview?.status && entryReview.status !== 'pending') {
      onReviewChange?.(entry.id, entryReview.status, newComment)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">{renderEntryContent(entry)}</div>
        {entryReview && (
          <ReviewStatusBadge status={entryReview.status} size="sm" />
        )}
      </div>

      {entry.evidence && (entry.evidence.files.length > 0 || entry.evidence.urls.length > 0) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">Evidence:</p>
          <div className="space-y-1">
            {entry.evidence.files.map((file) => (
              <div key={file.id} className="text-xs text-gray-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {file.name}
              </div>
            ))}
            {entry.evidence.urls.map((url) => (
              <div key={url.id} className="text-xs text-blue-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <a href={url.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                  {url.description || url.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {isReviewer ? (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
          <ReviewActionButtons
            onStatusChange={handleStatusChange}
            currentStatus={entryReview?.status || 'pending'}
          />
          <ReviewCommentInput
            value={comment}
            onChange={handleCommentChange}
            placeholder="Add feedback for this entry..."
          />
        </div>
      ) : (
        entryReview?.comment && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 mb-1">Reviewer Comment:</p>
            <p className="text-sm text-gray-700">{entryReview.comment}</p>
          </div>
        )
      )}
    </div>
  )
}
