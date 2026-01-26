'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Button, Input, TextArea, Select, EvidenceInput } from '@/components/ui'
import { useApplicationStore, generateId } from '@/lib/stores/useApplicationStore'
import { RemunerationEntry, Evidence } from '@/types'
import { getCriterionDefinition, getLeadingQuestions } from '@/lib/constants'
import { analyzeContextualRelevance } from '@/lib/services/contextualAnalysis'

const remunerationSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  workLocation: z.string().min(1, 'Work location is required'),
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
  const { criteria, addEntry, updateEntry, removeEntry, setCriterionComplete, setCriterionDraft } = useApplicationStore()
  const entries = criteria.remuneration.entries as RemunerationEntry[]
  const criterion = getCriterionDefinition('remuneration')!
  const [paystubs, setPaystubs] = useState<Evidence>(emptyEvidence)
  const [equityProof, setEquityProof] = useState<Evidence>(emptyEvidence)
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
  } = useForm<RemunerationFormData>({
    resolver: zodResolver(remunerationSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      currency: 'USD',
    },
  })

  const handleAnalyze = (fieldId: string, label: string) => async (value: string) => {
    return analyzeContextualRelevance({
      fieldId,
      criterionType: 'remuneration',
      content: value,
      label,
    })
  }

  const handleEdit = (entry: RemunerationEntry) => {
    setEditingEntryId(entry.id)
    setValue('company', entry.company)
    setValue('position', entry.position)
    setValue('workLocation', entry.workLocation)
    setValue('salary', entry.salary)
    setValue('currency', entry.currency)
    setValue('year', entry.year)
    setValue('comparativeData', entry.comparativeData)
    setPaystubs(entry.paystubs || emptyEvidence)
    setEquityProof(entry.equityProof || emptyEvidence)
  }

  const handleCancelEdit = () => {
    setEditingEntryId(null)
    reset()
    setPaystubs(emptyEvidence)
    setEquityProof(emptyEvidence)
  }

  const onAddEntry = (data: RemunerationFormData) => {
    const entryPaystubs = paystubs.files.length > 0 || paystubs.urls.length > 0 ? paystubs : undefined
    const entryEquityProof = equityProof.files.length > 0 || equityProof.urls.length > 0 ? equityProof : undefined

    if (editingEntryId) {
      updateEntry('remuneration', editingEntryId, {
        ...data,
        paystubs: entryPaystubs,
        equityProof: entryEquityProof,
      })
      setEditingEntryId(null)
    } else {
      const entry: RemunerationEntry = {
        id: generateId(),
        ...data,
        paystubs: entryPaystubs,
        equityProof: entryEquityProof,
      }
      addEntry('remuneration', entry)
    }
    reset()
    setPaystubs(emptyEvidence)
    setEquityProof(emptyEvidence)
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
    let count = 0
    if (entry.paystubs) {
      count += entry.paystubs.files.length + entry.paystubs.urls.length
    }
    if (entry.equityProof) {
      count += entry.equityProof.files.length + entry.equityProof.urls.length
    }
    return count
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
                      <p className="font-medium text-gray-900">{entry.position}</p>
                      {isEditing && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                          Editing
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{entry.company} • {entry.year}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatCurrency(entry.salary, entry.currency)}
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
              {editingEntryId ? 'Edit Remuneration' : 'Add New Remuneration'}
            </h4>
            {editingEntryId && (
              <Button type="button" variant="ghost" size="sm" onClick={handleCancelEdit}>
                Cancel Edit
              </Button>
            )}
          </div>

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

          <Input
            label="Work Location"
            placeholder="e.g., San Francisco, CA, USA"
            error={errors.workLocation?.message}
            {...register('workLocation')}
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
            leadingQuestions={getLeadingQuestions('remuneration', 'comparativeData')}
            onAnalyze={handleAnalyze('comparativeData', 'Comparative Data')}
            {...register('comparativeData')}
          />

          <EvidenceInput
            label="Paystubs / Salary Documentation"
            value={paystubs}
            onChange={setPaystubs}
            helperText="Upload pay stubs, offer letters, or tax documents showing compensation"
          />

          <EvidenceInput
            label="Equity / Stock Documentation (Optional)"
            value={equityProof}
            onChange={setEquityProof}
            helperText="Upload equity grant letters, stock option documents, or vesting schedules"
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
