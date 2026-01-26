'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, Select } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { AwardEntry } from '@/types'
import { getCriterionDefinition } from '@/lib/constants'

const awardSchema = z.object({
  name: z.string().min(1, 'Award name is required'),
  organization: z.string().min(1, 'Granting organization is required'),
  date: z.string().min(1, 'Date received is required'),
  description: z.string().min(1, 'Description is required'),
  scope: z.enum(['local', 'regional', 'national', 'international'], {
    errorMap: () => ({ message: 'Please select a scope' }),
  }),
  significance: z.string().min(1, 'Significance explanation is required'),
})

type AwardFormData = z.infer<typeof awardSchema>

interface AwardsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const scopeOptions = [
  { value: 'local', label: 'Local' },
  { value: 'regional', label: 'Regional' },
  { value: 'national', label: 'National' },
  { value: 'international', label: 'International' },
]

export function AwardsModal({ open, onOpenChange }: AwardsModalProps) {
  const { criteria, addEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.awards.entries as AwardEntry[]
  const criterion = getCriterionDefinition('awards')!

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AwardFormData>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      name: '',
      organization: '',
      date: '',
      description: '',
      scope: undefined,
      significance: '',
    },
  })

  const onAddEntry = (data: AwardFormData) => {
    const entry: AwardEntry = {
      id: generateId(),
      ...data,
    }
    addEntry('awards', entry)
    reset()
  }

  const handleRemoveEntry = (id: string) => {
    removeEntry('awards', id)
  }

  const handleSaveAsDraft = () => {
    setCriterionDraft('awards', true)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    if (entries.length > 0) {
      setCriterionComplete('awards', true)
      onOpenChange(false)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={criterion.title}
      description={criterion.fullDescription}
    >
      <div className="space-y-6">
        {/* Examples */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Examples</h4>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            {criterion.examples.map((example, i) => (
              <li key={i}>{example}</li>
            ))}
          </ul>
        </div>

        {/* Existing Entries */}
        {entries.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Your Entries ({entries.length})</h4>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{entry.name}</p>
                  <p className="text-sm text-gray-600">{entry.organization} • {entry.date}</p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{entry.scope} scope</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEntry(entry.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Entry Form */}
        <form onSubmit={handleSubmit(onAddEntry)} className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Add New Award</h4>

          <Input
            label="Award Name"
            placeholder="e.g., Best Paper Award"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Granting Organization"
            placeholder="e.g., IEEE Computer Society"
            error={errors.organization?.message}
            {...register('organization')}
          />

          <Input
            label="Date Received"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />

          <Select
            label="Scope"
            options={scopeOptions}
            placeholder="Select scope"
            error={errors.scope?.message}
            {...register('scope')}
          />

          <TextArea
            label="Description"
            placeholder="Describe the award and why you received it..."
            error={errors.description?.message}
            {...register('description')}
          />

          <TextArea
            label="Significance"
            placeholder="Explain why this award demonstrates extraordinary ability..."
            error={errors.significance?.message}
            {...register('significance')}
          />

          <Button type="submit" variant="secondary" className="w-full">
            Add Entry
          </Button>
        </form>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleSaveAsDraft}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="primary"
            className="flex-1"
            onClick={handleMarkComplete}
            disabled={entries.length === 0}
          >
            Mark Complete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
