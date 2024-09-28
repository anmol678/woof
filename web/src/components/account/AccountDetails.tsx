'use client'

import { useQuery } from '@tanstack/react-query'
import { Account } from '@/types'
import { AccountQuery } from '@/queries'
import Banner from '@/components/Banner'
import Loader from '@/components/Loader'

export default function AccountDetails({ accountNumber }: { accountNumber: string }) {
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

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-white p-4 shadow">
        <h2 className="mb-2 text-xl font-semibold">Account Balance</h2>
        {isLoading && <Loader data-style="accent" />}
        {isSuccess && <p className="text-2xl font-bold text-green-600">${accountDetails.balance.toFixed(2)}</p>}
        {isError && <Banner type="error" message={error?.message} />}
      </div>
    </div>
  )
}
