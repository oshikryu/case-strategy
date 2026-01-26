'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { CriticalEmploymentEntry, Evidence } from '@/types'
import { getCriterionDefinition, getLeadingQuestions } from '@/lib/constants'
import { analyzeContextualRelevance } from '@/lib/services/contextualAnalysis'

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
  const { criteria, addEntry, updateEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.criticalEmployment.entries as CriticalEmploymentEntry[]
  const criterion = getCriterionDefinition('criticalEmployment')!
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
  } = useForm<CriticalEmploymentFormData>({
    resolver: zodResolver(criticalEmploymentSchema),
  })

  const handleAnalyze = (fieldId: string, label: string) => (value: string) => {
    analyzeContextualRelevance({
      fieldId,
      criterionType: 'criticalEmployment',
      content: value,
      label,
    })
  }

  const handleEdit = (entry: CriticalEmploymentEntry) => {
    setEditingEntryId(entry.id)
    setValue('company', entry.company)
    setValue('role', entry.role)
    setValue('startDate', entry.startDate)
    setValue('endDate', entry.endDate || '')
    setValue('responsibilities', entry.responsibilities)
    setValue('criticalNature', entry.criticalNature)
    setEvidence(entry.evidence || emptyEvidence)
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    reset()
    setEvidence(emptyEvidence)
  }

  const onAddEntry = (data: CriticalEmploymentFormData) => {
    const entryEvidence = evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined

    if (editingEntryId) {
      updateEntry('criticalEmployment', editingEntryId, {
        ...data,
        endDate: data.endDate || undefined,
        evidence: entryEvidence,
      })
      setEditingEntryId(null)
    } else {
      const entry: CriticalEmploymentEntry = {
        id: generateId(),
        ...data,
        endDate: data.endDate || undefined,
        evidence: entryEvidence,
      }
      addEntry('criticalEmployment', entry)
    }
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
                    <p className="text-sm text-gray-600">{entry.company}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.startDate} - {entry.endDate || 'Present'}
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
              {editingEntryId ? 'Edit Employment' : 'Add New Employment'}
            </h4>
            {editingEntryId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>

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
            leadingQuestions={getLeadingQuestions('criticalEmployment', 'responsibilities')}
            onAnalyze={handleAnalyze('responsibilities', 'Key Responsibilities')}
            {...register('responsibilities')}
          />

          <TextArea
            label="Critical Nature of Role"
            placeholder="Explain why this role is critical/essential to the organization..."
            error={errors.criticalNature?.message}
            leadingQuestions={getLeadingQuestions('criticalEmployment', 'criticalNature')}
            onAnalyze={handleAnalyze('criticalNature', 'Critical Nature of Role')}
            {...register('criticalNature')}
          />

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload offer letters, org charts, job descriptions, or links to company profiles"
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
