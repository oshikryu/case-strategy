'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'
import {
  StepIndicator,
  RecommendationsIntro,
  EmploymentHistoryForm,
  EducationHistoryForm,
  FamilyConnectionsForm,
  RecommendationResults,
} from '@/components/recommendations'

type Step = 'intro' | 'employment' | 'education' | 'family' | 'results'

const stepOrder: Step[] = ['intro', 'employment', 'education', 'family', 'results']
const stepLabels = ['Intro', 'Employment', 'Education', 'Family', 'Results']

export default function RecommendationsPage() {
  const router = useRouter()
  const { demographics, intake } = useApplicationStore()
  const [mounted, setMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('intro')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !demographics) {
      router.push('/')
    }
  }, [mounted, demographics, router])

  // If user has already completed intake, start at results
  useEffect(() => {
    if (mounted && intake?.completedAt) {
      setCurrentStep('results')
    }
  }, [mounted, intake])

  if (!mounted || !demographics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  const currentStepIndex = stepOrder.indexOf(currentStep)

  const goToNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex])
    }
  }

  const goToPrevious = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex])
    }
  }

  const handleIntroComplete = () => {
    setCurrentStep('employment')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return <RecommendationsIntro onContinue={handleIntroComplete} />
      case 'employment':
        return <EmploymentHistoryForm onNext={goToNext} onBack={goToPrevious} />
      case 'education':
        return <EducationHistoryForm onNext={goToNext} onBack={goToPrevious} />
      case 'family':
        return <FamilyConnectionsForm onNext={goToNext} onBack={goToPrevious} />
      case 'results':
        return <RecommendationResults onBack={goToPrevious} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Only show step indicator for form steps, not intro */}
        {currentStep !== 'intro' && (
          <div className="mb-8">
            <StepIndicator
              currentStep={stepOrder.indexOf(currentStep)}
              totalSteps={stepOrder.length - 1}
              labels={stepLabels.slice(1)}
            />
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  )
}
