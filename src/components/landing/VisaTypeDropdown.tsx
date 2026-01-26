'use client'

import { forwardRef, SelectHTMLAttributes } from 'react'
import { Select } from '@/components/ui'
import { visaTypeOptions } from '@/lib/constants'

export interface VisaTypeDropdownProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
  error?: string
}

export const VisaTypeDropdown = forwardRef<HTMLSelectElement, VisaTypeDropdownProps>(
  ({ error, ...props }, ref) => {
    return (
      <Select
        ref={ref}
        label="Current Visa Status"
        options={visaTypeOptions}
        placeholder="Select your current visa status"
        error={error}
        {...props}
      />
    )
  }
)

VisaTypeDropdown.displayName = 'VisaTypeDropdown'
