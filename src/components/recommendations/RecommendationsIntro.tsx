'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'

export interface RecommendationsIntroProps {
  onContinue: () => void
}

export function RecommendationsIntro({ onContinue }: RecommendationsIntroProps) {
  const router = useRouter()
  const { skipRecommendations } = useApplicationStore()

  const handleSkip = () => {
    skipRecommendations()
    router.push('/criteria')
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Get Personalized Recommendations
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Share your background and we&apos;ll recommend which O-1A criteria are best suited for your profile.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">We&apos;ll ask about:</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <span className="font-medium text-gray-900">Employment History</span>
              <p className="text-sm text-gray-600">Your roles, companies, and achievements</p>
            </div>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
            <div>
              <span className="font-medium text-gray-900">Education History</span>
              <p className="text-sm text-gray-600">Degrees, publications, and research</p>
            </div>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div>
              <span className="font-medium text-gray-900">Family Connections</span>
              <p className="text-sm text-gray-600">Professional network who can support your case</p>
            </div>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" size="lg" onClick={handleSkip}>
          Skip for Now
        </Button>
        <Button size="lg" onClick={onContinue}>
          Get Recommendations
        </Button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        All information stays on your device and is not sent to any server.
      </p>
    </div>
  )
}
