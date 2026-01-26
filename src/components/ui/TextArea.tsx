'use client'

import { forwardRef, TextareaHTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'
import { HelpTooltip } from './HelpTooltip'
import { ContextualAnalysisResult } from '@/lib/services/contextualAnalysis'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  leadingQuestions?: string[]
  onAnalyze?: (value: string) => Promise<ContextualAnalysisResult | void> | void
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, leadingQuestions, onAnalyze, id, onBlur, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const [analysisResult, setAnalysisResult] = useState<ContextualAnalysisResult | null>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const handleBlur = async (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (onAnalyze && value.trim()) {
        setIsAnalyzing(true)
        try {
          const result = await onAnalyze(value)
          if (result) {
            setAnalysisResult(result)
          }
        } finally {
          setIsAnalyzing(false)
        }
      }
      onBlur?.(e)
    }

    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-green-700 bg-green-50 border-green-200'
      if (score >= 60) return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      if (score >= 40) return 'text-orange-700 bg-orange-50 border-orange-200'
      return 'text-red-700 bg-red-50 border-red-200'
    }

    const getScoreIcon = (score: number) => {
      if (score >= 80) return '✓'
      if (score >= 60) return '○'
      return '!'
    }

    const dismissFeedback = () => {
      setAnalysisResult(null)
    }

    return (
      <div className="w-full">
        {label && (
          <div className="flex items-center gap-1.5 mb-1">
            <label
              htmlFor={textareaId}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            {leadingQuestions && leadingQuestions.length > 0 && (
              <HelpTooltip>
                <div className="space-y-1">
                  <p className="font-medium text-gray-200 mb-2">Consider these questions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {leadingQuestions.map((question, index) => (
                      <li key={index} className="text-gray-100">{question}</li>
                    ))}
                  </ul>
                </div>
              </HelpTooltip>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'block w-full rounded-lg border px-3 py-2 text-gray-900 shadow-sm transition-colors',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            'resize-y min-h-[100px]',
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300',
            className
          )}
          onBlur={handleBlur}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}

        {/* Analysis Loading State */}
        {isAnalyzing && (
          <div className="mt-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing content...
            </div>
          </div>
        )}

        {/* Analysis Feedback Display */}
        {analysisResult && !isAnalyzing && (
          <div className={cn('mt-2 p-3 rounded-lg border', getScoreColor(analysisResult.relevanceScore))}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>{getScoreIcon(analysisResult.relevanceScore)}</span>
                  <span>{analysisResult.feedback}</span>
                </div>
                {analysisResult.suggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium opacity-80 mb-1">Suggestions:</p>
                    <ul className="text-xs space-y-0.5">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="mt-0.5">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={dismissFeedback}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss feedback"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
