'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { validateImageFile, fileToCompressedBase64 } from '@/lib/utils/imageHelpers'
import { Button } from '@/components/ui'

export interface PassportUploadProps {
  value?: string
  onChange: (base64: string | undefined) => void
  error?: string
}

export function PassportUpload({ value, onChange, error }: PassportUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(undefined)
    const validation = validateImageFile(file)

    if (!validation.valid) {
      setUploadError(validation.error)
      return
    }

    setIsLoading(true)
    try {
      const base64 = await fileToCompressedBase64(file)
      onChange(base64)
    } catch {
      setUploadError('Failed to process image')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = () => {
    onChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const displayError = error || uploadError

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Passport Photo (Can upload later)
      </label>
      <p className="text-sm text-gray-500 mb-2">
        Upload a clear photo of your passport&apos;s photo page. Max 5MB.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Passport preview"
            className="max-w-xs rounded-lg border border-gray-300 shadow-sm"
          />
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2"
          >
            Remove
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={cn(
            'w-full max-w-xs rounded-lg border-2 border-dashed p-6',
            'flex flex-col items-center justify-center gap-2',
            'text-gray-500 hover:text-gray-700 hover:border-gray-400',
            'transition-colors cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            displayError ? 'border-red-300' : 'border-gray-300'
          )}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-sm">Click to upload passport image</span>
            </>
          )}
        </button>
      )}

      {displayError && (
        <p className="mt-1 text-sm text-red-600">{displayError}</p>
      )}
    </div>
  )
}
