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
      <div className="rounded-md bg-white p-4 shadow">
        <h2 className="mb-2 text-xl font-semibold">Customer Details</h2>
        {isLoading && <Loader data-style="accent" />}
        {isSuccess && <p className="text-xl font-semibold">{customerDetails.name}</p>}
        {isError && <Banner type="error" message={error?.message} />}
      </div>
    </div>
  )
}
