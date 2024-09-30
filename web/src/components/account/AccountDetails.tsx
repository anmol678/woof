'use client'

import { useCustomerRouting } from '@/hooks/useRouting'
import { useQuery } from '@tanstack/react-query'
import { Account } from '@/types'
import { AccountQuery } from '@/queries'
import Alert from '@/components/Alert'
import Loader from '@/components/Loader'

interface AccountDetailsProps {
  accountNumber: string
}

export default function AccountDetails({ accountNumber }: AccountDetailsProps) {
  const { redirectToCustomerDetails } = useCustomerRouting()

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
      <div className="card">
        <div className="flex items-center justify-between">
          <h2>Account Balance</h2>
          {isSuccess && (
            <span className="link text-sm" onClick={() => redirectToCustomerDetails(accountDetails.customer_number)}>
              View Customer Details
            </span>
          )}
        </div>
        {isLoading && <Loader data-style="accent" />}
        {isSuccess && <p className="text-2xl font-bold text-green-600">${accountDetails.balance.toFixed(2)}</p>}
        {isError && <Alert type="error" message={error?.message} />}
      </div>
    </div>
  )
}
