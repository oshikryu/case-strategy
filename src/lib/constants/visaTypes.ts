import { VisaType } from '@/types'

export const visaTypeOptions = [
  { value: VisaType.NONE, label: 'No current visa' },
  { value: VisaType.B1_B2, label: 'B-1/B-2 (Visitor)' },
  { value: VisaType.F1, label: 'F-1 (Student)' },
  { value: VisaType.H1B, label: 'H-1B (Specialty Occupation)' },
  { value: VisaType.J1, label: 'J-1 (Exchange Visitor)' },
  { value: VisaType.L1, label: 'L-1 (Intracompany Transferee)' },
  { value: VisaType.E2, label: 'E-2 (Treaty Investor)' },
  { value: VisaType.TN, label: 'TN (NAFTA Professional)' },
  { value: VisaType.OTHER, label: 'Other' },
]
