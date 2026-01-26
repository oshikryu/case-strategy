'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { ContributionEntry, Evidence } from '@/types'
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

const emptyEvidence: Evidence = { files: [], urls: [] }

export function ContributionsModal({ open, onOpenChange }: ContributionsModalProps) {
  const { criteria, addEntry, updateEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.contributions.entries as ContributionEntry[]
  const criterion = getCriterionDefinition('contributions')!
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
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
  })

  const handleEdit = (entry: ContributionEntry) => {
    setEditingEntryId(entry.id)
    setValue('title', entry.title)
    setValue('description', entry.description)
    setValue('impact', entry.impact)
    setValue('date', entry.date)
    setValue('recognition', entry.recognition)
    setEvidence(entry.evidence || emptyEvidence)
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    reset()
    setEvidence(emptyEvidence)
  }

  const onAddEntry = (data: ContributionFormData) => {
    const entryEvidence = evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined

    if (editingEntryId) {
      updateEntry('contributions', editingEntryId, {
        ...data,
        evidence: entryEvidence,
      })
      setEditingEntryId(null)
    } else {
      const entry: ContributionEntry = {
        id: generateId(),
        ...data,
        evidence: entryEvidence,
      }
      addEntry('contributions', entry)
    }
    reset()
    setEvidence(emptyEvidence)
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

  const getEvidenceCount = (entry: ContributionEntry) => {
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
                      <p className="font-medium text-gray-900">{entry.title}</p>
                      {isEditing && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                          Editing
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{entry.date}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.impact}</p>
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
              {editingEntryId ? 'Edit Contribution' : 'Add New Contribution'}
            </h4>
            {editingEntryId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>

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

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload patents, technical documents, citations, or links to repositories/products"
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
