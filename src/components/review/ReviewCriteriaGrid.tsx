'use client'

import { useState } from 'react'
import { CriterionType } from '@/types'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'
import { criteriaDefinitions } from '@/lib/constants/criteria'
import { ReviewCriteriaCard } from './ReviewCriteriaCard'
import { CriterionReviewModal } from './CriterionReviewModal'

export function ReviewCriteriaGrid() {
  const { criteria, review, userRole } = useApplicationStore()
  const [selectedCriterion, setSelectedCriterion] = useState<CriterionType | null>(null)

  const isReviewer = userRole === 'reviewer'

  // Sort by criteria with entries first, then by commonality
  const sortedCriteria = [...criteriaDefinitions].sort((a, b) => {
    const aHasEntries = criteria[a.id].entries.length > 0 ? 0 : 1
    const bHasEntries = criteria[b.id].entries.length > 0 ? 0 : 1
    if (aHasEntries !== bHasEntries) return aHasEntries - bHasEntries
    return a.commonality - b.commonality
  })

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCriteria.map((def) => (
          <ReviewCriteriaCard
            key={def.id}
            criterionType={def.id}
            criterionState={criteria[def.id]}
            criterionReview={review?.criteriaReviews[def.id]}
            isReviewer={isReviewer}
            onClick={() => setSelectedCriterion(def.id)}
          />
        ))}
      </div>

      {selectedCriterion && (
        <CriterionReviewModal
          criterionType={selectedCriterion}
          open={!!selectedCriterion}
          onClose={() => setSelectedCriterion(null)}
        />
      )}
    </>
  )
}
