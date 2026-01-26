'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Select, TextArea } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { EducationHistoryEntry } from '@/types'
import { cn } from '@/lib/utils'

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  degree: z.enum(['bachelors', 'masters', 'doctorate', 'professional', 'other']),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  graduationYear: z.coerce.number().min(1900).max(2100),
  honors: z.string().optional(),
  publications: z.coerce.number().min(0).optional(),
  researchFocus: z.string().optional(),
  advisorNotable: z.boolean(),
})

type EducationFormData = z.infer<typeof educationSchema>

const degreeOptions = [
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'doctorate', label: 'Doctorate (PhD)' },
  { value: 'professional', label: 'Professional Degree (MD, JD, MBA)' },
  { value: 'other', label: 'Other' },
]

export interface EducationHistoryFormProps {
  onNext: () => void
  onBack: () => void
}

export function EducationHistoryForm({ onNext, onBack }: EducationHistoryFormProps) {
  const { intake, addEducationEntry, updateEducationEntry, removeEducationEntry, setIntake } = useApplicationStore()
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)

  const entries = intake?.educationHistory || []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      advisorNotable: false,
      publications: 0,
    },
  })

  const handleEdit = (entry: EducationHistoryEntry) => {
    setEditingEntryId(entry.id)
    setIsAddingEntry(true)
    reset({
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.fieldOfStudy,
      graduationYear: entry.graduationYear,
      honors: entry.honors || '',
      publications: entry.publications || 0,
      researchFocus: entry.researchFocus || '',
      advisorNotable: entry.advisorNotable || false,
    })
  }

  const onSubmit = (data: EducationFormData) => {
    if (editingEntryId) {
      updateEducationEntry(editingEntryId, data)
      setEditingEntryId(null)
    } else {
      const entry: EducationHistoryEntry = {
        id: generateId(),
        ...data,
      }
      addEducationEntry(entry)
    }
    reset()
    setIsAddingEntry(false)
  }

  const handleCancel = () => {
    reset()
    setIsAddingEntry(false)
    setEditingEntryId(null)
  }

  const handleContinue = () => {
    if (!intake) {
      setIntake({
        wantsRecommendations: true,
        employmentHistory: [],
        educationHistory: [],
        familyConnections: [],
      })
    }
    onNext()
  }

  const getDegreeLabel = (degree: string): string => {
    const option = degreeOptions.find((o) => o.value === degree)
    return option?.label || degree
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education History</h2>
        <p className="text-gray-600">
          Add your educational background. Advanced degrees and publications are valuable for authorship criteria.
        </p>
      </div>

      {/* Existing entries */}
      {entries.length > 0 && !isAddingEntry && (
        <div className="space-y-4 mb-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between"
            >
              <div>
                <h4 className="font-medium text-gray-900">
                  {getDegreeLabel(entry.degree)} in {entry.fieldOfStudy}
                </h4>
                <p className="text-sm text-gray-600">{entry.institution}</p>
                <p className="text-xs text-gray-500">Graduated {entry.graduationYear}</p>
                {entry.publications && entry.publications > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {entry.publications} publication(s)
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-gray-400 hover:text-blue-500 transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => removeEducationEntry(entry.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add entry form */}
      {isAddingEntry ? (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="space-y-4">
            <Input
              label="Institution Name"
              placeholder="e.g., Stanford University"
              error={errors.institution?.message}
              {...register('institution')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Degree Type"
                options={degreeOptions}
                placeholder="Select degree"
                error={errors.degree?.message}
                {...register('degree')}
              />
              <Input
                label="Field of Study"
                placeholder="e.g., Computer Science"
                error={errors.fieldOfStudy?.message}
                {...register('fieldOfStudy')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Graduation Year"
                type="number"
                placeholder="e.g., 2020"
                error={errors.graduationYear?.message}
                {...register('graduationYear')}
              />
              <Input
                label="Number of Publications (Optional)"
                type="number"
                placeholder="0"
                helperText="Papers published during this degree"
                {...register('publications')}
              />
            </div>

            <Input
              label="Honors/Awards (Optional)"
              placeholder="e.g., Summa Cum Laude, Dean's List"
              helperText="Academic honors strengthen the Awards criterion"
              {...register('honors')}
            />

            <TextArea
              label="Research Focus (Optional)"
              placeholder="Describe your research area if applicable..."
              helperText="Research experience supports Original Contributions criterion"
              {...register('researchFocus')}
            />

            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 mr-2"
                {...register('advisorNotable')}
              />
              My advisor is well-known in the field
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit">{editingEntryId ? 'Save Changes' : 'Add Education'}</Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingEntry(true)}
          className={cn(
            'w-full border-2 border-dashed rounded-xl p-6 text-center transition-colors',
            'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          )}
        >
          <svg
            className="w-8 h-8 mx-auto text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-gray-600">Add Education Entry</span>
        </button>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>
          {entries.length > 0 ? 'Continue' : 'Skip This Step'}
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        You can add multiple entries or skip if not applicable.
      </p>
    </div>
  )
}
