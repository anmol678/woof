'use client'

import { useQuery } from '@tanstack/react-query'
import { useCustomerRouting } from '@/hooks/useRouting'
import { Customer } from '@/types'
import { CustomerQuery } from '@/queries'
import Banner from '@/components/Banner'
import Loader from '@/components/Loader'
import Picker from '@/components/Picker'
import Routes from '@/utils/routes'

interface CustomerPickerProps {
  selectedCustomer: string | null
  onSelectCustomer: (customerNumber: string | null) => void
}

function customerToString(customer: Customer): string {
  return `${customer.name} - ${customer.customer_number}`
}

export default function CustomerPicker({ selectedCustomer, onSelectCustomer }: CustomerPickerProps) {
  const { redirectToCreateCustomer } = useCustomerRouting()
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
      const route = window.location.pathname as Routes
      const isRedirect = Object.values(Routes).includes(route)
      redirectToCreateCustomer(isRedirect ? route : undefined)
    } else {
      onSelectCustomer(customerNumber)
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="w-full rounded-md border bg-background p-2.5">
          <Loader data-style="accent" />
        </div>
      ) : null}
      {isSuccess ? (
        <Picker
          options={customers}
          getOptionLabel={customerToString}
          getOptionValue={(customer) => customer.customer_number}
          selectedOption={selectedCustomer}
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
