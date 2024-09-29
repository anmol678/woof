'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AccountQuery } from '@/queries'
import { Transfer } from '@/types'
import Loader from '@/components/Loader'
import Banner from '@/components/Banner'
import Button from '@/components/Button'
import { cn } from '@/utils/styles'
import PATHS from '@/utils/paths'

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

  const onTransferFromAccount = () => {
    router.push(`${PATHS.TRANSFER}?accountFrom=${accountNumber}`)
  }

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
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="border-b">
                  <td className="py-2">{transfer.timestamp}</td>
                  <td className="py-2 capitalize">{transfer.sender_account_number}</td>
                  <td className="py-2 capitalize">{transfer.receiver_account_number}</td>
                  <td
                    className={cn(
                      'py-2 text-right',
                      transfer.sender_account_number === accountNumber ? 'text-red-600' : 'text-green-600'
                    )}
                  >
                    ${Math.abs(transfer.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
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
