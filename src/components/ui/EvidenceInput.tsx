'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { cn } from '@/lib/utils'
import { compressImage } from '@/lib/utils/imageHelpers'
import { Evidence, EvidenceFile } from '@/types'
import { Button } from './Button'
import { Input } from './Input'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB per file (reduced for localStorage)
const MAX_TOTAL_SIZE = 10 * 1024 * 1024 // 10MB total (reduced for localStorage)

export interface EvidenceInputProps {
  value: Evidence
  onChange: (evidence: Evidence) => void
  label?: string
  helperText?: string
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileIcon = (type: string): string => {
  if (type.startsWith('image/')) return '🖼️'
  if (type === 'application/pdf') return '📄'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('sheet') || type.includes('excel')) return '📊'
  return '📎'
}

export function EvidenceInput({
  value,
  onChange,
  label = 'Supporting Evidence',
  helperText = 'Upload files or add URLs to support this entry',
}: EvidenceInputProps) {
  const [urlInput, setUrlInput] = useState('')
  const [urlDescription, setUrlDescription] = useState('')
  const [error, setError] = useState<string>()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const totalFileSize = value.files.reduce((sum, f) => sum + f.size, 0)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    await processFiles(Array.from(files))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const processFiles = async (files: File[]) => {
    setError(undefined)
    const newFiles: EvidenceFile[] = []

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds 2MB limit`)
        continue
      }

      if (totalFileSize + file.size > MAX_TOTAL_SIZE) {
        setError('Total file size would exceed 10MB limit')
        break
      }

      try {
        let base64 = await fileToBase64(file)
        let finalSize = file.size

        // Compress images to reduce storage size
        if (file.type.startsWith('image/')) {
          base64 = await compressImage(base64, 1200, 1200, 0.8)
          // Estimate compressed size (base64 is ~33% larger than binary)
          finalSize = Math.round((base64.length * 3) / 4)
        }

        newFiles.push({
          id: generateId(),
          name: file.name,
          type: file.type,
          size: finalSize,
          data: base64,
        })
      } catch {
        setError(`Failed to process "${file.name}"`)
      }
    }

    if (newFiles.length > 0) {
      onChange({
        ...value,
        files: [...value.files, ...newFiles],
      })
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  const handleRemoveFile = (id: string) => {
    onChange({
      ...value,
      files: value.files.filter((f) => f.id !== id),
    })
  }

  const handleAddUrl = () => {
    if (!urlInput.trim()) return

    try {
      new URL(urlInput)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setError(undefined)
    onChange({
      ...value,
      urls: [
        ...value.urls,
        {
          id: generateId(),
          url: urlInput.trim(),
          description: urlDescription.trim() || undefined,
        },
      ],
    })
    setUrlInput('')
    setUrlDescription('')
  }

  const handleRemoveUrl = (id: string) => {
    onChange({
      ...value,
      urls: value.urls.filter((u) => u.id !== id),
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <p className="text-sm text-gray-500 mb-3">{helperText}</p>
      </div>

      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center transition-colors',
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.txt"
        />
        <div className="space-y-2">
          <svg
            className="mx-auto h-10 w-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-gray-600">
            Drag and drop files here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500">
            PDF, Word, Excel, Images up to 2MB each (10MB total)
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {value.files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Files ({value.files.length})
          </p>
          <div className="space-y-1">
            {value.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{getFileIcon(file.type)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Total: {formatFileSize(totalFileSize)} / 10MB
          </p>
        </div>
      )}

      {/* URL Input */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Add URL Link</p>
        <div className="space-y-2">
          <Input
            placeholder="https://example.com/evidence"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <Input
            placeholder="Description (optional)"
            value={urlDescription}
            onChange={(e) => setUrlDescription(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddUrl}
            disabled={!urlInput.trim()}
          >
            Add URL
          </Button>
        </div>
      </div>

      {/* URLs List */}
      {value.urls.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Links ({value.urls.length})
          </p>
          <div className="space-y-1">
            {value.urls.map((urlItem) => (
              <div
                key={urlItem.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">🔗</span>
                  <div className="min-w-0">
                    <a
                      href={urlItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate block"
                    >
                      {urlItem.url}
                    </a>
                    {urlItem.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {urlItem.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveUrl(urlItem.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
