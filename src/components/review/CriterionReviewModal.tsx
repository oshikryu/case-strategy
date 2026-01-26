'use client'

import { useState, useEffect } from 'react'
import { CriterionType, CriterionEntry, ReviewStatus } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'
import { getCriterionDefinition } from '@/lib/constants/criteria'
import { ReviewStatusBadge } from './ReviewStatusBadge'
import { ReviewActionButtons } from './ReviewActionButtons'
import { ReviewCommentInput } from './ReviewCommentInput'
import { EntryReviewCard } from './EntryReviewCard'

interface CriterionReviewModalProps {
  criterionType: CriterionType
  open: boolean
  onClose: () => void
}

export function CriterionReviewModal({
  criterionType,
  open,
  onClose,
}: CriterionReviewModalProps) {
  const {
    criteria,
    review,
    userRole,
    setCriterionReviewStatus,
    setEntryReviewStatus,
  } = useApplicationStore()

  const definition = getCriterionDefinition(criterionType)
  const criterionState = criteria[criterionType]
  const criterionReview = review?.criteriaReviews[criterionType]

  const [overallComment, setOverallComment] = useState(criterionReview?.overallComment || '')

  useEffect(() => {
    setOverallComment(criterionReview?.overallComment || '')
  }, [criterionReview?.overallComment])

  if (!definition) return null

  const isReviewer = userRole === 'reviewer'

  const handleOverallStatusChange = (status: ReviewStatus) => {
    setCriterionReviewStatus(criterionType, status, overallComment)
  }

  const handleOverallCommentChange = (comment: string) => {
    setOverallComment(comment)
    if (criterionReview?.status && criterionReview.status !== 'pending') {
      setCriterionReviewStatus(criterionType, criterionReview.status, comment)
    }
  }

  const handleEntryReviewChange = (entryId: string, status: ReviewStatus, comment?: string) => {
    setEntryReviewStatus(criterionType, entryId, status, comment)
  }

  const renderEntryContent = (entry: CriterionEntry) => {
    // Render based on criterion type
    if ('name' in entry && 'organization' in entry && 'scope' in entry) {
      // AwardEntry
      return (
        <div>
          <h4 className="font-medium text-gray-900">{entry.name}</h4>
          <p className="text-sm text-gray-600">{entry.organization}</p>
          <p className="text-xs text-gray-500 mt-1">
            Scope: {entry.scope} | Date: {entry.date}
          </p>
          {entry.description && (
            <p className="text-sm text-gray-600 mt-2">{entry.description}</p>
          )}
        </div>
      )
    }

    if ('organization' in entry && 'requirements' in entry && 'status' in entry) {
      // MembershipEntry
      return (
        <div>
          <h4 className="font-medium text-gray-900">{entry.organization}</h4>
          <p className="text-sm text-gray-600">Status: {entry.status}</p>
          <p className="text-xs text-gray-500 mt-1">Requirements: {entry.requirements}</p>
        </div>
      )
    }

    if ('publication' in entry && 'circulation' in entry) {
      // PublishedMaterialEntry
      return (
        <div>
          <h4 className="font-medium text-gray-900">{entry.title}</h4>
          <p className="text-sm text-gray-600">{entry.publication}</p>
          <p className="text-xs text-gray-500 mt-1">Circulation: {entry.circulation}</p>
        </div>
      )
    }

    if ('submissionsCount' in entry && 'context' in entry) {
      // JudgingEntry
      return (
        <div>
          <h4 className="font-medium text-gray-900">{entry.role}</h4>
          <p className="text-sm text-gray-600">{entry.organization}</p>
          <p className="text-xs text-gray-500 mt-1">
            {entry.submissionsCount} submissions reviewed
          </p>
        </div>
      )
    }

    if ('impact' in entry && 'recognition' in entry) {
      // ContributionEntry
      return (
        <div>
          <h4 className="font-medium text-gray-900">{entry.title}</h4>
          <p className="text-sm text-gray-600">{entry.description}</p>
          <p className="text-xs text-gray-500 mt-1">Impact: {entry.impact}</p>
        </div>
      )
    }

    if ('citations' in entry || 'doi' in entry) {
      // AuthorshipEntry
      const authorship = entry as { title: string; publication: string; citations?: number; coauthors?: string }
      return (
        <div>
          <h4 className="font-medium text-gray-900">{authorship.title}</h4>
          <p className="text-sm text-gray-600">{authorship.publication}</p>
          {authorship.citations && (
            <p className="text-xs text-gray-500 mt-1">{authorship.citations} citations</p>
          )}
        </div>
      )
    }

    if ('criticalNature' in entry && 'responsibilities' in entry) {
      // CriticalEmploymentEntry
      return (
        <div>
          <h4 className="font-medium text-gray-900">{entry.role}</h4>
          <p className="text-sm text-gray-600">{entry.company}</p>
          <p className="text-xs text-gray-500 mt-1">{entry.criticalNature}</p>
        </div>
      )
    }

    if ('salary' in entry && 'comparativeData' in entry) {
      // RemunerationEntry
      const remuneration = entry as { position: string; company: string; workLocation: string; currency: string; salary: number; year: number }
      return (
        <div>
          <h4 className="font-medium text-gray-900">{remuneration.position}</h4>
          <p className="text-sm text-gray-600">{remuneration.company}</p>
          {remuneration.workLocation && (
            <p className="text-xs text-gray-500">{remuneration.workLocation}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {remuneration.currency} {remuneration.salary.toLocaleString()} ({remuneration.year})
          </p>
        </div>
      )
    }

    // Fallback
    return (
      <div>
        <h4 className="font-medium text-gray-900">Entry</h4>
        <p className="text-sm text-gray-600">ID: {entry.id}</p>
      </div>
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      title={definition.title}
      description={definition.shortDescription}
      className="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Overall status section */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Overall Status</h3>
            {criterionReview && (
              <ReviewStatusBadge status={criterionReview.status} />
            )}
          </div>

          {isReviewer ? (
            <div className="space-y-3">
              <ReviewActionButtons
                onStatusChange={handleOverallStatusChange}
                currentStatus={criterionReview?.status || 'pending'}
              />
              <ReviewCommentInput
                value={overallComment}
                onChange={handleOverallCommentChange}
                placeholder="Add overall feedback for this criterion..."
              />
            </div>
          ) : (
            criterionReview?.overallComment && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Reviewer Comment:</p>
                <p className="text-sm text-gray-600">{criterionReview.overallComment}</p>
              </div>
            )
          )}
        </div>

        {/* Entries section */}
        <div>
          <h3 className="font-medium text-gray-900 mb-3">
            Entries ({criterionState.entries.length})
          </h3>
          <div className="space-y-4">
            {criterionState.entries.map((entry) => {
              const entryReview = criterionReview?.entryReviews.find(
                (er) => er.entryId === entry.id
              )
              return (
                <EntryReviewCard
                  key={entry.id}
                  entry={entry}
                  entryReview={entryReview}
                  isReviewer={isReviewer}
                  onReviewChange={handleEntryReviewChange}
                  renderEntryContent={renderEntryContent}
                />
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
