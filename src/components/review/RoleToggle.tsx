'use client'

import { UserRole } from '@/types'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'

export function RoleToggle() {
  const { userRole, setUserRole } = useApplicationStore()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">View as:</span>
      <select
        value={userRole}
        onChange={(e) => setUserRole(e.target.value as UserRole)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="applicant">Applicant</option>
        <option value="reviewer">Reviewer</option>
      </select>
    </div>
  )
}
