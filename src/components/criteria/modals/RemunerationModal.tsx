'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, Select, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { RemunerationEntry, Evidence } from '@/types'
import { getCriterionDefinition } from '@/lib/constants'

const remunerationSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.coerce.number().min(1, 'Salary is required'),
  currency: z.string().min(1, 'Currency is required'),
  year: z.coerce.number().min(1900, 'Year is required').max(2100, 'Invalid year'),
  comparativeData: z.string().min(1, 'Comparative data is required'),
})

type RemunerationFormData = z.infer<typeof remunerationSchema>

interface RemunerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const currencyOptions = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'OTHER', label: 'Other' },
]

const emptyEvidence: Evidence = { files: [], urls: [] }

export function RemunerationModal({ open, onOpenChange }: RemunerationModalProps) {
  const { criteria, addEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.remuneration.entries as RemunerationEntry[]
  const criterion = getCriterionDefinition('remuneration')!
  const [evidence, setEvidence] = useState<Evidence>(emptyEvidence)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RemunerationFormData>({
    resolver: zodResolver(remunerationSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      currency: 'USD',
    },
  })

  const onAddEntry = (data: RemunerationFormData) => {
    const entry: RemunerationEntry = {
      id: generateId(),
      ...data,
      evidence: evidence.files.length > 0 || evidence.urls.length > 0 ? evidence : undefined,
    }
    addEntry('remuneration', entry)
    reset()
    setEvidence(emptyEvidence)
  }

  const handleRemoveEntry = (id: string) => {
    removeEntry('remuneration', id)
  }

  const handleSaveAsDraft = () => {
    setCriterionDraft('remuneration', true)
    onOpenChange(false)
  }

  const handleMarkComplete = () => {
    if (entries.length > 0) {
      setCriterionComplete('remuneration', true)
      onOpenChange(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'OTHER' ? 'USD' : currency,
    }).format(amount)
  }

  const getEvidenceCount = (entry: RemunerationEntry) => {
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
                  <p className="font-medium text-gray-900">{entry.position}</p>
                  <p className="text-sm text-gray-600">{entry.company} • {entry.year}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(entry.salary, entry.currency)}
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
          <h4 className="text-sm font-medium text-gray-700">Add New Remuneration</h4>

          <Input
            label="Company/Organization"
            placeholder="e.g., Google, Facebook"
            error={errors.company?.message}
            {...register('company')}
          />

          <Input
            label="Position"
            placeholder="e.g., Senior Software Engineer"
            error={errors.position?.message}
            {...register('position')}
          />

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Input
                label="Annual Salary/Compensation"
                type="number"
                placeholder="e.g., 250000"
                error={errors.salary?.message}
                {...register('salary')}
              />
            </div>
            <Select
              label="Currency"
              options={currencyOptions}
              error={errors.currency?.message}
              {...register('currency')}
            />
          </div>

          <Input
            label="Year"
            type="number"
            placeholder="e.g., 2024"
            error={errors.year?.message}
            {...register('year')}
          />

          <TextArea
            label="Comparative Data"
            placeholder="Provide evidence that this salary is high compared to others in similar positions (e.g., industry benchmarks, percentile rankings, salary surveys)..."
            error={errors.comparativeData?.message}
            {...register('comparativeData')}
          />

          <EvidenceInput
            value={evidence}
            onChange={setEvidence}
            helperText="Upload pay stubs, offer letters, tax documents, or links to salary surveys/benchmarks"
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
