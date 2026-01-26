'use client'

import { DemographicForm } from '@/components/landing/DemographicForm'

export default function LandingPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Extraordinary Ability Journey Starts Here
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The O-1A visa is for individuals with extraordinary ability in sciences,
            education, business, or athletics. Let us help you organize your evidence
            and build a compelling case.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h2 className="text-sm font-semibold text-blue-800 mb-2">About the O-1A Visa</h2>
            <p className="text-sm text-blue-700">
              To qualify, you must demonstrate extraordinary ability through sustained
              national or international acclaim. USCIS requires evidence meeting at least
              3 of 8 criteria, or a one-time major achievement.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Let&apos;s Get Started
          </h2>
          <DemographicForm />
        </div>
      </div>
    </div>
  )
}
