'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBreadcrumb } from '@/components/criteria/ProgressBreadcrumb'
import { CriteriaGrid } from '@/components/criteria/CriteriaGrid'
import { Button } from '@/components/ui/Button'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'

export default function CriteriaPage() {
  const router = useRouter()
  const {
    demographics,
    getCompletedCriteriaCount,
    canProceedToReview,
    submitForReview,
    applicationSubmittedForReview,
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

  if (!mounted || !demographics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const completedCount = getCompletedCriteriaCount()
  const minimumMet = completedCount >= 3
  const hasPassportPhoto = !!demographics.passportImage
  const canSubmit = canProceedToReview() && !applicationSubmittedForReview && hasPassportPhoto

  const handleSubmitForReview = () => {
    submitForReview()
    router.push('/review')
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <ProgressBreadcrumb currentStep="criteria" completedCriteria={completedCount} />

        <div className="mt-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            O-1A Criteria Evidence
          </h1>
          <p className="text-gray-600">
            Document your achievements across the 8 O-1A criteria. You need to meet at least 3 criteria.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedCount} of 8 criteria completed
            </span>
            {minimumMet && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Minimum Met
              </span>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-300 ${
                minimumMet ? 'bg-green-500' : 'bg-blue-600'
              }`}
              style={{ width: `${(completedCount / 8) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {minimumMet
              ? 'Great work! You have met the minimum requirement. Adding more criteria strengthens your case.'
              : `Complete ${3 - completedCount} more criteria to meet the minimum requirement.`
            }
          </p>

          {minimumMet && (
            <div className="mt-4">
              <div className="flex items-center gap-4">
                {applicationSubmittedForReview ? (
                  <Button
                    onClick={() => router.push('/review')}
                    variant="secondary"
                  >
                    View Review Status
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmitForReview}
                    disabled={!canSubmit}
                  >
                    Submit for Review
                  </Button>
                )}
              </div>
              {!applicationSubmittedForReview && !hasPassportPhoto && (
                <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Please upload your passport photo on the Demographics page before submitting for review.
                </p>
              )}
            </div>
          )}
        </div>

        <CriteriaGrid />
      </div>
    </div>
  )
}
