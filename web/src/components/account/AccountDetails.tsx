'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Account } from '@/types'
import { AccountQuery } from '@/queries'
import Banner from '@/components/Banner'
import Loader from '@/components/Loader'
import PATHS from '@/utils/paths'

export default function AccountDetails({ accountNumber }: { accountNumber: string }) {
  const router = useRouter()

  const {
    data: accountDetails,
    isSuccess,
    isError,
    error,
    isLoading
  } = useQuery<Account>({
    queryKey: ['accounts', accountNumber],
    queryFn: () => AccountQuery.get(accountNumber)
  })

  const onViewCustomer = (customerNumber: string) => {
    router.push(`${PATHS.CUSTOMER_DETAILS}?customerNumber=${customerNumber}`)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-xl font-semibold">Account Balance</h2>
          {isSuccess && (
            <span className="link text-sm" onClick={() => onViewCustomer(accountDetails.customer_number)}>
              View Customer Details
            </span>
          )}
        </div>
        {isLoading && <Loader data-style="accent" />}
        {isSuccess && <p className="text-2xl font-bold text-green-600">${accountDetails.balance.toFixed(2)}</p>}
        {isError && <Banner type="error" message={error?.message} />}
      </div>
    </div>
  )
}
