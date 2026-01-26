'use client'

import { useState } from 'react'
import { CriteriaCard } from './CriteriaCard'
import { criteriaDefinitions } from '@/lib/constants'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'
import { CriterionType } from '@/types'
import { getRecommendationScore } from '@/lib/utils'

// Import all modals
import { AwardsModal } from './modals/AwardsModal'
import { MembershipModal } from './modals/MembershipModal'
import { PublishedMaterialModal } from './modals/PublishedMaterialModal'
import { JudgingModal } from './modals/JudgingModal'
import { ContributionsModal } from './modals/ContributionsModal'
import { AuthorshipModal } from './modals/AuthorshipModal'
import { CriticalEmploymentModal } from './modals/CriticalEmploymentModal'
import { RemunerationModal } from './modals/RemunerationModal'

const modalComponents: Record<CriterionType, React.ComponentType<{ open: boolean; onOpenChange: (open: boolean) => void }>> = {
  awards: AwardsModal,
  membership: MembershipModal,
  publishedMaterial: PublishedMaterialModal,
  judging: JudgingModal,
  contributions: ContributionsModal,
  authorship: AuthorshipModal,
  criticalEmployment: CriticalEmploymentModal,
  remuneration: RemunerationModal,
}

export function CriteriaGrid() {
  const { criteria, recommendations } = useApplicationStore()
  const [openModal, setOpenModal] = useState<CriterionType | null>(null)

  const handleCardClick = (criterionId: CriterionType) => {
    setOpenModal(criterionId)
  }

  const handleModalClose = () => {
    setOpenModal(null)
  }

  // Sort by commonality (most commonly accepted first)
  const sortedCriteria = [...criteriaDefinitions].sort(
    (a, b) => a.commonality - b.commonality
  )

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedCriteria.map((criterion) => (
          <CriteriaCard
            key={criterion.id}
            criterion={criterion}
            state={criteria[criterion.id]}
            onClick={() => handleCardClick(criterion.id)}
            recommendationScore={getRecommendationScore(recommendations, criterion.id)}
          />
        ))}
      </div>

      {/* Render modals */}
      {sortedCriteria.map((criterion) => {
        const ModalComponent = modalComponents[criterion.id]
        return (
          <ModalComponent
            key={criterion.id}
            open={openModal === criterion.id}
            onOpenChange={(open) => {
              if (!open) handleModalClose()
            }}
          />
        )
      })}
    </>
  )
}
