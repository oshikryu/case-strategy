import {
  IntakeData,
  RecommendationResult,
  CriterionRecommendation,
  CriterionType,
  EmploymentHistoryEntry,
  EducationHistoryEntry,
  ProfessionalConnectionEntry,
} from '@/types'

interface ScoreAccumulator {
  score: number
  reasons: string[]
  evidence: string[]
}

const criterionTypes: CriterionType[] = [
  'awards',
  'membership',
  'publishedMaterial',
  'judging',
  'contributions',
  'authorship',
  'criticalEmployment',
  'remuneration',
]

const initializeScores = (): Record<CriterionType, ScoreAccumulator> => {
  const scores: Record<CriterionType, ScoreAccumulator> = {} as Record<CriterionType, ScoreAccumulator>
  for (const type of criterionTypes) {
    scores[type] = { score: 0, reasons: [], evidence: [] }
  }
  return scores
}

const leadershipTitles = [
  'vp', 'vice president', 'director', 'lead', 'head', 'chief',
  'cto', 'ceo', 'cfo', 'coo', 'founder', 'co-founder', 'partner',
  'principal', 'senior director', 'executive', 'president', 'manager'
]

const isLeadershipRole = (role: string): boolean => {
  const lowerRole = role.toLowerCase()
  return leadershipTitles.some(title => lowerRole.includes(title))
}

const processEmployment = (
  entries: EmploymentHistoryEntry[],
  scores: Record<CriterionType, ScoreAccumulator>
): void => {
  for (const entry of entries) {
    // Fortune 500 / Industry Leader employer
    if (entry.companyReputation === 'fortune500') {
      scores.criticalEmployment.score += 30
      scores.criticalEmployment.reasons.push(`Employment at Fortune 500 company: ${entry.company}`)
      scores.criticalEmployment.evidence.push(`Document your role and achievements at ${entry.company}`)

      scores.remuneration.score += 30
      scores.remuneration.reasons.push(`Fortune 500 compensation typically high at ${entry.company}`)
      scores.remuneration.evidence.push(`Gather pay stubs or offer letters from ${entry.company}`)
    } else if (entry.companyReputation === 'industry-leader') {
      scores.criticalEmployment.score += 25
      scores.criticalEmployment.reasons.push(`Employment at industry-leading company: ${entry.company}`)
      scores.criticalEmployment.evidence.push(`Document your critical role at ${entry.company}`)

      scores.remuneration.score += 20
      scores.remuneration.reasons.push(`Industry leader compensation at ${entry.company}`)
    }

    // Leadership titles
    if (isLeadershipRole(entry.role)) {
      scores.criticalEmployment.score += 25
      scores.criticalEmployment.reasons.push(`Leadership position as ${entry.role}`)
      scores.criticalEmployment.evidence.push(`Get org charts and letters confirming your ${entry.role} responsibilities`)
    }

    // Large/Enterprise company size
    if (entry.employeeCount === 'enterprise') {
      scores.criticalEmployment.score += 15
      scores.criticalEmployment.reasons.push(`Role at enterprise-scale organization (${entry.company})`)
    } else if (entry.employeeCount === 'large') {
      scores.criticalEmployment.score += 10
      scores.criticalEmployment.reasons.push(`Role at large organization (${entry.company})`)
    }

    // Achievements mentioned
    if (entry.achievements && entry.achievements.length > 50) {
      scores.contributions.score += 15
      scores.contributions.reasons.push(`Notable achievements at ${entry.company}`)
      scores.contributions.evidence.push(`Document the impact and recognition of your achievements at ${entry.company}`)

      scores.awards.score += 10
      scores.awards.reasons.push(`Achievements may include recognitions at ${entry.company}`)
      scores.awards.evidence.push(`List any awards or recognitions received during your time at ${entry.company}`)
    }
  }
}

const processEducation = (
  entries: EducationHistoryEntry[],
  scores: Record<CriterionType, ScoreAccumulator>
): void => {
  for (const entry of entries) {
    // PhD degree boosts multiple criteria
    if (entry.degree === 'doctorate') {
      scores.authorship.score += 25
      scores.authorship.reasons.push(`Doctorate in ${entry.fieldOfStudy} typically involves publications`)
      scores.authorship.evidence.push(`Gather your dissertation and any published papers from ${entry.institution}`)

      scores.judging.score += 25
      scores.judging.reasons.push(`PhD graduates often serve as peer reviewers`)
      scores.judging.evidence.push(`Document any peer review experience from your academic career`)

      scores.contributions.score += 25
      scores.contributions.reasons.push(`Doctoral research represents original contributions`)
      scores.contributions.evidence.push(`Describe the significance of your doctoral research`)
    }

    // Masters degree
    if (entry.degree === 'masters') {
      scores.authorship.score += 10
      scores.authorship.reasons.push(`Masters degree may include thesis work`)
      scores.authorship.evidence.push(`Include your thesis if published`)

      scores.contributions.score += 10
      scores.contributions.reasons.push(`Masters research may have contributions`)
    }

    // Publications during education
    if (entry.publications && entry.publications > 0) {
      const pubScore = Math.min(entry.publications * 15, 45) // Cap at 45
      scores.authorship.score += pubScore
      scores.authorship.reasons.push(`${entry.publications} publication(s) during education at ${entry.institution}`)
      scores.authorship.evidence.push(`Compile all academic publications with citation counts`)
    }

    // Academic honors
    if (entry.honors && entry.honors.length > 0) {
      scores.awards.score += 15
      scores.awards.reasons.push(`Academic honors: ${entry.honors}`)
      scores.awards.evidence.push(`Document your ${entry.honors} with official certificates`)
    }

    // Research focus
    if (entry.researchFocus && entry.researchFocus.length > 20) {
      scores.contributions.score += 15
      scores.contributions.reasons.push(`Research focus in ${entry.fieldOfStudy}`)
      scores.contributions.evidence.push(`Describe the impact of your research on the field`)
    }

    // Notable advisor
    if (entry.advisorNotable) {
      scores.membership.score += 10
      scores.membership.reasons.push(`Worked with notable advisor at ${entry.institution}`)
      scores.membership.evidence.push(`Get a recommendation letter from your advisor`)
    }
  }
}

const processProfessionalConnections = (
  entries: ProfessionalConnectionEntry[],
  scores: Record<CriterionType, ScoreAccumulator>
): void => {
  for (const entry of entries) {
    // Can provide reference
    if (entry.canProvideReference) {
      // Boost confidence across all criteria slightly
      for (const type of criterionTypes) {
        scores[type].score += 5
      }
      scores.membership.reasons.push(`${entry.name} (${entry.relationship}) can provide reference letter`)
      scores.membership.evidence.push(`Request a detailed recommendation letter from ${entry.name}`)
    }

    // Connection in same/related field
    if (entry.fieldRelevance && entry.fieldRelevance.length > 10) {
      scores.membership.score += 5
      scores.membership.reasons.push(`${entry.name} has relevant expertise in your field`)
    }

    // Professional achievements of connection
    if (entry.professionalAchievements && entry.professionalAchievements.length > 20) {
      scores.publishedMaterial.score += 5
      scores.publishedMaterial.reasons.push(`Professional network includes ${entry.name} with notable achievements`)
    }
  }
}

const identifyPrimaryStrengths = (
  intake: IntakeData
): string[] => {
  const strengths: string[] = []

  // Employment-based strengths
  const hasLeadership = intake.employmentHistory.some(e => isLeadershipRole(e.role))
  const hasPrestigiousEmployer = intake.employmentHistory.some(
    e => e.companyReputation === 'fortune500' || e.companyReputation === 'industry-leader'
  )

  if (hasLeadership && hasPrestigiousEmployer) {
    strengths.push('Strong employment background with leadership at prestigious organizations')
  } else if (hasLeadership) {
    strengths.push('Leadership experience demonstrated through senior roles')
  } else if (hasPrestigiousEmployer) {
    strengths.push('Employment at well-regarded organizations')
  }

  // Education-based strengths
  const hasPhD = intake.educationHistory.some(e => e.degree === 'doctorate')
  const totalPubs = intake.educationHistory.reduce((sum, e) => sum + (e.publications || 0), 0)

  if (hasPhD) {
    strengths.push('Advanced doctoral education with research expertise')
  }
  if (totalPubs > 2) {
    strengths.push(`Publication track record with ${totalPubs} publications`)
  }

  // Network strengths
  const hasReferences = intake.professionalConnections.some(e => e.canProvideReference)
  if (hasReferences) {
    strengths.push('Strong professional network with available references')
  }

  return strengths
}

export const generateRecommendations = (intake: IntakeData): RecommendationResult => {
  const scores = initializeScores()

  // Process all intake data
  processEmployment(intake.employmentHistory, scores)
  processEducation(intake.educationHistory, scores)
  // Support legacy data that may have familyConnections
  const connections = intake.professionalConnections || ((intake as unknown as Record<string, unknown>).familyConnections as ProfessionalConnectionEntry[] | undefined) || []
  processProfessionalConnections(connections, scores)

  // Convert scores to recommendations and sort by score
  const recommendations: CriterionRecommendation[] = criterionTypes
    .map(type => ({
      criterionType: type,
      score: Math.min(scores[type].score, 100), // Cap at 100
      reasoning: scores[type].reasons.length > 0
        ? scores[type].reasons.join('. ')
        : 'No strong signals detected for this criterion based on provided information.',
      suggestedEvidence: scores[type].evidence,
    }))
    .sort((a, b) => b.score - a.score)

  const primaryStrengths = identifyPrimaryStrengths(intake)

  return {
    recommendedCriteria: recommendations,
    primaryStrengths,
    generatedAt: new Date().toISOString(),
  }
}

export const getTopRecommendations = (result: RecommendationResult, count: number = 3): CriterionRecommendation[] => {
  return result.recommendedCriteria.slice(0, count)
}

export const isRecommended = (result: RecommendationResult | null, criterionType: CriterionType): boolean => {
  if (!result) return false
  const recommendation = result.recommendedCriteria.find(r => r.criterionType === criterionType)
  return recommendation ? recommendation.score >= 30 : false
}

export const getRecommendationScore = (result: RecommendationResult | null, criterionType: CriterionType): number => {
  if (!result) return 0
  const recommendation = result.recommendedCriteria.find(r => r.criterionType === criterionType)
  return recommendation?.score || 0
}
