'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'
import { ProgressBreadcrumb } from '@/components/criteria/ProgressBreadcrumb'
import { RoleToggle, ReviewSummary, ReviewCriteriaGrid } from '@/components/review'

export default function ReviewPage() {
  const router = useRouter()
  const {
    demographics,
    applicationSubmittedForReview,
    getCompletedCriteriaCount,
    userRole,
  } = useApplicationStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !demographics) {
      router.push('/')
    }
  }, [mounted, demographics, router])

  useEffect(() => {
    if (mounted && demographics && !applicationSubmittedForReview) {
      router.push('/criteria')
    }
  }, [mounted, demographics, applicationSubmittedForReview, router])

  if (!mounted || !demographics || !applicationSubmittedForReview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const completedCount = getCompletedCriteriaCount()
  const isReviewer = userRole === 'reviewer'

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <ProgressBreadcrumb currentStep="review" completedCriteria={completedCount} />
          <RoleToggle />
        </div>

        <div className="mt-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isReviewer ? 'Review Application' : 'Application Review Status'}
          </h1>
          <p className="text-gray-600">
            {isReviewer
              ? 'Review each criterion and provide feedback. Approve, reject, or request changes for each item.'
              : 'View the status of your application review. Click on a criterion to see detailed feedback.'}
          </p>
        </div>

        <div className="mb-8">
          <ReviewSummary />
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Criteria</h2>
          <ReviewCriteriaGrid />
        </div>
      </div>
    </div>
  )
}
