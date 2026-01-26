'use client'

import { useApplicationStore } from '@/lib/stores/useApplicationStore'

export function ReviewSummary() {
  const { getReviewSummary, review } = useApplicationStore()

  if (!review) return null

  const summary = getReviewSummary()
  const total = summary.approved + summary.rejected + summary.pending + summary.changesRequested

  const approvedPercent = total > 0 ? (summary.approved / total) * 100 : 0
  const rejectedPercent = total > 0 ? (summary.rejected / total) * 100 : 0
  const changesPercent = total > 0 ? (summary.changesRequested / total) * 100 : 0

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Review Progress</h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          {summary.approved} of {total} criteria approved
        </span>
        {summary.approved >= 3 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Minimum Met
          </span>
        )}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div className="h-full flex">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{ width: `${approvedPercent}%` }}
          />
          <div
            className="bg-red-500 h-full transition-all duration-300"
            style={{ width: `${rejectedPercent}%` }}
          />
          <div
            className="bg-yellow-500 h-full transition-all duration-300"
            style={{ width: `${changesPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Approved: {summary.approved}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Rejected: {summary.rejected}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          Changes: {summary.changesRequested}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          Pending: {summary.pending}
        </span>
      </div>
    </div>
  )
}
