import { CriterionType } from '@/types'

export interface CriterionDefinition {
  id: CriterionType
  title: string
  shortDescription: string
  fullDescription: string
  examples: string[]
  commonality: number // 1-8, lower = more commonly accepted
}

// Sorted by commonality (most commonly accepted first)
export const criteriaDefinitions: CriterionDefinition[] = [
  {
    id: 'awards',
    title: 'Awards',
    shortDescription: 'Nationally or internationally recognized prizes or awards',
    fullDescription:
      'Documentation of receipt of lesser nationally or internationally recognized prizes or awards for excellence in the field of endeavor.',
    examples: [
      'Industry awards (e.g., Emmy, Grammy, Oscar equivalents in your field)',
      'Best paper awards at major conferences',
      'Government or foundation grants for exceptional work',
      'Company-wide recognition awards for outstanding contributions',
    ],
    commonality: 1,
  },
  {
    id: 'membership',
    title: 'Membership',
    shortDescription: 'Membership in associations requiring outstanding achievement',
    fullDescription:
      'Documentation of membership in associations in the field which require outstanding achievements as judged by recognized experts.',
    examples: [
      'Fellow status in professional societies (IEEE Fellow, ACM Fellow)',
      'Invitation-only membership organizations',
      'Boards of directors for industry associations',
      'Advisory committees requiring expertise',
    ],
    commonality: 2,
  },
  {
    id: 'publishedMaterial',
    title: 'Published Material',
    shortDescription: 'Published material about you in major media',
    fullDescription:
      'Published material in professional or major trade publications or major media about the person and their work.',
    examples: [
      'Feature articles in major newspapers (NYT, WSJ, etc.)',
      'Profiles in industry publications',
      'Interviews in trade magazines',
      'Coverage by major online tech publications',
    ],
    commonality: 3,
  },
  {
    id: 'judging',
    title: 'Judging',
    shortDescription: 'Participation as a judge of others\' work',
    fullDescription:
      'Evidence of participation as a judge of the work of others, either individually or on a panel.',
    examples: [
      'Peer reviewer for academic journals',
      'Grant proposal reviewer (NSF, NIH, etc.)',
      'Judge at industry competitions or hackathons',
      'Technical committee member for conferences',
    ],
    commonality: 4,
  },
  {
    id: 'contributions',
    title: 'Original Contributions',
    shortDescription: 'Original contributions of major significance',
    fullDescription:
      'Evidence of original scientific, scholarly, or business-related contributions of major significance in the field.',
    examples: [
      'Patents with significant commercial impact',
      'Open-source projects widely adopted in industry',
      'Novel algorithms or methodologies cited by others',
      'Products or features used by millions of users',
    ],
    commonality: 5,
  },
  {
    id: 'authorship',
    title: 'Scholarly Articles',
    shortDescription: 'Authorship of scholarly articles',
    fullDescription:
      'Evidence of authorship of scholarly articles in professional journals or other major media.',
    examples: [
      'Peer-reviewed journal publications',
      'Conference papers at top venues',
      'Technical books or book chapters',
      'Widely-cited blog posts or technical articles',
    ],
    commonality: 6,
  },
  {
    id: 'criticalEmployment',
    title: 'Critical Employment',
    shortDescription: 'Employment in a critical or essential capacity',
    fullDescription:
      'Evidence of employment in a critical or essential capacity for organizations with a distinguished reputation.',
    examples: [
      'Lead engineer or architect for major products',
      'Department head or VP at notable companies',
      'Founding team member of successful startups',
      'Key contributor to mission-critical systems',
    ],
    commonality: 7,
  },
  {
    id: 'remuneration',
    title: 'High Remuneration',
    shortDescription: 'High salary or remuneration compared to others',
    fullDescription:
      'Evidence of commanding a high salary or other significantly high remuneration for services.',
    examples: [
      'Salary in top 10% for your role and location',
      'Significant equity compensation',
      'Large signing bonuses',
      'High consulting fees or speaking honorariums',
    ],
    commonality: 8,
  },
]

export const getCriterionDefinition = (id: CriterionType): CriterionDefinition | undefined => {
  return criteriaDefinitions.find((c) => c.id === id)
}
