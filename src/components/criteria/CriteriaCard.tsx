'use client'

import { cn } from '@/lib/utils'
import { CriterionDefinition } from '@/lib/constants'
import { CriterionState } from '@/types'

export interface CriteriaCardProps {
  criterion: CriterionDefinition
  state: CriterionState
  onClick: () => void
}

export function CriteriaCard({ criterion, state, onClick }: CriteriaCardProps) {
  const { entries, isComplete, isDraft } = state

  const getStatusBadge = () => {
    if (isComplete) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <svg
            className="w-3 h-3 mr-1"
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
          Completed
        </span>
      )
    }
    if (isDraft || entries.length > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Draft ({entries.length} {entries.length === 1 ? 'entry' : 'entries'})
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        Not Started
      </span>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-5 rounded-xl border-2 transition-all duration-200',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        isComplete
          ? 'border-green-200 bg-green-50 hover:border-green-300'
          : isDraft || entries.length > 0
          ? 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
          : 'border-gray-200 bg-white hover:border-blue-300'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{criterion.title}</h3>
        {getStatusBadge()}
      </div>
      <p className="text-sm text-gray-600 mb-3">{criterion.shortDescription}</p>
      <div className="flex items-center text-xs text-gray-500">
        <span>Click to {entries.length > 0 ? 'edit' : 'add'} evidence</span>
        <svg
          className="w-4 h-4 ml-1"
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
      </div>
    </button>
  )
}
