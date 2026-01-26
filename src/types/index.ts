export type VisaCategory = 'none' | 'nonimmigrant' | 'immigrant'

export enum VisaType {
  // No visa
  NONE = 'None',

  // Nonimmigrant Visas
  A = 'A',
  B1 = 'B-1',
  B2 = 'B-2',
  B1_B2 = 'B-1/B-2',
  C = 'C',
  D = 'D',
  E1 = 'E-1',
  E2 = 'E-2',
  E3 = 'E-3',
  F1 = 'F-1',
  G = 'G',
  H1B = 'H-1B',
  H2A = 'H-2A',
  H2B = 'H-2B',
  H3 = 'H-3',
  I = 'I',
  J1 = 'J-1',
  K1 = 'K-1',
  K3 = 'K-3',
  L1 = 'L-1',
  M1 = 'M-1',
  O1 = 'O-1',
  P = 'P',
  Q = 'Q',
  R1 = 'R-1',
  TN = 'TN',
  T = 'T',
  U = 'U',
  V = 'V',
  OTHER_NONIMMIGRANT = 'Other Nonimmigrant',

  // Immigrant Visas
  IR1 = 'IR-1',
  CR1 = 'CR-1',
  F1_IMM = 'F1',
  F2A = 'F2A',
  F2B = 'F2B',
  F3 = 'F3',
  F4 = 'F4',
  EB1 = 'EB-1',
  EB2 = 'EB-2',
  EB3 = 'EB-3',
  EB4 = 'EB-4',
  EB5 = 'EB-5',
  DV = 'DV',
  SB = 'SB',
  OTHER_IMMIGRANT = 'Other Immigrant',
}

export interface Demographics {
  firstName: string
  middleName?: string
  lastName: string
  countryOfBirth: string
  addressLine1: string
  addressLine2?: string
  city: string
  stateOrRegion?: string
  postalCode?: string
  country: string
  currentVisaType: VisaType
  passportImage?: string // base64
}

// Evidence Types
export interface EvidenceFile {
  id: string
  name: string
  type: string
  size: number
  data: string // base64
}

export interface EvidenceUrl {
  id: string
  url: string
  description?: string
}

export interface Evidence {
  files: EvidenceFile[]
  urls: EvidenceUrl[]
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
  evidence?: Evidence
}

export interface MembershipEntry {
  id: string
  organization: string
  requirements: string
  dateJoined: string
  status: 'active' | 'former'
  achievements: string
  evidence?: Evidence
}

export interface PublishedMaterialEntry {
  id: string
  publication: string
  title: string
  date: string
  url?: string
  circulation: string
  evidence?: Evidence
}

export interface JudgingEntry {
  id: string
  organization: string
  role: string
  startDate: string
  endDate?: string
  context: string
  submissionsCount: number
  evidence?: Evidence
}

export interface ContributionEntry {
  id: string
  title: string
  description: string
  impact: string
  date: string
  recognition: string
  evidence?: Evidence
}

export interface AuthorshipEntry {
  id: string
  title: string
  publication: string
  date: string
  coauthors?: string
  citations?: number
  doi?: string
  evidence?: Evidence
}

export interface CriticalEmploymentEntry {
  id: string
  company: string
  role: string
  startDate: string
  endDate?: string
  responsibilities: string
  criticalNature: string
  evidence?: Evidence
}

export interface RemunerationEntry {
  id: string
  company: string
  position: string
  workLocation: string
  salary: number
  currency: string
  year: number
  comparativeData: string
  paystubs?: Evidence
  equityProof?: Evidence
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

// Employment History
export interface EmploymentHistoryEntry {
  id: string
  company: string
  role: string
  industry: string
  startDate: string
  endDate?: string
  isCurrentRole: boolean
  responsibilities: string
  achievements?: string
  employeeCount?: 'small' | 'medium' | 'large' | 'enterprise'
  companyReputation?: 'startup' | 'established' | 'industry-leader' | 'fortune500'
}

// Education History
export interface EducationHistoryEntry {
  id: string
  institution: string
  degree: 'bachelors' | 'masters' | 'doctorate' | 'professional' | 'other'
  fieldOfStudy: string
  graduationYear: number
  honors?: string
  publications?: number
  researchFocus?: string
  advisorNotable?: boolean
}

// Professional Connections
export interface ProfessionalConnectionEntry {
  id: string
  relationship: 'colleague' | 'mentor' | 'supervisor' | 'collaborator' | 'client' | 'other'
  name: string
  occupation?: string
  industry?: string
  professionalAchievements?: string
  canProvideReference: boolean
  fieldRelevance?: string
}

// Intake Data
export interface IntakeData {
  wantsRecommendations: boolean
  employmentHistory: EmploymentHistoryEntry[]
  educationHistory: EducationHistoryEntry[]
  professionalConnections: ProfessionalConnectionEntry[]
  completedAt?: string
}

// Recommendation Result
export interface CriterionRecommendation {
  criterionType: CriterionType
  score: number // 0-100
  reasoning: string
  suggestedEvidence: string[]
}

export interface RecommendationResult {
  recommendedCriteria: CriterionRecommendation[]
  primaryStrengths: string[]
  generatedAt: string
}

// Review Types
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'changes_requested'

export interface EntryReview {
  entryId: string
  status: ReviewStatus
  comment?: string
  reviewedAt: string
}

export interface CriterionReview {
  criterionType: CriterionType
  status: ReviewStatus
  overallComment?: string
  entryReviews: EntryReview[]
  reviewedAt?: string
}

export interface ApplicationReview {
  criteriaReviews: Record<CriterionType, CriterionReview>
  submittedAt: string
  reviewCompletedAt?: string
}

export type UserRole = 'applicant' | 'reviewer'
