'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Select, TextArea } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { ProfessionalConnectionEntry } from '@/types'
import { cn } from '@/lib/utils'
import { getLeadingQuestions } from '@/lib/constants'
import { analyzeContextualRelevance } from '@/lib/services/contextualAnalysis'

const professionalConnectionSchema = z.object({
  relationship: z.enum(['colleague', 'mentor', 'supervisor', 'collaborator', 'client', 'other']),
  name: z.string().min(1, 'Name is required'),
  occupation: z.string().optional(),
  industry: z.string().optional(),
  professionalAchievements: z.string().optional(),
  canProvideReference: z.boolean(),
  fieldRelevance: z.string().optional(),
})

type ProfessionalConnectionFormData = z.infer<typeof professionalConnectionSchema>

const relationshipOptions = [
  { value: 'colleague', label: 'Colleague' },
  { value: 'mentor', label: 'Mentor/Advisor' },
  { value: 'supervisor', label: 'Supervisor/Manager' },
  { value: 'collaborator', label: 'Research Collaborator' },
  { value: 'client', label: 'Client/Partner' },
  { value: 'other', label: 'Other' },
]

const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'media', label: 'Media & Entertainment' },
  { value: 'legal', label: 'Legal' },
  { value: 'government', label: 'Government' },
  { value: 'nonprofit', label: 'Non-Profit' },
  { value: 'other', label: 'Other' },
]

export interface ProfessionalConnectionsFormProps {
  onNext: () => void
  onBack: () => void
}

export function ProfessionalConnectionsForm({ onNext, onBack }: ProfessionalConnectionsFormProps) {
  const { intake, addProfessionalConnection, updateProfessionalConnection, removeProfessionalConnection, setIntake } = useApplicationStore()
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)

  // Support legacy data that may have familyConnections
  const entries = intake?.professionalConnections || ((intake as unknown as Record<string, unknown>)?.familyConnections as ProfessionalConnectionEntry[] | undefined) || []

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfessionalConnectionFormData>({
    resolver: zodResolver(professionalConnectionSchema),
    defaultValues: {
      canProvideReference: false,
    },
  })

  const handleAnalyze = (fieldId: string, label: string) => (value: string) => {
    analyzeContextualRelevance({
      fieldId,
      criterionType: 'professionalConnections',
      content: value,
      label,
    })
  }

  const handleEdit = (entry: ProfessionalConnectionEntry) => {
    setEditingEntryId(entry.id)
    setIsAddingEntry(true)
    reset({
      relationship: entry.relationship,
      name: entry.name,
      occupation: entry.occupation || '',
      industry: entry.industry || '',
      professionalAchievements: entry.professionalAchievements || '',
      canProvideReference: entry.canProvideReference,
      fieldRelevance: entry.fieldRelevance || '',
    })
  }

  const onSubmit = (data: ProfessionalConnectionFormData) => {
    if (editingEntryId) {
      updateProfessionalConnection(editingEntryId, data)
      setEditingEntryId(null)
    } else {
      const entry: ProfessionalConnectionEntry = {
        id: generateId(),
        ...data,
      }
      addProfessionalConnection(entry)
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
        professionalConnections: [],
      })
    }
    onNext()
  }

  const getRelationshipLabel = (relationship: string): string => {
    const option = relationshipOptions.find((o) => o.value === relationship)
    return option?.label || relationship
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Connections</h2>
        <p className="text-gray-600">
          Add professional contacts who could provide reference letters or have relevant expertise.
          This is optional but can strengthen your case.
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
                  {entry.name} ({getRelationshipLabel(entry.relationship)})
                </h4>
                {entry.occupation && (
                  <p className="text-sm text-gray-600">{entry.occupation}</p>
                )}
                {entry.canProvideReference && (
                  <p className="text-xs text-green-600 mt-1">
                    Can provide reference
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
                  onClick={() => removeProfessionalConnection(entry.id)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Relationship"
                options={relationshipOptions}
                placeholder="Select relationship"
                error={errors.relationship?.message}
                {...register('relationship')}
              />
              <Input
                label="Name"
                placeholder="Full name"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Occupation (Optional)"
                placeholder="e.g., Professor, CEO, Doctor"
                {...register('occupation')}
              />
              <Select
                label="Industry (Optional)"
                options={industryOptions}
                placeholder="Select industry"
                {...register('industry')}
              />
            </div>

            <TextArea
              label="Professional Achievements (Optional)"
              placeholder="Awards, publications, leadership positions, notable accomplishments..."
              helperText="Helps identify their credibility as a reference"
              leadingQuestions={getLeadingQuestions('professionalConnections', 'professionalAchievements')}
              onAnalyze={handleAnalyze('professionalAchievements', 'Professional Achievements')}
              {...register('professionalAchievements')}
            />

            <TextArea
              label="Field Relevance (Optional)"
              placeholder="How does their expertise relate to your field?"
              helperText="Experts in your field can provide stronger letters"
              leadingQuestions={getLeadingQuestions('professionalConnections', 'fieldRelevance')}
              onAnalyze={handleAnalyze('fieldRelevance', 'Field Relevance')}
              {...register('fieldRelevance')}
            />

            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 mr-2"
                {...register('canProvideReference')}
              />
              This person can provide a reference letter for my application
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
            <Button type="submit">{editingEntryId ? 'Save Changes' : 'Add Connection'}</Button>
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
          <span className="text-gray-600">Add Professional Connection</span>
        </button>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleContinue}>
          {entries.length > 0 ? 'View Recommendations' : 'Skip to Recommendations'}
        </Button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-500">
        This step is optional. Professional contacts with relevant expertise can strengthen your application.
      </p>
    </div>
  )
}
