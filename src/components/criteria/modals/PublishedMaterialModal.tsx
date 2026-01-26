'use client'

import { useState, useRef, useEffect } from 'react'
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
  const { criteria, addEntry, updateEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.publishedMaterial.entries as PublishedMaterialEntry[]
  const criterion = getCriterionDefinition('publishedMaterial')!
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
  } = useForm<PublishedMaterialFormData>({
    resolver: zodResolver(publishedMaterialSchema),
  })

  const handleEdit = (entry: PublishedMaterialEntry) => {
    setEditingEntryId(entry.id)
    setValue('publication', entry.publication)
    setValue('title', entry.title)
    setValue('date', entry.date)
    setValue('url', entry.url || '')
    setValue('circulation', entry.circulation)
    setEvidence(entry.evidence || emptyEvidence)
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    reset()
    setEvidence(emptyEvidence)
  }

  const onAddEntry = (data: PublishedMaterialFormData) => {
    const entryEvidence = evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined

    if (editingEntryId) {
      updateEntry('publishedMaterial', editingEntryId, {
        ...data,
        url: data.url || undefined,
        evidence: entryEvidence,
      })
      setEditingEntryId(null)
    } else {
      const entry: PublishedMaterialEntry = {
        id: generateId(),
        ...data,
        url: data.url || undefined,
        evidence: entryEvidence,
      }
      addEntry('publishedMaterial', entry)
    }
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
                    {entry.url && (
                      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                        View article
                      </a>
                    )}
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
              {editingEntryId ? 'Edit Published Material' : 'Add New Published Material'}
            </h4>
            {editingEntryId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>

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
