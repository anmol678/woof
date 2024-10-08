'use client'

import { useMemo } from 'react'
import { useAccountRouting, useTransferRouting } from '@/hooks/useRouting'
import { useQuery } from '@tanstack/react-query'
import { AccountQuery } from '@/queries'
import { Transfer } from '@/types'
import Loader from '@/components/Loader'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import { cn } from '@/utils/styles'
import { formatDate } from '@/utils/date'

interface AccountTransfersProps {
  accountNumber: string
}

export default function AccountTransfers({ accountNumber }: AccountTransfersProps) {
  const { redirectToAccountDetails } = useAccountRouting()
  const { redirectToTransferDetails } = useTransferRouting()

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

  const renderTransfers = useMemo(() => {
    return transfers?.map((transfer) => (
      <tr key={transfer.id} className="border-b">
        <td className="py-2">{formatDate(transfer.timestamp)}</td>
        <td className="link py-2" onClick={() => redirectToAccountDetails(transfer.sender_account_number)}>
          {transfer.sender_account_number}
        </td>
        <td className="link py-2" onClick={() => redirectToAccountDetails(transfer.receiver_account_number)}>
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
  }, [transfers, accountNumber, redirectToAccountDetails])

  return (
    <div className="card">
      <h2>Transfer History</h2>
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
          <Button
            data-style="primary"
            data-size="small"
            className="mt-4"
            onClick={() => redirectToTransferDetails({ from: accountNumber })}
          >
            Transfer
          </Button>
        </>
      )}
      {isError && <Alert type="error" message={error?.message} />}
    </div>
  )
}
