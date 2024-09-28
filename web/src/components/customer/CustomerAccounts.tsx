'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { CustomerQuery } from '@/queries'
import { Account } from '@/types'
import Loader from '@/components/Loader'
import Banner from '@/components/Banner'
import Button from '@/components/Button'

export default function CustomerAccounts({ customerNumber }: { customerNumber: string }) {
  const router = useRouter()

  const {
    data: accounts,
    isSuccess,
    isError,
    error,
    isLoading
  } = useQuery<Account[]>({
    queryKey: ['accounts', customerNumber],
    queryFn: () => CustomerQuery.getAccounts(customerNumber)
  })

  const onCreateAccount = () => {
    router.push(`/accounts/create?customerNumber=${customerNumber}&redirect=customer`)
  }

  const onViewAccount = (accountNumber: string) => {
    router.push(`/accounts?accountNumber=${accountNumber}`)
  }

  return (
    <div className="rounded-md bg-white p-4 shadow">
      <h2 className="mb-2 text-xl font-semibold">Accounts</h2>
      {isLoading && <Loader data-style="accent" />}
      {isSuccess && (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Account Number</th>
              <th className="py-2 text-left">Balance</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && (
              <tr>
                <td colSpan={3} className="pb-3 pt-6 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-4">
                    <p>No accounts yet</p>
                    <Button data-style="action" onClick={onCreateAccount}>
                      Create Account
                    </Button>
                  </div>
                </td>
              </tr>
            )}
            {accounts.map((account) => (
              <tr key={account.id} className="border-b">
                <td className="py-2">{account.account_number}</td>
                <td className="py-2 capitalize">${account.balance.toFixed(2)}</td>
                <td className="flex justify-end gap-2 py-2">
                  <Button data-style="action" data-size="small" onClick={() => onViewAccount(account.account_number)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isError && <Banner type="error" message={error?.message} />}
    </div>
  )
}
