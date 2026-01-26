'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'
import { generateRecommendations } from '@/lib/utils'
import { RecommendationCard } from './RecommendationCard'
import { useEffect, useState, useMemo } from 'react'
import { RecommendationResult } from '@/types'

export interface RecommendationResultsProps {
  onBack: () => void
}

export function RecommendationResults({ onBack }: RecommendationResultsProps) {
  const router = useRouter()
  const { intake, setRecommendations } = useApplicationStore()
  const [showLoading, setShowLoading] = useState(true)

  // Generate recommendations synchronously based on current intake
  const currentRecommendations = useMemo<RecommendationResult>(() => {
    const intakeData = intake || {
      wantsRecommendations: true,
      employmentHistory: [],
      educationHistory: [],
      familyConnections: [],
    }
    return generateRecommendations(intakeData)
  }, [intake])

  // Store recommendations and show loading briefly for UX
  useEffect(() => {
    setRecommendations(currentRecommendations)

    // Brief loading state for visual feedback
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [currentRecommendations, setRecommendations])

  const handleContinue = () => {
    router.push('/criteria')
  }

  if (showLoading) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Analyzing your profile...</h2>
        <p className="text-gray-600 mt-2">Generating personalized recommendations</p>
      </div>
    )
  }

  const topRecommendations = currentRecommendations.recommendedCriteria.filter(r => r.score >= 30)
  const otherCriteria = currentRecommendations.recommendedCriteria.filter(r => r.score < 30)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Recommendations</h2>
        <p className="text-gray-600">
          Based on your background, here are the criteria we recommend focusing on.
        </p>
      </div>

      {/* Primary Strengths */}
      {currentRecommendations.primaryStrengths.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">Your Primary Strengths</h3>
          <ul className="space-y-2">
            {currentRecommendations.primaryStrengths.map((strength, index) => (
              <li key={index} className="flex items-start text-blue-800">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Recommendations */}
      {topRecommendations.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recommended Criteria ({topRecommendations.length})
          </h3>
          <div className="space-y-4">
            {topRecommendations.map((rec, index) => (
              <RecommendationCard
                key={rec.criterionType}
                recommendation={rec}
                rank={index + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Criteria */}
      {otherCriteria.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Other Criteria to Consider
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            These criteria may still be applicable with additional evidence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherCriteria.map((rec) => (
              <RecommendationCard key={rec.criterionType} recommendation={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h3>
        <p className="text-gray-600 mb-4">
          On the next page, you&apos;ll be able to add detailed evidence for each criterion.
          We&apos;ll highlight your recommended criteria to help you focus your efforts.
          Remember: you need to meet at least 3 of the 8 criteria for O-1A approval.
        </p>
        <p className="text-sm text-gray-500">
          You can still add evidence for any criterion, even those not recommended.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button size="lg" onClick={handleContinue}>
          Continue to Evidence Collection
        </Button>
      </div>
    </div>
  )
}
