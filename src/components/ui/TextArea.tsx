'use client'

import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { HelpTooltip } from './HelpTooltip'

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  leadingQuestions?: string[]
  onAnalyze?: (value: string) => void
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, leadingQuestions, onAnalyze, id, onBlur, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (onAnalyze && value.trim()) {
        onAnalyze(value)
      }
      onBlur?.(e)
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
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
