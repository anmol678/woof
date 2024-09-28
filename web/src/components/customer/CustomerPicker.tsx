'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Customer } from '@/types'
import { CustomerQuery } from '@/queries'
import Banner from '@/components/Banner'
import Loader from '@/components/Loader'
import Picker from '@/components/Picker'

interface CustomerPickerProps {
  selectedCustomer: string | null
  onSelectCustomer: (customerNumber: string | null) => void
}

function customerToString(customer: Customer): string {
  return `${customer.name} - ${customer.customer_number}`
}

export default function CustomerPicker({
  selectedCustomer: selectedCustomerNumber,
  onSelectCustomer
}: CustomerPickerProps) {
  const router = useRouter()
  const createCustomerId = 'create-new-customer'

  const {
    data: customers,
    isSuccess,
    isError,
    error,
    isLoading
  } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: CustomerQuery.getAll
  })

  const handleSelectCustomer = (customerNumber: string | null) => {
    if (customerNumber === createCustomerId) {
      router.push(`/customers/create?redirect=create-account`)
    } else {
      onSelectCustomer(customerNumber)
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="w-full rounded border bg-background p-2.5">
          <Loader data-style="accent" />
        </div>
      ) : null}
      {isSuccess ? (
        <Picker
          options={customers}
          getOptionLabel={customerToString}
          getOptionValue={(customer) => customer.customer_number}
          selectedOption={selectedCustomerNumber}
          onSelect={handleSelectCustomer}
          placeholder="Search customers..."
          createNewOption={{
            label: 'Create New Customer',
            value: createCustomerId
          }}
        />
      ) : null}
      {isError && <Banner type="error" message={error?.message} />}
    </div>
  )
}
