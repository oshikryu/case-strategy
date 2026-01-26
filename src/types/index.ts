export enum VisaType {
  B1_B2 = 'B-1/B-2',
  F1 = 'F-1',
  H1B = 'H-1B',
  J1 = 'J-1',
  L1 = 'L-1',
  E2 = 'E-2',
  TN = 'TN',
  OTHER = 'Other',
  NONE = 'None',
}

export interface Demographics {
  firstName: string
  middleName?: string
  lastName: string
  countryOfBirth: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  currentVisaType: VisaType
  passportImage?: string // base64
}

// Criterion Entry Types
export interface AwardEntry {
  id: string
  name: string
  organization: string
  date: string
  description: string
  scope: 'local' | 'regional' | 'national' | 'international'
  significance: string
}

export interface MembershipEntry {
  id: string
  organization: string
  requirements: string
  dateJoined: string
  status: 'active' | 'former'
  achievements: string
}

export interface PublishedMaterialEntry {
  id: string
  publication: string
  title: string
  date: string
  url?: string
  circulation: string
}

export interface JudgingEntry {
  id: string
  organization: string
  role: string
  startDate: string
  endDate?: string
  context: string
  submissionsCount: number
}

export interface ContributionEntry {
  id: string
  title: string
  description: string
  impact: string
  date: string
  recognition: string
}

export interface AuthorshipEntry {
  id: string
  title: string
  publication: string
  date: string
  coauthors?: string
  citations?: number
  doi?: string
}

export interface CriticalEmploymentEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  responsibilities: string
  criticalNature: string
}

export interface RemunerationEntry {
  id: string
  company: string
  position: string
  salary: number
  currency: string
  year: number
  comparativeData: string
}

export type CriterionEntry =
  | AwardEntry
  | MembershipEntry
  | PublishedMaterialEntry
  | JudgingEntry
  | ContributionEntry
  | AuthorshipEntry
  | CriticalEmploymentEntry
  | RemunerationEntry

export type CriterionType =
  | 'awards'
  | 'membership'
  | 'publishedMaterial'
  | 'judging'
  | 'contributions'
  | 'authorship'
  | 'criticalEmployment'
  | 'remuneration'

export interface CriterionState {
  entries: CriterionEntry[]
  isComplete: boolean
  isDraft: boolean
}

export interface ApplicationState {
  demographics: Demographics | null
  criteria: Record<CriterionType, CriterionState>
}
