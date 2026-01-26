'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, Select, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { AwardEntry, Evidence } from '@/types'
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

const emptyEvidence: Evidence = { files: [], urls: [] }

export function AwardsModal({ open, onOpenChange }: AwardsModalProps) {
  const { criteria, addEntry, updateEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.awards.entries as AwardEntry[]
  const criterion = getCriterionDefinition('awards')!
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

  const handleEdit = (entry: AwardEntry) => {
    setEditingEntryId(entry.id)
    setValue('name', entry.name)
    setValue('organization', entry.organization)
    setValue('date', entry.date)
    setValue('description', entry.description)
    setValue('scope', entry.scope)
    setValue('significance', entry.significance)
    setEvidence(entry.evidence || emptyEvidence)
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    reset()
    setEvidence(emptyEvidence)
  }

  const onAddEntry = (data: AwardFormData) => {
    const entryEvidence = evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined

    if (editingEntryId) {
      updateEntry('awards', editingEntryId, {
        ...data,
        evidence: entryEvidence,
      })
      setEditingEntryId(null)
    } else {
      const entry: AwardEntry = {
        id: generateId(),
        ...data,
        evidence: entryEvidence,
      }
      addEntry('awards', entry)
    }
    reset()
    setEvidence(emptyEvidence)
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

  const getEvidenceCount = (entry: AwardEntry) => {
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
                      <p className="font-medium text-gray-900">{entry.name}</p>
                      {isEditing && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                          Editing
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{entry.organization} • {entry.date}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{entry.scope} scope</p>
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

        {/* Add New Entry Form */}
        <form ref={formRef} onSubmit={handleSubmit(onAddEntry)} className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              {editingEntryId ? 'Edit Award' : 'Add New Award'}
            </h4>
            {editingEntryId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>

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

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload award certificates, announcement letters, or links to award announcements"
          />

          <Button type="submit" variant="secondary" className="w-full">
            {editingEntryId ? 'Save Changes' : 'Add Entry'}
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
