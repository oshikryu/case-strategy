'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'
import { PassportUpload } from './PassportUpload'
import { VisaTypeDropdown } from './VisaTypeDropdown'
import { useApplicationStore } from '@/lib/stores/useApplicationStore'
import { VisaType } from '@/types'

const demographicsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  countryOfBirth: z.string().min(1, 'Country of birth is required'),
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  zipCode: z.string().min(1, 'ZIP/Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  currentVisaType: z.nativeEnum(VisaType, {
    errorMap: () => ({ message: 'Please select a visa type' }),
  }),
  passportImage: z.string().optional(),
})

type DemographicsFormData = z.infer<typeof demographicsSchema>

export function DemographicForm() {
  const router = useRouter()
  const { demographics, setDemographics } = useApplicationStore()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DemographicsFormData>({
    resolver: zodResolver(demographicsSchema),
    defaultValues: demographics || {
      firstName: '',
      middleName: '',
      lastName: '',
      countryOfBirth: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      currentVisaType: undefined,
      passportImage: undefined,
    },
  })

  const onSubmit = (data: DemographicsFormData) => {
    setDemographics(data)
    router.push('/criteria')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Legal Name</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Middle Name"
            placeholder="William"
            error={errors.middleName?.message}
            {...register('middleName')}
          />
          <Input
            label="Last Name"
            placeholder="Smith"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
      </div>

      {/* Country of Birth */}
      <Input
        label="Country of Birth"
        placeholder="United Kingdom"
        error={errors.countryOfBirth?.message}
        {...register('countryOfBirth')}
      />

      {/* Address Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Address</h3>
        <div className="space-y-4">
          <Input
            label="Street Address"
            placeholder="123 Main St, Apt 4B"
            error={errors.streetAddress?.message}
            {...register('streetAddress')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="San Francisco"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="State/Province"
              placeholder="California"
              error={errors.state?.message}
              {...register('state')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="ZIP/Postal Code"
              placeholder="94102"
              error={errors.zipCode?.message}
              {...register('zipCode')}
            />
            <Input
              label="Country"
              placeholder="United States"
              error={errors.country?.message}
              {...register('country')}
            />
          </div>
        </div>
      </div>

      {/* Visa Status */}
      <Controller
        name="currentVisaType"
        control={control}
        render={({ field }) => (
          <VisaTypeDropdown
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.currentVisaType?.message}
          />
        )}
      />

      {/* Passport Upload */}
      <Controller
        name="passportImage"
        control={control}
        render={({ field }) => (
          <PassportUpload
            value={field.value}
            onChange={field.onChange}
            error={errors.passportImage?.message}
          />
        )}
      />

      {/* Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Continue to Criteria Selection
        </Button>
      </div>
    </form>
  )
}
