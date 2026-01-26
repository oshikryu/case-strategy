'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { AuthorshipEntry, Evidence } from '@/types'
import { getCriterionDefinition } from '@/lib/constants'

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
  const { criteria, addEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.authorship.entries as AuthorshipEntry[]
  const criterion = getCriterionDefinition('authorship')!
  const [evidence, setEvidence] = useState<Evidence>(emptyEvidence)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorshipFormData>({
    resolver: zodResolver(authorshipSchema),
  })

  const onAddEntry = (data: AuthorshipFormData) => {
    const entry: AuthorshipEntry = {
      id: generateId(),
      ...data,
      coauthors: data.coauthors || undefined,
      citations: data.citations || undefined,
      doi: data.doi || undefined,
      evidence: evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined,
    }
    addEntry('authorship', entry)
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
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{entry.title}</p>
                  <p className="text-sm text-gray-600">{entry.publication} • {entry.date}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {entry.citations !== undefined && `${entry.citations} citations`}
                    {entry.doi && ` • DOI: ${entry.doi}`}
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
          <h4 className="text-sm font-medium text-gray-700">Add New Article</h4>

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
