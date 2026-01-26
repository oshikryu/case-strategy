import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Demographics,
  CriterionType,
  CriterionState,
  CriterionEntry,
  AwardEntry,
  MembershipEntry,
  PublishedMaterialEntry,
  JudgingEntry,
  ContributionEntry,
  AuthorshipEntry,
  CriticalEmploymentEntry,
  RemunerationEntry,
} from '@/types'

const initialCriterionState: CriterionState = {
  entries: [],
  isComplete: false,
  isDraft: false,
}

const initialCriteria: Record<CriterionType, CriterionState> = {
  awards: { ...initialCriterionState },
  membership: { ...initialCriterionState },
  publishedMaterial: { ...initialCriterionState },
  judging: { ...initialCriterionState },
  contributions: { ...initialCriterionState },
  authorship: { ...initialCriterionState },
  criticalEmployment: { ...initialCriterionState },
  remuneration: { ...initialCriterionState },
}

interface ApplicationStore {
  demographics: Demographics | null
  criteria: Record<CriterionType, CriterionState>

  // Demographics actions
  setDemographics: (demographics: Demographics) => void
  updateDemographics: (partial: Partial<Demographics>) => void
  clearDemographics: () => void

  // Criteria actions
  addEntry: (criterionType: CriterionType, entry: CriterionEntry) => void
  updateEntry: (criterionType: CriterionType, entryId: string, updates: Partial<CriterionEntry>) => void
  removeEntry: (criterionType: CriterionType, entryId: string) => void
  setCriterionComplete: (criterionType: CriterionType, isComplete: boolean) => void
  setCriterionDraft: (criterionType: CriterionType, isDraft: boolean) => void

  // Utility functions
  getCompletedCriteriaCount: () => number
  getCriterionEntries: <T extends CriterionEntry>(criterionType: CriterionType) => T[]
  resetApplication: () => void
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      demographics: null,
      criteria: initialCriteria,

      // Demographics actions
      setDemographics: (demographics) => set({ demographics }),

      updateDemographics: (partial) =>
        set((state) => ({
          demographics: state.demographics
            ? { ...state.demographics, ...partial }
            : null,
        })),

      clearDemographics: () => set({ demographics: null }),

      // Criteria actions
      addEntry: (criterionType, entry) =>
        set((state) => ({
          criteria: {
            ...state.criteria,
            [criterionType]: {
              ...state.criteria[criterionType],
              entries: [...state.criteria[criterionType].entries, entry],
              isDraft: true,
            },
          },
        })),

      updateEntry: (criterionType, entryId, updates) =>
        set((state) => ({
          criteria: {
            ...state.criteria,
            [criterionType]: {
              ...state.criteria[criterionType],
              entries: state.criteria[criterionType].entries.map((entry) =>
                entry.id === entryId ? { ...entry, ...updates } : entry
              ),
            },
          },
        })),

      removeEntry: (criterionType, entryId) =>
        set((state) => {
          const newEntries = state.criteria[criterionType].entries.filter(
            (entry) => entry.id !== entryId
          )
          return {
            criteria: {
              ...state.criteria,
              [criterionType]: {
                ...state.criteria[criterionType],
                entries: newEntries,
                isComplete: newEntries.length === 0 ? false : state.criteria[criterionType].isComplete,
              },
            },
          }
        }),

      setCriterionComplete: (criterionType, isComplete) =>
        set((state) => ({
          criteria: {
            ...state.criteria,
            [criterionType]: {
              ...state.criteria[criterionType],
              isComplete,
              isDraft: !isComplete,
            },
          },
        })),

      setCriterionDraft: (criterionType, isDraft) =>
        set((state) => ({
          criteria: {
            ...state.criteria,
            [criterionType]: {
              ...state.criteria[criterionType],
              isDraft,
            },
          },
        })),

      // Utility functions
      getCompletedCriteriaCount: () => {
        const { criteria } = get()
        return Object.values(criteria).filter((c) => c.isComplete).length
      },

      getCriterionEntries: <T extends CriterionEntry>(criterionType: CriterionType): T[] => {
        const { criteria } = get()
        return criteria[criterionType].entries as T[]
      },

      resetApplication: () =>
        set({
          demographics: null,
          criteria: initialCriteria,
        }),
    }),
    {
      name: 'o1a-visa-application',
    }
  )
)

// Helper function to generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Type guards for criterion entries
export const isAwardEntry = (entry: CriterionEntry): entry is AwardEntry =>
  'scope' in entry && 'significance' in entry

export const isMembershipEntry = (entry: CriterionEntry): entry is MembershipEntry =>
  'requirements' in entry && 'status' in entry

export const isPublishedMaterialEntry = (entry: CriterionEntry): entry is PublishedMaterialEntry =>
  'publication' in entry && 'circulation' in entry

export const isJudgingEntry = (entry: CriterionEntry): entry is JudgingEntry =>
  'submissionsCount' in entry && 'context' in entry

export const isContributionEntry = (entry: CriterionEntry): entry is ContributionEntry =>
  'impact' in entry && 'recognition' in entry

export const isAuthorshipEntry = (entry: CriterionEntry): entry is AuthorshipEntry =>
  'coauthors' in entry || 'citations' in entry || 'doi' in entry

export const isCriticalEmploymentEntry = (entry: CriterionEntry): entry is CriticalEmploymentEntry =>
  'criticalNature' in entry && 'responsibilities' in entry

export const isRemunerationEntry = (entry: CriterionEntry): entry is RemunerationEntry =>
  'salary' in entry && 'comparativeData' in entry
