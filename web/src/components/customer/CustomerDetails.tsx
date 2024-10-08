'use client'

import { useQuery } from '@tanstack/react-query'
import { Customer } from '@/types'
import { CustomerQuery } from '@/queries'
import Alert from '@/components/Alert'
import Loader from '@/components/Loader'

interface CustomerDetailsProps {
  customerNumber: string
}

export default function CustomerDetails({ customerNumber }: CustomerDetailsProps) {
  const {
    data: customerDetails,
    isSuccess,
    isError,
    error,
    isLoading
  } = useQuery<Customer>({
    queryKey: ['customers', customerNumber],
    queryFn: () => CustomerQuery.get(customerNumber)
  })

  return (
    <div className="space-y-6">
      <div className="card">
        <h2>Customer Information</h2>
        {isLoading && <Loader data-style="accent" />}
        {isSuccess && <p className="text-lg font-medium">Name: {customerDetails.name}</p>}
        {isError && <Alert type="error" message={error?.message} />}
      </div>
    </div>
  )
}
