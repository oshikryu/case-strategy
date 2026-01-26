'use client'

import { cn } from '@/lib/utils'
import { CriterionRecommendation } from '@/types'
import { getCriterionDefinition } from '@/lib/constants'

export interface RecommendationCardProps {
  recommendation: CriterionRecommendation
  rank?: number
}

const getScoreColor = (score: number): string => {
  if (score >= 60) return 'text-green-600'
  if (score >= 30) return 'text-yellow-600'
  return 'text-gray-400'
}

const getScoreBackground = (score: number): string => {
  if (score >= 60) return 'bg-green-50 border-green-200'
  if (score >= 30) return 'bg-yellow-50 border-yellow-200'
  return 'bg-gray-50 border-gray-200'
}

const getScoreLabel = (score: number): string => {
  if (score >= 60) return 'Strong Match'
  if (score >= 30) return 'Potential Match'
  return 'Weak Match'
}

export function RecommendationCard({ recommendation, rank }: RecommendationCardProps) {
  const definition = getCriterionDefinition(recommendation.criterionType)
  const scoreColor = getScoreColor(recommendation.score)
  const scoreBackground = getScoreBackground(recommendation.score)
  const scoreLabel = getScoreLabel(recommendation.score)

  if (!definition) return null

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-5 transition-all',
        scoreBackground
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          {rank !== undefined && (
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mr-2">
              {rank}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900">{definition.title}</h3>
        </div>
        <div className="text-right">
          <div className={cn('text-2xl font-bold', scoreColor)}>
            {recommendation.score}
          </div>
          <div className={cn('text-xs', scoreColor)}>{scoreLabel}</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{definition.shortDescription}</p>

      {recommendation.reasoning && recommendation.score > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Why this criterion:</h4>
          <p className="text-sm text-gray-600">{recommendation.reasoning}</p>
        </div>
      )}

      {recommendation.suggestedEvidence.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Suggested evidence:</h4>
          <ul className="space-y-1">
            {recommendation.suggestedEvidence.map((evidence, index) => (
              <li key={index} className="flex items-start text-sm text-gray-600">
                <svg
                  className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {evidence}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
