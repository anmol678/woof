'use client'

import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AccountQuery } from '@/queries'
import { Transfer } from '@/types'
import Loader from '@/components/Loader'
import Banner from '@/components/Banner'
import Button from '@/components/Button'
import { cn } from '@/utils/styles'
import PATHS from '@/utils/paths'
import { formatDate } from '@/utils/date'

export default function AccountTransfers({ accountNumber }: { accountNumber: string }) {
  const router = useRouter()

  const {
    data: transfers,
    isSuccess,
    isError,
    error,
    isLoading
  } = useQuery<Transfer[]>({
    queryKey: ['transfers', accountNumber],
    queryFn: () => AccountQuery.getTransfers(accountNumber)
  })

  const onViewAccount = useCallback(
    (accountNumber: string) => {
      router.push(`${PATHS.ACCOUNT_DETAILS}?accountNumber=${accountNumber}`)
    },
    [router]
  )

  const onTransferFromAccount = useCallback(() => {
    router.push(`${PATHS.TRANSFER}?accountFrom=${accountNumber}`)
  }, [router, accountNumber])

  const renderTransfers = useMemo(() => {
    return transfers?.map((transfer) => (
      <tr key={transfer.id} className="border-b">
        <td className="py-2">{formatDate(transfer.timestamp)}</td>
        <td
          className="cursor-pointer py-2 text-blue-500 hover:text-blue-600 hover:underline"
          onClick={() => onViewAccount(transfer.sender_account_number)}
        >
          {transfer.sender_account_number}
        </td>
        <td
          className="cursor-pointer py-2 text-blue-500 hover:text-blue-600 hover:underline"
          onClick={() => onViewAccount(transfer.receiver_account_number)}
        >
          {transfer.receiver_account_number}
        </td>
        <td
          className={cn(
            'py-2 text-right',
            transfer.sender_account_number === accountNumber ? 'text-red-600' : 'text-green-600'
          )}
        >
          ${transfer.amount.toFixed(2)}
        </td>
      </tr>
    ))
  }, [transfers, accountNumber, onViewAccount])

  return (
    <div className="rounded-md bg-white p-4 shadow">
      <h2 className="mb-2 text-xl font-semibold">Transfer History</h2>
      {isLoading && <Loader data-style="accent" />}
      {isSuccess && (
        <>
          <table className="my-4 w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Sender</th>
                <th className="py-2 text-left">Receiver</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 && (
                <tr>
                  <td colSpan={4} className="pb-3 pt-6 text-center text-gray-500">
                    No transfers found
                  </td>
                </tr>
              )}
              {renderTransfers}
            </tbody>
          </table>
          <Button data-style="primary" data-size="small" className="mt-4" onClick={onTransferFromAccount}>
            Transfer
          </Button>
        </>
      )}
      {isError && <Banner type="error" message={error?.message} />}
    </div>
  )
}
