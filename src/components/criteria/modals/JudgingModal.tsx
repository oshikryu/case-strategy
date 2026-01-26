'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { JudgingEntry } from '@/types'
import { getCriterionDefinition } from '@/lib/constants'

const judgingSchema = z.object({
  organization: z.string().min(1, 'Organization is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  context: z.string().min(1, 'Context is required'),
  submissionsCount: z.coerce.number().min(1, 'Number of submissions is required'),
})

type JudgingFormData = z.infer<typeof judgingSchema>

interface JudgingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JudgingModal({ open, onOpenChange }: JudgingModalProps) {
  const { criteria, addEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.judging.entries as JudgingEntry[]
  const criterion = getCriterionDefinition('judging')!

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JudgingFormData>({
    resolver: zodResolver(judgingSchema),
  })

  const onAddEntry = (data: JudgingFormData) => {
    const entry: JudgingEntry = {
      id: generateId(),
      ...data,
      endDate: data.endDate || undefined,
    }
    addEntry('judging', entry)
    reset()
  }

  const handleRemoveEntry = (id: string) => {
    removeEntry('judging', id)
  }

  const handleSaveAsDraft = () => {
    setCriterionDraft('judging', true)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    if (entries.length > 0) {
      setCriterionComplete('judging', true)
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
                  <p className="font-medium text-gray-900">{entry.role}</p>
                  <p className="text-sm text-gray-600">{entry.organization}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {entry.startDate} - {entry.endDate || 'Present'} • {entry.submissionsCount} submissions reviewed
                  </p>
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
          <h4 className="text-sm font-medium text-gray-700">Add New Judging Experience</h4>

          <Input
            label="Organization/Event"
            placeholder="e.g., IEEE Conference, NSF"
            error={errors.organization?.message}
            {...register('organization')}
          />

          <Input
            label="Your Role"
            placeholder="e.g., Peer Reviewer, Panel Judge"
            error={errors.role?.message}
            {...register('role')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              error={errors.startDate?.message}
              {...register('startDate')}
            />
            <Input
              label="End Date (Optional)"
              type="date"
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </div>

          <Input
            label="Number of Submissions Reviewed"
            type="number"
            placeholder="e.g., 50"
            error={errors.submissionsCount?.message}
            {...register('submissionsCount')}
          />

          <TextArea
            label="Context"
            placeholder="Describe the nature of the judging work and its significance..."
            error={errors.context?.message}
            {...register('context')}
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
