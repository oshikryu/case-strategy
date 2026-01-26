import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateCriteriaFromIntake } from '@/lib/utils/intakeToCriteria'
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
  IntakeData,
  RecommendationResult,
  EmploymentHistoryEntry,
  EducationHistoryEntry,
  ProfessionalConnectionEntry,
  ApplicationReview,
  CriterionReview,
  ReviewStatus,
  UserRole,
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
  intake: IntakeData | null
  recommendations: RecommendationResult | null
  review: ApplicationReview | null
  applicationSubmittedForReview: boolean
  userRole: UserRole

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

  // Intake/Recommendations actions
  setIntake: (intake: IntakeData) => void
  addEmploymentEntry: (entry: EmploymentHistoryEntry) => void
  updateEmploymentEntry: (id: string, updates: Partial<EmploymentHistoryEntry>) => void
  removeEmploymentEntry: (id: string) => void
  addEducationEntry: (entry: EducationHistoryEntry) => void
  updateEducationEntry: (id: string, updates: Partial<EducationHistoryEntry>) => void
  removeEducationEntry: (id: string) => void
  addProfessionalConnection: (entry: ProfessionalConnectionEntry) => void
  updateProfessionalConnection: (id: string, updates: Partial<ProfessionalConnectionEntry>) => void
  removeProfessionalConnection: (id: string) => void
  skipRecommendations: () => void
  setRecommendations: (recommendations: RecommendationResult) => void

  // Review actions
  submitForReview: () => void
  setUserRole: (role: UserRole) => void
  setCriterionReviewStatus: (criterionType: CriterionType, status: ReviewStatus, comment?: string) => void
  setEntryReviewStatus: (criterionType: CriterionType, entryId: string, status: ReviewStatus, comment?: string) => void

  // Utility functions
  getCompletedCriteriaCount: () => number
  getCriterionEntries: <T extends CriterionEntry>(criterionType: CriterionType) => T[]
  populateCriteriaFromIntake: () => void
  canProceedToReview: () => boolean
  getReviewSummary: () => { approved: number; rejected: number; pending: number; changesRequested: number }
  resetApplication: () => void
}

const initialIntake: IntakeData = {
  wantsRecommendations: false,
  employmentHistory: [],
  educationHistory: [],
  professionalConnections: [],
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      demographics: null,
      criteria: initialCriteria,
      intake: null,
      recommendations: null,
      review: null,
      applicationSubmittedForReview: false,
      userRole: 'applicant' as UserRole,

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

      // Intake/Recommendations actions
      setIntake: (intake) => set({ intake }),

      addEmploymentEntry: (entry) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                employmentHistory: [...state.intake.employmentHistory, entry],
              }
            : {
                ...initialIntake,
                wantsRecommendations: true,
                employmentHistory: [entry],
              },
        })),

      updateEmploymentEntry: (id, updates) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                employmentHistory: state.intake.employmentHistory.map((entry) =>
                  entry.id === id ? { ...entry, ...updates } : entry
                ),
              }
            : null,
        })),

      removeEmploymentEntry: (id) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                employmentHistory: state.intake.employmentHistory.filter(
                  (entry) => entry.id !== id
                ),
              }
            : null,
        })),

      addEducationEntry: (entry) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                educationHistory: [...state.intake.educationHistory, entry],
              }
            : {
                ...initialIntake,
                wantsRecommendations: true,
                educationHistory: [entry],
              },
        })),

      updateEducationEntry: (id, updates) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                educationHistory: state.intake.educationHistory.map((entry) =>
                  entry.id === id ? { ...entry, ...updates } : entry
                ),
              }
            : null,
        })),

      removeEducationEntry: (id) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                educationHistory: state.intake.educationHistory.filter(
                  (entry) => entry.id !== id
                ),
              }
            : null,
        })),

      addProfessionalConnection: (entry) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                professionalConnections: [...state.intake.professionalConnections, entry],
              }
            : {
                ...initialIntake,
                wantsRecommendations: true,
                professionalConnections: [entry],
              },
        })),

      updateProfessionalConnection: (id, updates) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                professionalConnections: state.intake.professionalConnections.map((entry) =>
                  entry.id === id ? { ...entry, ...updates } : entry
                ),
              }
            : null,
        })),

      removeProfessionalConnection: (id) =>
        set((state) => ({
          intake: state.intake
            ? {
                ...state.intake,
                professionalConnections: state.intake.professionalConnections.filter(
                  (entry) => entry.id !== id
                ),
              }
            : null,
        })),

      skipRecommendations: () =>
        set({
          intake: { ...initialIntake, wantsRecommendations: false },
          recommendations: null,
        }),

      setRecommendations: (recommendations) => set({ recommendations }),

      // Review actions
      submitForReview: () => {
        const { criteria, getCompletedCriteriaCount } = get()
        if (getCompletedCriteriaCount() < 3) return

        const criteriaTypes: CriterionType[] = [
          'awards', 'membership', 'publishedMaterial', 'judging',
          'contributions', 'authorship', 'criticalEmployment', 'remuneration'
        ]

        const criteriaReviews: Record<CriterionType, CriterionReview> = {} as Record<CriterionType, CriterionReview>

        criteriaTypes.forEach((type) => {
          criteriaReviews[type] = {
            criterionType: type,
            status: 'pending',
            entryReviews: criteria[type].entries.map((entry) => ({
              entryId: entry.id,
              status: 'pending' as ReviewStatus,
              reviewedAt: new Date().toISOString(),
            })),
          }
        })

        set({
          applicationSubmittedForReview: true,
          review: {
            criteriaReviews,
            submittedAt: new Date().toISOString(),
          },
        })
      },

      setUserRole: (role) => set({ userRole: role }),

      setCriterionReviewStatus: (criterionType, status, comment) =>
        set((state) => {
          if (!state.review) return state
          return {
            review: {
              ...state.review,
              criteriaReviews: {
                ...state.review.criteriaReviews,
                [criterionType]: {
                  ...state.review.criteriaReviews[criterionType],
                  status,
                  overallComment: comment,
                  reviewedAt: new Date().toISOString(),
                },
              },
            },
          }
        }),

      setEntryReviewStatus: (criterionType, entryId, status, comment) =>
        set((state) => {
          if (!state.review) return state
          const criterionReview = state.review.criteriaReviews[criterionType]
          return {
            review: {
              ...state.review,
              criteriaReviews: {
                ...state.review.criteriaReviews,
                [criterionType]: {
                  ...criterionReview,
                  entryReviews: criterionReview.entryReviews.map((er) =>
                    er.entryId === entryId
                      ? { ...er, status, comment, reviewedAt: new Date().toISOString() }
                      : er
                  ),
                },
              },
            },
          }
        }),

      // Utility functions
      getCompletedCriteriaCount: () => {
        const { criteria } = get()
        return Object.values(criteria).filter((c) => c.isComplete).length
      },

      getCriterionEntries: <T extends CriterionEntry>(criterionType: CriterionType): T[] => {
        const { criteria } = get()
        return criteria[criterionType].entries as T[]
      },

      populateCriteriaFromIntake: () => {
        const { intake, criteria } = get()
        if (!intake) return

        const generated = generateCriteriaFromIntake(intake)

        // Only add entries if the criterion doesn't already have entries
        const updates: Partial<Record<CriterionType, CriterionState>> = {}

        if (criteria.criticalEmployment.entries.length === 0 && generated.criticalEmployment.length > 0) {
          updates.criticalEmployment = {
            ...criteria.criticalEmployment,
            entries: generated.criticalEmployment,
            isDraft: true,
          }
        }

        if (criteria.remuneration.entries.length === 0 && generated.remuneration.length > 0) {
          updates.remuneration = {
            ...criteria.remuneration,
            entries: generated.remuneration,
            isDraft: true,
          }
        }

        if (criteria.authorship.entries.length === 0 && generated.authorship.length > 0) {
          updates.authorship = {
            ...criteria.authorship,
            entries: generated.authorship,
            isDraft: true,
          }
        }

        if (criteria.awards.entries.length === 0 && generated.awards.length > 0) {
          updates.awards = {
            ...criteria.awards,
            entries: generated.awards,
            isDraft: true,
          }
        }

        if (Object.keys(updates).length > 0) {
          set({
            criteria: {
              ...criteria,
              ...updates,
            },
          })
        }
      },

      canProceedToReview: () => {
        const { getCompletedCriteriaCount } = get()
        return getCompletedCriteriaCount() >= 3
      },

      getReviewSummary: () => {
        const { review } = get()
        if (!review) {
          return { approved: 0, rejected: 0, pending: 0, changesRequested: 0 }
        }

        const counts = { approved: 0, rejected: 0, pending: 0, changesRequested: 0 }
        Object.values(review.criteriaReviews).forEach((cr) => {
          switch (cr.status) {
            case 'approved':
              counts.approved++
              break
            case 'rejected':
              counts.rejected++
              break
            case 'changes_requested':
              counts.changesRequested++
              break
            default:
              counts.pending++
          }
        })
        return counts
      },

      resetApplication: () =>
        set({
          demographics: null,
          criteria: initialCriteria,
          intake: null,
          recommendations: null,
          review: null,
          applicationSubmittedForReview: false,
          userRole: 'applicant',
        }),
    }),
    {
      name: 'o1a-visa-application',
    }
  )
)

// Helper function to generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
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
