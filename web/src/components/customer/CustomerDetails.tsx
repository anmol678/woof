'use client'

import { useQuery } from '@tanstack/react-query'
import { Customer } from '@/types'
import { CustomerQuery } from '@/queries'
import Banner from '@/components/Banner'
import Loader from '@/components/Loader'

export default function CustomerDetails({ customerNumber }: { customerNumber: string }) {
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
        {isError && <Banner type="error" message={error?.message} />}
      </div>
    </div>
  )
}
