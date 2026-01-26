'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface ProgressBreadcrumbProps {
  currentStep: 'demographics' | 'criteria' | 'review'
  completedCriteria: number
}

const steps = [
  { id: 'demographics', label: 'Demographics', href: '/' },
  { id: 'criteria', label: 'Criteria', href: '/criteria' },
  { id: 'review', label: 'Review', href: '/review' },
]

export function ProgressBreadcrumb({
  currentStep,
  completedCriteria,
}: ProgressBreadcrumbProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = step.id === currentStep
        const isClickable = index <= currentIndex

        return (
          <div key={step.id} className="flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 mx-2 text-gray-400"
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
            )}
            {isClickable ? (
              <Link
                href={step.href}
                className={cn(
                  'flex items-center',
                  isCurrent
                    ? 'text-blue-600 font-medium'
                    : isCompleted
                    ? 'text-gray-900 hover:text-blue-600'
                    : 'text-gray-500'
                )}
              >
                {isCompleted && (
                  <svg
                    className="w-4 h-4 mr-1 text-green-500"
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
                )}
                {step.label}
                {step.id === 'criteria' && (
                  <span className="ml-1 text-gray-400">
                    ({completedCriteria}/3)
                  </span>
                )}
              </Link>
            ) : (
              <span className="text-gray-400 cursor-not-allowed">
                {step.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
