'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { PublishedMaterialEntry, Evidence } from '@/types'
import { getCriterionDefinition } from '@/lib/constants'

const publishedMaterialSchema = z.object({
  publication: z.string().min(1, 'Publication name is required'),
  title: z.string().min(1, 'Article title is required'),
  date: z.string().min(1, 'Publication date is required'),
  url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  circulation: z.string().min(1, 'Circulation/reach information is required'),
})

type PublishedMaterialFormData = z.infer<typeof publishedMaterialSchema>

interface PublishedMaterialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emptyEvidence: Evidence = { files: [], urls: [] }

export function PublishedMaterialModal({ open, onOpenChange }: PublishedMaterialModalProps) {
  const { criteria, addEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.publishedMaterial.entries as PublishedMaterialEntry[]
  const criterion = getCriterionDefinition('publishedMaterial')!
  const [evidence, setEvidence] = useState<Evidence>(emptyEvidence)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PublishedMaterialFormData>({
    resolver: zodResolver(publishedMaterialSchema),
  })

  const onAddEntry = (data: PublishedMaterialFormData) => {
    const entry: PublishedMaterialEntry = {
      id: generateId(),
      ...data,
      url: data.url || undefined,
      evidence: evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined,
    }
    addEntry('publishedMaterial', entry)
    reset()
    setEvidence(emptyEvidence)
  }

  const handleRemoveEntry = (id: string) => {
    removeEntry('publishedMaterial', id)
  }

  const handleSaveAsDraft = () => {
    setCriterionDraft('publishedMaterial', true)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    if (entries.length > 0) {
      setCriterionComplete('publishedMaterial', true)
      onOpenChange(false)
    }
  }

  const getEvidenceCount = (entry: PublishedMaterialEntry) => {
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
                  {entry.url && (
                    <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      View article
                    </a>
                  )}
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
          <h4 className="text-sm font-medium text-gray-700">Add New Published Material</h4>

          <Input
            label="Publication Name"
            placeholder="e.g., New York Times, TechCrunch"
            error={errors.publication?.message}
            {...register('publication')}
          />

          <Input
            label="Article Title"
            placeholder="Title of the article about you"
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            label="Publication Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />

          <Input
            label="Article URL (Optional)"
            placeholder="https://..."
            error={errors.url?.message}
            {...register('url')}
          />

          <TextArea
            label="Circulation/Reach"
            placeholder="Describe the publication's circulation, readership, or reach..."
            error={errors.circulation?.message}
            {...register('circulation')}
          />

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload PDFs of articles, screenshots, or links to archived versions"
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
