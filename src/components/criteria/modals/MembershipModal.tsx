'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, Select, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { MembershipEntry, Evidence } from '@/types'
import { getCriterionDefinition, getLeadingQuestions } from '@/lib/constants'
import { analyzeContextualRelevance } from '@/lib/services/contextualAnalysis'

const membershipSchema = z.object({
  organization: z.string().min(1, 'Organization is required'),
  requirements: z.string().min(1, 'Membership requirements are required'),
  dateJoined: z.string().min(1, 'Date joined is required'),
  status: z.enum(['active', 'former'], {
    errorMap: () => ({ message: 'Please select a status' }),
  }),
  achievements: z.string().min(1, 'Achievements are required'),
})

type MembershipFormData = z.infer<typeof membershipSchema>

interface MembershipModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusOptions = [
  { value: 'active', label: 'Active Member' },
  { value: 'former', label: 'Former Member' },
]

const emptyEvidence: Evidence = { files: [], urls: [] }

export function MembershipModal({ open, onOpenChange }: MembershipModalProps) {
  const { criteria, addEntry, updateEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.membership.entries as MembershipEntry[]
  const criterion = getCriterionDefinition('membership')!
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
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
  })

  const handleAnalyze = (fieldId: string, label: string) => async (value: string) => {
    return analyzeContextualRelevance({
      fieldId,
      criterionType: 'membership',
      content: value,
      label,
    })
  }

  const handleEdit = (entry: MembershipEntry) => {
    setEditingEntryId(entry.id)
    setValue('organization', entry.organization)
    setValue('requirements', entry.requirements)
    setValue('dateJoined', entry.dateJoined)
    setValue('status', entry.status)
    setValue('achievements', entry.achievements)
    setEvidence(entry.evidence || emptyEvidence)
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    reset()
    setEvidence(emptyEvidence)
  }

  const onAddEntry = (data: MembershipFormData) => {
    const entryEvidence = evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined

    if (editingEntryId) {
      updateEntry('membership', editingEntryId, {
        ...data,
        evidence: entryEvidence,
      })
      setEditingEntryId(null)
    } else {
      const entry: MembershipEntry = {
        id: generateId(),
        ...data,
        evidence: entryEvidence,
      }
      addEntry('membership', entry)
    }
    reset()
    setEvidence(emptyEvidence)
  }

  const handleRemoveEntry = (id: string) => {
    removeEntry('membership', id)
  }

  const handleSaveAsDraft = () => {
    setCriterionDraft('membership', true)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    if (entries.length > 0) {
      setCriterionComplete('membership', true)
      onOpenChange(false)
    }
  }

  const getEvidenceCount = (entry: MembershipEntry) => {
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
                      <p className="font-medium text-gray-900">{entry.organization}</p>
                      {isEditing && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                          Editing
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Joined: {entry.dateJoined}</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{entry.status}</p>
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
              {editingEntryId ? 'Edit Membership' : 'Add New Membership'}
            </h4>
            {editingEntryId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>

          <Input
            label="Organization Name"
            placeholder="e.g., IEEE, ACM"
            error={errors.organization?.message}
            {...register('organization')}
          />

          <TextArea
            label="Membership Requirements"
            placeholder="What are the requirements to join this organization?"
            error={errors.requirements?.message}
            leadingQuestions={getLeadingQuestions('membership', 'requirements')}
            onAnalyze={handleAnalyze('requirements', 'Membership Requirements')}
            {...register('requirements')}
          />

          <Input
            label="Date Joined"
            type="date"
            error={errors.dateJoined?.message}
            {...register('dateJoined')}
          />

          <Select
            label="Membership Status"
            options={statusOptions}
            placeholder="Select status"
            error={errors.status?.message}
            {...register('status')}
          />

          <TextArea
            label="Achievements within Organization"
            placeholder="Describe your achievements and contributions..."
            error={errors.achievements?.message}
            leadingQuestions={getLeadingQuestions('membership', 'achievements')}
            onAnalyze={handleAnalyze('achievements', 'Achievements within Organization')}
            {...register('achievements')}
          />

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload membership certificates, invitation letters, or links to member directories"
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
