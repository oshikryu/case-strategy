import {
  IntakeData,
  CriticalEmploymentEntry,
  RemunerationEntry,
  AuthorshipEntry,
  AwardEntry,
  CriterionType,
  CriterionEntry,
} from '@/types'
import { generateId } from '@/lib/stores/useApplicationStore'

export interface GeneratedCriteriaEntries {
  criticalEmployment: CriticalEmploymentEntry[]
  remuneration: RemunerationEntry[]
  authorship: AuthorshipEntry[]
  awards: AwardEntry[]
}

export function generateCriteriaFromIntake(intake: IntakeData): GeneratedCriteriaEntries {
  const result: GeneratedCriteriaEntries = {
    criticalEmployment: [],
    remuneration: [],
    authorship: [],
    awards: [],
  }

  // Generate Critical Employment entries from employment history
  for (const emp of intake.employmentHistory) {
    const criticalNature = generateCriticalNature(emp)

    const entry: CriticalEmploymentEntry = {
      id: generateId(),
      company: emp.company,
      role: emp.role,
      startDate: emp.startDate,
      endDate: emp.endDate,
      responsibilities: emp.responsibilities,
      criticalNature: criticalNature,
    }
    result.criticalEmployment.push(entry)

    // Also generate Remuneration entry if company is prestigious
    if (emp.companyReputation === 'fortune500' || emp.companyReputation === 'industry-leader') {
      const remunerationEntry: RemunerationEntry = {
        id: generateId(),
        company: emp.company,
        position: emp.role,
        workLocation: '', // User needs to fill this in
        salary: 0, // User needs to fill this in
        currency: 'USD',
        year: emp.endDate ? parseInt(emp.endDate.split('-')[0]) : new Date().getFullYear(),
        comparativeData: `Position at ${emp.companyReputation === 'fortune500' ? 'Fortune 500' : 'industry-leading'} company ${emp.company}. Please add salary data and comparative market data.`,
      }
      result.remuneration.push(remunerationEntry)
    }
  }

  // Generate Authorship entries from education publications
  for (const edu of intake.educationHistory) {
    if (edu.publications && edu.publications > 0) {
      // Create a placeholder entry for publications
      const entry: AuthorshipEntry = {
        id: generateId(),
        title: `Research publications from ${edu.institution}`,
        publication: edu.researchFocus ? `${edu.fieldOfStudy} - ${edu.researchFocus}` : edu.fieldOfStudy,
        date: `${edu.graduationYear}`,
        coauthors: edu.advisorNotable ? 'Including notable advisor' : undefined,
        citations: undefined,
        doi: undefined,
      }
      result.authorship.push(entry)
    }
  }

  // Generate Award entries from education honors
  for (const edu of intake.educationHistory) {
    if (edu.honors && edu.honors.trim().length > 0) {
      const entry: AwardEntry = {
        id: generateId(),
        name: edu.honors,
        organization: edu.institution,
        date: `${edu.graduationYear}`,
        description: `Academic honor received during ${edu.degree} in ${edu.fieldOfStudy}`,
        scope: 'national', // Default, user can adjust
        significance: `Recognized for academic excellence at ${edu.institution}`,
      }
      result.awards.push(entry)
    }
  }

  return result
}

function generateCriticalNature(emp: IntakeData['employmentHistory'][0]): string {
  const parts: string[] = []

  // Add company reputation context
  if (emp.companyReputation === 'fortune500') {
    parts.push(`Held critical role at Fortune 500 company ${emp.company}.`)
  } else if (emp.companyReputation === 'industry-leader') {
    parts.push(`Served in essential capacity at industry-leading organization ${emp.company}.`)
  } else if (emp.companyReputation === 'established') {
    parts.push(`Key contributor at established company ${emp.company}.`)
  }

  // Add company size context
  if (emp.employeeCount === 'enterprise') {
    parts.push(`Organization employs 5000+ employees globally.`)
  } else if (emp.employeeCount === 'large') {
    parts.push(`Organization employs 500-5000 employees.`)
  }

  // Add achievements if present
  if (emp.achievements && emp.achievements.trim().length > 0) {
    parts.push(`Key achievements: ${emp.achievements}`)
  }

  // Default text if nothing specific
  if (parts.length === 0) {
    parts.push(`Served as ${emp.role} with responsibilities including: ${emp.responsibilities}`)
  }

  return parts.join(' ')
}

export function hasExistingEntries(
  criteria: Record<CriterionType, { entries: CriterionEntry[] }>
): boolean {
  return Object.values(criteria).some(c => c.entries.length > 0)
}
