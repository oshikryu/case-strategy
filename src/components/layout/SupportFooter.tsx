'use client'

import { useApplicationStore } from '@/lib/stores/useApplicationStore'

const SUPPORT_EMAIL = 'support@example.com'

export function SupportFooter() {
  const { demographics } = useApplicationStore()

  const handleSupportClick = () => {
    const subject = encodeURIComponent('O-1A Visa Application Support Request')

    let body = 'Hello,\n\nI need assistance with my O-1A visa application.\n\n'
    body += '--- Applicant Information ---\n'

    if (demographics) {
      const fullName = [demographics.firstName, demographics.middleName, demographics.lastName]
        .filter(Boolean)
        .join(' ')
      body += `Name: ${fullName}\n`
      body += `Country of Birth: ${demographics.countryOfBirth}\n`
      body += `Current Location: ${demographics.city}${demographics.stateOrRegion ? `, ${demographics.stateOrRegion}` : ''}, ${demographics.country}\n`
      body += `Current Visa Type: ${demographics.currentVisaType}\n`
    } else {
      body += 'No demographic information provided yet.\n'
    }

    body += '\n--- Issue Description ---\n'
    body += '[Please describe your issue here]\n'

    const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-gray-500">
            O-1A Visa Application Assistant
          </p>
          <button
            onClick={handleSupportClick}
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Need Help? Contact Support
          </button>
        </div>
      </div>
    </footer>
  )
}
