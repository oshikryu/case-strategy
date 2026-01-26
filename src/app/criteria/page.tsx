'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBreadcrumb } from '@/components/criteria/ProgressBreadcrumb'
import { CriteriaGrid } from '@/components/criteria/CriteriaGrid'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'

export default function CriteriaPage() {
  const router = useRouter()
  const { demographics, getCompletedCriteriaCount } = useApplicationStore()
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
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
        </div>

        <CriteriaGrid />
      </div>
    </div>
  )
}
