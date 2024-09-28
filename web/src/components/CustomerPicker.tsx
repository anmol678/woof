'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Customer } from '@/types'
import { CustomerQuery } from '@/queries'

interface CustomerPickerProps {
  selectedCustomer: string | null
  onSelectCustomer: (customerId: string) => void
}

export default function CustomerPicker({ selectedCustomer, onSelectCustomer }: CustomerPickerProps) {
  const router = useRouter()

  const { data: customers, isSuccess } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: CustomerQuery.getAll
  })

  const handleSelectCustomer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'create-new-customer') {
      router.push('/customers/create?redirect=create-account')
    } else {
      onSelectCustomer(e.target.value)
    }
  }

  return (
    <div className="space-y-4">
      {isSuccess && (
        <div>
          <select
            id="customer"
            value={selectedCustomer ?? ''}
            onChange={handleSelectCustomer}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Select one</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.customer_number}>
                {customer.name} - {customer.customer_number}
              </option>
            ))}
            <option value="create-new-customer">Create New Customer</option>
          </select>
        </div>
      )}
    </div>
  )
}
