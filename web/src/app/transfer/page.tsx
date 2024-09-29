'use client'

import { useState } from 'react'
import { useAccountRouting } from '@/hooks/useRouting'
import { useSyncedState } from '@/hooks/useSyncedState'
import { useMutationHandler } from '@/hooks/useMutationHandler'
import { TransferQuery } from '@/queries'
import { Transfer, TransferCreate } from '@/types'
import BackButton from '@/components/BackButton'
import AccountPicker from '@/components/account/AccountPicker'
import Button from '@/components/Button'
import Banner from '@/components/Banner'
import Params from '@/utils/params'

export default function TransferPage() {
  const { redirectToAccountDetails } = useAccountRouting()

  const [fromAccount, setFromAccount] = useSyncedState<string | null>(Params.TRANSFER_FROM, null)
  const [toAccount, setToAccount] = useSyncedState<string | null>(Params.TRANSFER_TO, null)
  const [amount, setAmount] = useState<number>(0)

  const mutation = useMutationHandler<Transfer, TransferCreate, Error>({
    mutationFn: TransferQuery.create,
    invalidateQuery: ['transfers']
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fromAccount || !toAccount) {
      alert('Please select an account')
      return
    }

    const transferCreate: TransferCreate = {
      sender_account_number: fromAccount,
      receiver_account_number: toAccount,
      amount
    }

    mutation.mutate(transferCreate, {
      onSuccess: () => {}
    })
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton />
      <h1>Transfer Funds</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="fromAccount">From Account</label>
            {fromAccount && (
              <span className="link text-sm" onClick={() => redirectToAccountDetails(fromAccount)}>
                View Details
              </span>
            )}
          </div>
          <AccountPicker selectedAccount={fromAccount} onSelectAccount={setFromAccount} />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="toAccount">To Account</label>
            {toAccount && (
              <span className="link text-sm" onClick={() => redirectToAccountDetails(toAccount)}>
                View Details
              </span>
            )}
          </div>
          <AccountPicker selectedAccount={toAccount} onSelectAccount={setToAccount} autoFocus={fromAccount !== null} />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            min="0.01"
            step="0.01"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full" data-style="primary">
          Transfer Funds
        </Button>
      </form>
      <div>
        {mutation.isSuccess && <Banner type="success" message={`Transfer successful`} />}
        {mutation.isError && <Banner type="error" message={mutation.error?.message} />}
      </div>
    </div>
  )
}
