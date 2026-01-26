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
  country: z.string().min(1, 'Country is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  stateOrRegion: z.string().optional(),
  postalCode: z.string().optional(),
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
      country: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateOrRegion: '',
      postalCode: '',
      currentVisaType: undefined,
      passportImage: undefined,
    },
  })

  const onSubmit = (data: DemographicsFormData) => {
    setDemographics(data)
    router.push('/recommendations')
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
            label="Country of Residence"
            placeholder="e.g., Japan, Germany, Brazil"
            error={errors.country?.message}
            {...register('country')}
          />
          <Input
            label="Address Line 1"
            placeholder="Street address, P.O. box, or company name"
            error={errors.addressLine1?.message}
            {...register('addressLine1')}
          />
          <Input
            label="Address Line 2 (Optional)"
            placeholder="Apartment, suite, unit, building, floor, etc."
            error={errors.addressLine2?.message}
            {...register('addressLine2')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City / Town"
              placeholder="e.g., Tokyo, Berlin, São Paulo"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="State / Province / Region (Optional)"
              placeholder="e.g., Saitama, Bavaria, Rio de Janeiro"
              error={errors.stateOrRegion?.message}
              {...register('stateOrRegion')}
            />
          </div>
          <Input
            label="Postal / ZIP Code (Optional)"
            placeholder="e.g., 150-0001, 80331, 20040-020"
            helperText="Leave blank if your country does not use postal codes"
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
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
          Continue
        </Button>
      </div>
    </form>
  )
}
