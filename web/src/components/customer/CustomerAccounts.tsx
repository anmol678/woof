'use client'

import { useMemo, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { CustomerQuery } from '@/queries'
import { Account } from '@/types'
import Loader from '@/components/Loader'
import Banner from '@/components/Banner'
import Button from '@/components/Button'
import PATHS from '@/utils/paths'

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

  const onCreateAccount = useCallback(() => {
    router.push(`${PATHS.CREATE_ACCOUNT}?customerNumber=${customerNumber}&redirect=${PATHS.CUSTOMER_DETAILS}`)
  }, [router, customerNumber])

  const onViewAccount = useCallback(
    (accountNumber: string) => {
      router.push(`${PATHS.ACCOUNT_DETAILS}?accountNumber=${accountNumber}`)
    },
    [router]
  )

  const onTransferFromAccount = useCallback(
    (accountNumber: string) => {
      router.push(`${PATHS.TRANSFER}?accountFrom=${accountNumber}`)
    },
    [router]
  )

  const renderAccounts = useMemo(
    () =>
      accounts?.map((account) => (
        <tr key={account.id} className="border-b">
          <td className="link py-2" onClick={() => onViewAccount(account.account_number)}>
            {account.account_number}
          </td>
          <td className="py-2 capitalize">${account.balance.toFixed(2)}</td>
          <td className="flex justify-end gap-2 py-2">
            <Button
              data-style="primary"
              data-size="small"
              onClick={() => onTransferFromAccount(account.account_number)}
            >
              Transfer
            </Button>
          </td>
        </tr>
      )),
    [accounts, onTransferFromAccount, onViewAccount]
  )

  return (
    <div className="rounded-md bg-background p-4 shadow">
      <h2 className="mb-2 text-xl font-semibold">Accounts</h2>
      {isLoading && <Loader data-style="accent" />}
      {isSuccess && (
        <>
          <table className="my-4 w-full">
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
                    <p>No accounts found</p>
                  </td>
                </tr>
              )}
              {renderAccounts}
            </tbody>
          </table>
          <Button data-style="action" data-size="small" className="mt-4" onClick={onCreateAccount}>
            Create Account
          </Button>
        </>
      )}
      {isError && <Banner type="error" message={error?.message} />}
    </div>
  )
}
