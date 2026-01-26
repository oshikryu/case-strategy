import { VisaType, VisaCategory } from '@/types'

export interface VisaOption {
  value: VisaType
  label: string
  description: string
  category: VisaCategory
}

export const visaCategoryDescriptions: Record<VisaCategory, { title: string; description: string }> = {
  none: {
    title: 'No Current Visa',
    description: 'Select this if you are not currently in the United States or do not hold a valid U.S. visa.',
  },
  nonimmigrant: {
    title: 'Nonimmigrant Visa',
    description: 'Temporary visas for people visiting the U.S. for a specific purpose and limited time period, such as tourism, study, work, or business. You must maintain intent to return to your home country.',
  },
  immigrant: {
    title: 'Immigrant Visa',
    description: 'Visas for people intending to live permanently in the United States. These lead to lawful permanent resident status (Green Card).',
  },
}

export const visaTypeOptions: VisaOption[] = [
  // No visa
  {
    value: VisaType.NONE,
    label: 'No current visa',
    description: 'Not currently in the U.S. or no valid visa status',
    category: 'none',
  },

  // Nonimmigrant Visas - Visitor/Transit
  {
    value: VisaType.B1,
    label: 'B-1 (Business Visitor)',
    description: 'Temporary business activities, conferences, consultations',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.B2,
    label: 'B-2 (Tourism/Medical)',
    description: 'Vacation, pleasure travel, or medical treatment',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.B1_B2,
    label: 'B-1/B-2 (Business/Tourism)',
    description: 'Combined business and tourism visitor visa',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.C,
    label: 'C (Transit)',
    description: 'Passing through the U.S. to another destination',
    category: 'nonimmigrant',
  },

  // Nonimmigrant Visas - Work
  {
    value: VisaType.H1B,
    label: 'H-1B (Specialty Occupation)',
    description: 'Professional work requiring specialized knowledge and degree',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.H2A,
    label: 'H-2A (Agricultural Worker)',
    description: 'Temporary or seasonal agricultural work',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.H2B,
    label: 'H-2B (Temporary Worker)',
    description: 'Temporary non-agricultural seasonal work',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.H3,
    label: 'H-3 (Trainee)',
    description: 'Training programs not primarily for employment',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.L1,
    label: 'L-1 (Intracompany Transferee)',
    description: 'Managers, executives, or specialized knowledge employees transferring within same company',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.O1,
    label: 'O-1 (Extraordinary Ability)',
    description: 'Individuals with extraordinary ability in sciences, arts, education, business, or athletics',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.P,
    label: 'P (Athletes/Entertainers)',
    description: 'Internationally recognized athletes, entertainers, and performers',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.R1,
    label: 'R-1 (Religious Worker)',
    description: 'Temporary religious workers and ministers',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.TN,
    label: 'TN (USMCA Professional)',
    description: 'Canadian and Mexican professionals under USMCA (formerly NAFTA)',
    category: 'nonimmigrant',
  },

  // Nonimmigrant Visas - Treaty
  {
    value: VisaType.E1,
    label: 'E-1 (Treaty Trader)',
    description: 'Substantial trade between U.S. and treaty country',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.E2,
    label: 'E-2 (Treaty Investor)',
    description: 'Substantial investment in a U.S. business',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.E3,
    label: 'E-3 (Australian Specialty)',
    description: 'Australian nationals in specialty occupations',
    category: 'nonimmigrant',
  },

  // Nonimmigrant Visas - Student/Exchange
  {
    value: VisaType.F1,
    label: 'F-1 (Academic Student)',
    description: 'Full-time students at accredited universities, colleges, or language programs',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.M1,
    label: 'M-1 (Vocational Student)',
    description: 'Students in vocational or non-academic programs',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.J1,
    label: 'J-1 (Exchange Visitor)',
    description: 'Research scholars, professors, au pairs, and exchange program participants',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.Q,
    label: 'Q (Cultural Exchange)',
    description: 'International cultural exchange programs',
    category: 'nonimmigrant',
  },

  // Nonimmigrant Visas - Family
  {
    value: VisaType.K1,
    label: 'K-1 (Fiancé(e))',
    description: 'Fiancé(e) of U.S. citizen, must marry within 90 days',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.K3,
    label: 'K-3 (Spouse of Citizen)',
    description: 'Spouse of U.S. citizen awaiting immigrant visa processing',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.V,
    label: 'V (Family of LPR)',
    description: 'Spouse and children of lawful permanent residents',
    category: 'nonimmigrant',
  },

  // Nonimmigrant Visas - Other
  {
    value: VisaType.A,
    label: 'A (Diplomat)',
    description: 'Foreign government officials and diplomats',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.G,
    label: 'G (International Organization)',
    description: 'Representatives to international organizations (UN, World Bank, etc.)',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.I,
    label: 'I (Media/Journalist)',
    description: 'Foreign press, radio, film, and media representatives',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.D,
    label: 'D (Crewmember)',
    description: 'Ship or aircraft crew members',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.T,
    label: 'T (Trafficking Victim)',
    description: 'Victims of human trafficking',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.U,
    label: 'U (Crime Victim)',
    description: 'Victims of certain crimes who assist law enforcement',
    category: 'nonimmigrant',
  },
  {
    value: VisaType.OTHER_NONIMMIGRANT,
    label: 'Other Nonimmigrant Visa',
    description: 'Other temporary visa not listed above',
    category: 'nonimmigrant',
  },

  // Immigrant Visas - Family-Based
  {
    value: VisaType.IR1,
    label: 'IR-1 (Spouse of Citizen)',
    description: 'Immediate relative - spouse of U.S. citizen',
    category: 'immigrant',
  },
  {
    value: VisaType.CR1,
    label: 'CR-1 (Conditional Spouse)',
    description: 'Conditional resident - spouse married less than 2 years',
    category: 'immigrant',
  },
  {
    value: VisaType.F1_IMM,
    label: 'F1 (Adult Children of Citizens)',
    description: 'Unmarried adult children of U.S. citizens',
    category: 'immigrant',
  },
  {
    value: VisaType.F2A,
    label: 'F2A (Spouse/Children of LPR)',
    description: 'Spouse and minor children of permanent residents',
    category: 'immigrant',
  },
  {
    value: VisaType.F2B,
    label: 'F2B (Adult Children of LPR)',
    description: 'Unmarried adult children of permanent residents',
    category: 'immigrant',
  },
  {
    value: VisaType.F3,
    label: 'F3 (Married Children of Citizens)',
    description: 'Married adult children of U.S. citizens',
    category: 'immigrant',
  },
  {
    value: VisaType.F4,
    label: 'F4 (Siblings of Citizens)',
    description: 'Brothers and sisters of adult U.S. citizens',
    category: 'immigrant',
  },

  // Immigrant Visas - Employment-Based
  {
    value: VisaType.EB1,
    label: 'EB-1 (Priority Workers)',
    description: 'Extraordinary ability, outstanding professors/researchers, multinational managers',
    category: 'immigrant',
  },
  {
    value: VisaType.EB2,
    label: 'EB-2 (Advanced Degree)',
    description: 'Professionals with advanced degrees or exceptional ability',
    category: 'immigrant',
  },
  {
    value: VisaType.EB3,
    label: 'EB-3 (Skilled Workers)',
    description: 'Skilled workers, professionals, and other workers',
    category: 'immigrant',
  },
  {
    value: VisaType.EB4,
    label: 'EB-4 (Special Immigrants)',
    description: 'Religious workers, certain government employees, and other special categories',
    category: 'immigrant',
  },
  {
    value: VisaType.EB5,
    label: 'EB-5 (Investor)',
    description: 'Immigrant investors creating U.S. jobs',
    category: 'immigrant',
  },

  // Immigrant Visas - Other
  {
    value: VisaType.DV,
    label: 'DV (Diversity Visa)',
    description: 'Diversity lottery program winners',
    category: 'immigrant',
  },
  {
    value: VisaType.SB,
    label: 'SB (Returning Resident)',
    description: 'Returning lawful permanent residents',
    category: 'immigrant',
  },
  {
    value: VisaType.OTHER_IMMIGRANT,
    label: 'Other Immigrant Visa',
    description: 'Other immigrant visa not listed above',
    category: 'immigrant',
  },
]

export const getVisaOptionsByCategory = (category: VisaCategory): VisaOption[] => {
  return visaTypeOptions.filter((option) => option.category === category)
}

export const getVisaOption = (value: VisaType): VisaOption | undefined => {
  return visaTypeOptions.find((option) => option.value === value)
}
