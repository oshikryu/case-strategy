'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { VisaType, VisaCategory } from '@/types'
import {
  visaCategoryDescriptions,
  getVisaOptionsByCategory,
  getVisaOption,
} from '@/lib/constants'

export interface VisaTypeDropdownProps {
  value?: VisaType | string
  onChange: (value: VisaType) => void
  error?: string
}

export function VisaTypeDropdown({ value, onChange, error }: VisaTypeDropdownProps) {
  const [selectedCategory, setSelectedCategory] = useState<VisaCategory | null>(null)

  // Determine initial category from value
  useEffect(() => {
    if (value) {
      const option = getVisaOption(value as VisaType)
      if (option) {
        setSelectedCategory(option.category)
      }
    }
  }, [value])

  const handleCategorySelect = (category: VisaCategory) => {
    setSelectedCategory(category)
    // If selecting "none", automatically set the value
    if (category === 'none') {
      onChange(VisaType.NONE)
    }
  }

  const handleVisaSelect = (visaValue: string) => {
    onChange(visaValue as VisaType)
  }

  const categories: VisaCategory[] = ['none', 'nonimmigrant', 'immigrant']
  const visaOptions = selectedCategory ? getVisaOptionsByCategory(selectedCategory) : []
  const selectedVisa = value ? getVisaOption(value as VisaType) : undefined

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Visa Status
        </label>

        {/* Category Selection */}
        <div className="space-y-2">
          {categories.map((category) => {
            const { title, description } = visaCategoryDescriptions[category]
            const isSelected = selectedCategory === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => handleCategorySelect(category)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border-2 transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'font-medium',
                    isSelected ? 'text-blue-700' : 'text-gray-900'
                  )}>
                    {title}
                  </span>
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-blue-600"
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
                </div>
                <p className={cn(
                  'text-sm mt-1',
                  isSelected ? 'text-blue-600' : 'text-gray-500'
                )}>
                  {description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Visa Type Selection (only shown for nonimmigrant/immigrant) */}
      {selectedCategory && selectedCategory !== 'none' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Specific Visa
          </label>
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
            {visaOptions.map((option) => {
              const isSelected = value === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleVisaSelect(option.value)}
                  className={cn(
                    'w-full text-left px-4 py-3 transition-colors',
                    'focus:outline-none focus:bg-blue-50',
                    isSelected
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'font-medium text-sm',
                      isSelected ? 'text-blue-700' : 'text-gray-900'
                    )}>
                      {option.label}
                    </span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-blue-600 flex-shrink-0"
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
                  </div>
                  <p className={cn(
                    'text-xs mt-0.5',
                    isSelected ? 'text-blue-600' : 'text-gray-500'
                  )}>
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Visa Summary */}
      {selectedVisa && selectedCategory !== 'none' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">
            <span className="font-medium">Selected:</span> {selectedVisa.label}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
