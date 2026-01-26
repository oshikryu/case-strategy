'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Select, TextArea } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { EmploymentHistoryEntry } from '@/types'
import { cn } from '@/lib/utils'

const employmentSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role/Title is required'),
  industry: z.string().min(1, 'Industry is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrentRole: z.boolean(),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
  achievements: z.string().optional(),
  employeeCount: z.enum(['small', 'medium', 'large', 'enterprise']).optional(),
  companyReputation: z.enum(['startup', 'established', 'industry-leader', 'fortune500']).optional(),
})

type EmploymentFormData = z.infer<typeof employmentSchema>

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

const companySizeOptions = [
  { value: 'small', label: 'Small (1-50 employees)' },
  { value: 'medium', label: 'Medium (51-500 employees)' },
  { value: 'large', label: 'Large (501-5000 employees)' },
  { value: 'enterprise', label: 'Enterprise (5000+ employees)' },
]

const companyReputationOptions = [
  { value: 'startup', label: 'Startup / Early-stage' },
  { value: 'established', label: 'Established Company' },
  { value: 'industry-leader', label: 'Industry Leader' },
  { value: 'fortune500', label: 'Fortune 500' },
]

export interface EmploymentHistoryFormProps {
  onNext: () => void
  onBack: () => void
}

export function EmploymentHistoryForm({ onNext, onBack }: EmploymentHistoryFormProps) {
  const { intake, addEmploymentEntry, updateEmploymentEntry, removeEmploymentEntry, setIntake } = useApplicationStore()
  const [isAddingEntry, setIsAddingEntry] = useState(false)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)

  const entries = intake?.employmentHistory || []

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EmploymentFormData>({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      isCurrentRole: false,
    },
  })

  const isCurrentRole = watch('isCurrentRole')

  const handleEdit = (entry: EmploymentHistoryEntry) => {
    setEditingEntryId(entry.id)
    setIsAddingEntry(true)
    reset({
      company: entry.company,
      role: entry.role,
      industry: entry.industry,
      startDate: entry.startDate,
      endDate: entry.endDate || '',
      isCurrentRole: entry.isCurrentRole,
      responsibilities: entry.responsibilities,
      achievements: entry.achievements || '',
      employeeCount: entry.employeeCount,
      companyReputation: entry.companyReputation,
    })
  }

  const onSubmit = (data: EmploymentFormData) => {
    if (editingEntryId) {
      updateEmploymentEntry(editingEntryId, data)
      setEditingEntryId(null)
    } else {
      const entry: EmploymentHistoryEntry = {
        id: generateId(),
        ...data,
      }
      addEmploymentEntry(entry)
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Employment History</h2>
        <p className="text-gray-600">
          Add your relevant work experience. Leadership roles and prestigious employers strengthen your case.
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
                <h4 className="font-medium text-gray-900">{entry.role}</h4>
                <p className="text-sm text-gray-600">{entry.company}</p>
                <p className="text-xs text-gray-500">
                  {entry.startDate} - {entry.isCurrentRole ? 'Present' : entry.endDate}
                </p>
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
                  onClick={() => removeEmploymentEntry(entry.id)}
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
              <Input
                label="Company Name"
                placeholder="e.g., Google, Microsoft"
                error={errors.company?.message}
                {...register('company')}
              />
              <Input
                label="Role/Title"
                placeholder="e.g., Senior Software Engineer"
                error={errors.role?.message}
                {...register('role')}
              />
            </div>

            <Select
              label="Industry"
              options={industryOptions}
              placeholder="Select industry"
              error={errors.industry?.message}
              {...register('industry')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                error={errors.startDate?.message}
                {...register('startDate')}
              />
              <div>
                <Input
                  label="End Date"
                  type="month"
                  disabled={isCurrentRole}
                  error={errors.endDate?.message}
                  {...register('endDate')}
                />
                <label className="flex items-center mt-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 mr-2"
                    {...register('isCurrentRole')}
                  />
                  Currently working here
                </label>
              </div>
            </div>

            <TextArea
              label="Key Responsibilities"
              placeholder="Describe your main responsibilities..."
              error={errors.responsibilities?.message}
              {...register('responsibilities')}
            />

            <TextArea
              label="Notable Achievements (Optional)"
              placeholder="Awards, promotions, significant projects..."
              helperText="Achievements can strengthen multiple O-1A criteria"
              {...register('achievements')}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Company Size (Optional)"
                options={companySizeOptions}
                placeholder="Select size"
                {...register('employeeCount')}
              />
              <Select
                label="Company Reputation (Optional)"
                options={companyReputationOptions}
                placeholder="Select reputation"
                {...register('companyReputation')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit">{editingEntryId ? 'Save Changes' : 'Add Employment'}</Button>
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
          <span className="text-gray-600">Add Employment Entry</span>
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
