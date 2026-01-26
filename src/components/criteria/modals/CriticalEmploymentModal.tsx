'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { CriticalEmploymentEntry, Evidence } from '@/types'
import { getCriterionDefinition } from '@/lib/constants'

const criticalEmploymentSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role/title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
  criticalNature: z.string().min(1, 'Explanation of critical nature is required'),
})

type CriticalEmploymentFormData = z.infer<typeof criticalEmploymentSchema>

interface CriticalEmploymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emptyEvidence: Evidence = { files: [], urls: [] }

export function CriticalEmploymentModal({ open, onOpenChange }: CriticalEmploymentModalProps) {
  const { criteria, addEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.criticalEmployment.entries as CriticalEmploymentEntry[]
  const criterion = getCriterionDefinition('criticalEmployment')!
  const [evidence, setEvidence] = useState<Evidence>(emptyEvidence)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CriticalEmploymentFormData>({
    resolver: zodResolver(criticalEmploymentSchema),
  })

  const onAddEntry = (data: CriticalEmploymentFormData) => {
    const entry: CriticalEmploymentEntry = {
      id: generateId(),
      ...data,
      endDate: data.endDate || undefined,
      evidence: evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined,
    }
    addEntry('criticalEmployment', entry)
    reset()
    setEvidence(emptyEvidence)
  }

  const handleRemoveEntry = (id: string) => {
    removeEntry('criticalEmployment', id)
  }

  const handleSaveAsDraft = () => {
    setCriterionDraft('criticalEmployment', true)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    if (entries.length > 0) {
      setCriterionComplete('criticalEmployment', true)
      onOpenChange(false)
    }
  }

  const getEvidenceCount = (entry: CriticalEmploymentEntry) => {
    if (!entry.evidence) return 0
    return entry.evidence.files.length + entry.evidence.urls.length
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
                  <p className="text-sm text-gray-600">{entry.company}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {entry.startDate} - {entry.endDate || 'Present'}
                  </p>
                  {getEvidenceCount(entry) > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      📎 {getEvidenceCount(entry)} evidence item(s)
                    </p>
                  )}
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
          <h4 className="text-sm font-medium text-gray-700">Add New Employment</h4>

          <Input
            label="Company/Organization"
            placeholder="e.g., Google, Stanford University"
            error={errors.company?.message}
            {...register('company')}
          />

          <Input
            label="Role/Title"
            placeholder="e.g., Principal Engineer, VP of Engineering"
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

          <TextArea
            label="Key Responsibilities"
            placeholder="Describe your main responsibilities and scope..."
            error={errors.responsibilities?.message}
            {...register('responsibilities')}
          />

          <TextArea
            label="Critical Nature of Role"
            placeholder="Explain why this role is critical/essential to the organization..."
            error={errors.criticalNature?.message}
            {...register('criticalNature')}
          />

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload offer letters, org charts, job descriptions, or links to company profiles"
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
