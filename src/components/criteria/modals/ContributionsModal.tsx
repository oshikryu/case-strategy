'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { ContributionEntry } from '@/types'
import { getCriterionDefinition } from '@/lib/constants'

const contributionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  impact: z.string().min(1, 'Impact description is required'),
  date: z.string().min(1, 'Date is required'),
  recognition: z.string().min(1, 'Recognition details are required'),
})

type ContributionFormData = z.infer<typeof contributionSchema>

interface ContributionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContributionsModal({ open, onOpenChange }: ContributionsModalProps) {
  const { criteria, addEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.contributions.entries as ContributionEntry[]
  const criterion = getCriterionDefinition('contributions')!

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
  })

  const onAddEntry = (data: ContributionFormData) => {
    const entry: ContributionEntry = {
      id: generateId(),
      ...data,
    }
    addEntry('contributions', entry)
    reset()
  }

  const handleRemoveEntry = (id: string) => {
    removeEntry('contributions', id)
  }

  const handleSaveAsDraft = () => {
    setCriterionDraft('contributions', true)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    if (entries.length > 0) {
      setCriterionComplete('contributions', true)
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
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Examples</h4>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            {criterion.examples.map((example, i) => (
              <li key={i}>{example}</li>
            ))}
          </ul>
        </div>

        {entries.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Your Entries ({entries.length})</h4>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{entry.title}</p>
                  <p className="text-sm text-gray-600">{entry.date}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.impact}</p>
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

        <form onSubmit={handleSubmit(onAddEntry)} className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Add New Contribution</h4>

          <Input
            label="Contribution Title"
            placeholder="e.g., Novel Algorithm for..."
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />

          <TextArea
            label="Description"
            placeholder="Describe your contribution in detail..."
            error={errors.description?.message}
            {...register('description')}
          />

          <TextArea
            label="Impact"
            placeholder="Describe the impact and significance of this contribution..."
            error={errors.impact?.message}
            {...register('impact')}
          />

          <TextArea
            label="Recognition"
            placeholder="How has this contribution been recognized by the field?"
            error={errors.recognition?.message}
            {...register('recognition')}
          />

          <Button type="submit" variant="secondary" className="w-full">
            Add Entry
          </Button>
        </form>

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
