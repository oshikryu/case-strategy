'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { JudgingEntry, Evidence } from '@/types'
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

const emptyEvidence: Evidence = { files: [], urls: [] }

export function JudgingModal({ open, onOpenChange }: JudgingModalProps) {
  const { criteria, addEntry, updateEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.judging.entries as JudgingEntry[]
  const criterion = getCriterionDefinition('judging')!
  const [evidence, setEvidence] = useState<Evidence>(emptyEvidence)
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (editingEntryId && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [editingEntryId])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JudgingFormData>({
    resolver: zodResolver(judgingSchema),
  })

  const handleEdit = (entry: JudgingEntry) => {
    setEditingEntryId(entry.id)
    setValue('organization', entry.organization)
    setValue('role', entry.role)
    setValue('startDate', entry.startDate)
    setValue('endDate', entry.endDate || '')
    setValue('context', entry.context)
    setValue('submissionsCount', entry.submissionsCount)
    setEvidence(entry.evidence || emptyEvidence)
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    reset()
    setEvidence(emptyEvidence)
  }

  const onAddEntry = (data: JudgingFormData) => {
    const entryEvidence = evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined

    if (editingEntryId) {
      updateEntry('judging', editingEntryId, {
        ...data,
        endDate: data.endDate || undefined,
        evidence: entryEvidence,
      })
      setEditingEntryId(null)
    } else {
      const entry: JudgingEntry = {
        id: generateId(),
        ...data,
        endDate: data.endDate || undefined,
        evidence: entryEvidence,
      }
      addEntry('judging', entry)
    }
    reset()
    setEvidence(emptyEvidence)
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

  const getEvidenceCount = (entry: JudgingEntry) => {
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
            {entries.map((entry) => {
              const isEditing = editingEntryId === entry.id
              return (
                <div
                  key={entry.id}
                  className={`flex items-start justify-between p-3 rounded-lg border-2 transition-all ${
                    isEditing
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                      : 'bg-gray-50 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{entry.role}</p>
                      {isEditing && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                          Editing
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{entry.organization}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.startDate} - {entry.endDate || 'Present'} • {entry.submissionsCount} submissions reviewed
                    </p>
                    {getEvidenceCount(entry) > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        {getEvidenceCount(entry)} evidence item(s)
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={isEditing ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handleEdit(entry)}
                    >
                      {isEditing ? 'Editing...' : 'Edit'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEntry(entry.id)}
                      disabled={isEditing}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit(onAddEntry)} className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              {editingEntryId ? 'Edit Judging Experience' : 'Add New Judging Experience'}
            </h4>
            {editingEntryId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>

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

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload invitation letters, thank you notes, reviewer certificates, or links to reviewer acknowledgments"
          />

          <Button type="submit" variant="secondary" className="w-full">
            {editingEntryId ? 'Save Changes' : 'Add Entry'}
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
