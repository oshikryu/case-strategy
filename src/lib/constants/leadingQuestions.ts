type CriterionType =
  | 'awards'
  | 'contributions'
  | 'criticalEmployment'
  | 'remuneration'
  | 'judging'
  | 'membership'
  | 'publishedMaterial'
  | 'authorship'
  | 'professionalConnections'

type LeadingQuestionsConfig = {
  [criterion in CriterionType]?: {
    [fieldId: string]: string[]
  }
}

const leadingQuestionsConfig: LeadingQuestionsConfig = {
  awards: {
    description: [
      'What specific achievement was recognized by this award?',
      'How competitive was this award? How many candidates were considered?',
      'What made you stand out among the other candidates?',
    ],
    significance: [
      'How prestigious is this award within your field?',
      'How does this award demonstrate extraordinary ability?',
      'What is the reputation of the granting organization?',
    ],
  },
  contributions: {
    description: [
      'What specific problem did your contribution solve?',
      'What was novel or innovative about your approach?',
      'How was this contribution developed?',
    ],
    impact: [
      'How widely has your contribution been adopted?',
      'What measurable impact has it had on the field?',
      'How has it influenced subsequent work in your area?',
    ],
    recognition: [
      'How has this contribution been acknowledged by experts?',
      'Has it been cited or referenced in significant publications?',
      'Have you received endorsements from recognized experts?',
    ],
  },
  criticalEmployment: {
    responsibilities: [
      'What key decisions do you make in this role?',
      'What is the scope of your authority?',
      'How many people or projects do you oversee?',
    ],
    criticalNature: [
      'What would happen if this position remained unfilled?',
      'Why couldn\'t someone else easily perform this role?',
      'How does this role directly impact organizational success?',
    ],
  },
  remuneration: {
    comparativeData: [
      'What percentile does your compensation fall within?',
      'What industry benchmarks support this comparison?',
      'How does your salary compare to peers with similar experience?',
    ],
  },
  judging: {
    context: [
      'Why were you specifically invited to serve as a judge?',
      'What expertise qualified you for this role?',
      'How prestigious is this judging opportunity?',
    ],
  },
  membership: {
    requirements: [
      'What specific achievements are required for membership?',
      'How selective is the admission process?',
      'What is the acceptance rate for applicants?',
    ],
    achievements: [
      'What leadership roles have you held within the organization?',
      'What contributions have you made as a member?',
      'How have you been recognized within the organization?',
    ],
  },
  publishedMaterial: {
    circulation: [
      'What is the publication\'s readership or audience size?',
      'How prestigious is this publication in your field?',
      'What is the reach and influence of this coverage?',
    ],
  },
  authorship: {
    coauthors: [
      'What was your specific contribution to this work?',
      'Are any co-authors recognized experts in the field?',
      'What role did you play in the research/writing process?',
    ],
  },
  professionalConnections: {
    professionalAchievements: [
      'What awards or recognition has this person received?',
      'What leadership positions do they hold?',
      'How are they recognized in their field?',
    ],
    fieldRelevance: [
      'How does their expertise relate to your work?',
      'How will USCIS view their letter\'s weight?',
      'How familiar are they with your contributions?',
    ],
  },
}

export function getLeadingQuestions(
  criterionType: CriterionType,
  fieldId: string
): string[] | undefined {
  return leadingQuestionsConfig[criterionType]?.[fieldId]
}

export { leadingQuestionsConfig }
export type { CriterionType }
