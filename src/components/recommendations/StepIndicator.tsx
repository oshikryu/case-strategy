'use client'

import { cn } from '@/lib/utils'

export interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

const defaultLabels = ['Employment', 'Education', 'Family', 'Results']

export function StepIndicator({
  currentStep,
  totalSteps,
  labels = defaultLabels,
}: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4"
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
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    'mt-1 text-xs',
                    isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'
                  )}
                >
                  {labels[index] || `Step ${stepNumber}`}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-2',
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
