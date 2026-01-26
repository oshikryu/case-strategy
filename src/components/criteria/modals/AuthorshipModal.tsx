'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { AuthorshipEntry, Evidence } from '@/types'
import { getCriterionDefinition, getLeadingQuestions } from '@/lib/constants'
import { analyzeContextualRelevance } from '@/lib/services/contextualAnalysis'

const authorshipSchema = z.object({
  title: z.string().min(1, 'Article title is required'),
  publication: z.string().min(1, 'Publication/journal is required'),
  date: z.string().min(1, 'Publication date is required'),
  coauthors: z.string().optional(),
  citations: z.coerce.number().optional(),
  doi: z.string().optional(),
})

type AuthorshipFormData = z.infer<typeof authorshipSchema>

interface AuthorshipModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emptyEvidence: Evidence = { files: [], urls: [] }

export function AuthorshipModal({ open, onOpenChange }: AuthorshipModalProps) {
  const { criteria, addEntry, updateEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.authorship.entries as AuthorshipEntry[]
  const criterion = getCriterionDefinition('authorship')!
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
  } = useForm<AuthorshipFormData>({
    resolver: zodResolver(authorshipSchema),
  })

  const handleAnalyze = (fieldId: string, label: string) => (value: string) => {
    analyzeContextualRelevance({
      fieldId,
      criterionType: 'authorship',
      content: value,
      label,
    })
  }

  const handleEdit = (entry: AuthorshipEntry) => {
    setEditingEntryId(entry.id)
    setValue('title', entry.title)
    setValue('publication', entry.publication)
    setValue('date', entry.date)
    setValue('coauthors', entry.coauthors || '')
    setValue('citations', entry.citations || undefined)
    setValue('doi', entry.doi || '')
    setEvidence(entry.evidence || emptyEvidence)
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    reset()
    setEvidence(emptyEvidence)
  }

  const onAddEntry = (data: AuthorshipFormData) => {
    const entryEvidence = evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined

    if (editingEntryId) {
      updateEntry('authorship', editingEntryId, {
        ...data,
        coauthors: data.coauthors || undefined,
        citations: data.citations || undefined,
        doi: data.doi || undefined,
        evidence: entryEvidence,
      })
      setEditingEntryId(null)
    } else {
      const entry: AuthorshipEntry = {
        id: generateId(),
        ...data,
        coauthors: data.coauthors || undefined,
        citations: data.citations || undefined,
        doi: data.doi || undefined,
        evidence: entryEvidence,
      }
      addEntry('authorship', entry)
    }
    reset()
    setEvidence(emptyEvidence)
  }

  const handleRemoveEntry = (id: string) => {
    removeEntry('authorship', id)
  }

  const handleSaveAsDraft = () => {
    setCriterionDraft('authorship', true)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    if (entries.length > 0) {
      setCriterionComplete('authorship', true)
      onOpenChange(false)
    }
  }

  const getEvidenceCount = (entry: AuthorshipEntry) => {
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
                    <p className="text-sm text-gray-600">{entry.publication} • {entry.date}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.citations !== undefined && `${entry.citations} citations`}
                      {entry.doi && ` • DOI: ${entry.doi}`}
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
              {editingEntryId ? 'Edit Article' : 'Add New Article'}
            </h4>
            {editingEntryId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>

          <Input
            label="Article Title"
            placeholder="e.g., Deep Learning for..."
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            label="Publication/Journal"
            placeholder="e.g., Nature, IEEE Transactions..."
            error={errors.publication?.message}
            {...register('publication')}
          />

          <Input
            label="Publication Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />

          <TextArea
            label="Co-authors (Optional)"
            placeholder="List co-authors, one per line..."
            error={errors.coauthors?.message}
            leadingQuestions={getLeadingQuestions('authorship', 'coauthors')}
            onAnalyze={handleAnalyze('coauthors', 'Co-authors')}
            {...register('coauthors')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Citation Count (Optional)"
              type="number"
              placeholder="e.g., 150"
              error={errors.citations?.message}
              {...register('citations')}
            />
            <Input
              label="DOI (Optional)"
              placeholder="e.g., 10.1000/xyz123"
              error={errors.doi?.message}
              {...register('doi')}
            />
          </div>

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload PDFs of publications, citation reports, or links to online articles"
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
