'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TransferQuery } from '@/queries'
import { Transfer, TransferCreate } from '@/types'
import BackButton from '@/components/BackButton'
import AccountPicker from '@/components/account/AccountPicker'
import Button from '@/components/Button'
import Banner from '@/components/Banner'
import PATHS from '@/utils/paths'

export default function TransferPage({ searchParams }: { searchParams: { accountFrom: string; accountTo: string } }) {
  const router = useRouter()

  const queryClient = useQueryClient()

  const [fromAccount, setFromAccount] = useState<string | null>(null)
  const [toAccount, setToAccount] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)

  useEffect(() => {
    if (searchParams.accountFrom) {
      setFromAccount(searchParams.accountFrom)
    }
  }, [searchParams.accountFrom])

  useEffect(() => {
    if (searchParams.accountTo) {
      setToAccount(searchParams.accountTo)
    }
  }, [searchParams.accountTo])

  const mutation = useMutation<Transfer, Error, TransferCreate>({
    mutationFn: TransferQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fromAccount || !toAccount) {
      alert('Please select an account')
      return
    }

    mutation.mutate(
      { sender_account_number: fromAccount, receiver_account_number: toAccount, amount },
      {
        onSuccess: () => {}
      }
    )
  }

  const onViewAccount = (accountNumber: string) => {
    router.push(`${PATHS.ACCOUNT_DETAILS}?accountNumber=${accountNumber}`)
  }

  const setAccount = (
    accountNumber: string | null,
    paramName: string,
    setter: (accountNumber: string | null) => void
  ) => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    if (accountNumber) {
      urlSearchParams.set(paramName, accountNumber)
    } else {
      urlSearchParams.delete(paramName)
    }
    router.replace(`${PATHS.TRANSFER}?${urlSearchParams.toString()}`)
    setter(accountNumber)
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton />
      <h1 className="mb-4 text-2xl font-bold">Transfer Funds</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="fromAccount" className="mb-1 block">
              From Account
            </label>
            {fromAccount && (
              <span className="link text-sm" onClick={() => onViewAccount(fromAccount)}>
                View Details
              </span>
            )}
          </div>
          <AccountPicker
            selectedAccount={fromAccount}
            onSelectAccount={(accountNumber) => setAccount(accountNumber, 'accountFrom', setFromAccount)}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="toAccount" className="mb-1 block">
              To Account
            </label>
            {toAccount && (
              <span className="link text-sm" onClick={() => onViewAccount(toAccount)}>
                View Details
              </span>
            )}
          </div>
          <AccountPicker
            selectedAccount={toAccount}
            onSelectAccount={(accountNumber) => setAccount(accountNumber, 'accountTo', setToAccount)}
            autoFocus={fromAccount !== null}
          />
        </div>
        <div>
          <label htmlFor="amount" className="mb-1 block">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            min="0.01"
            step="0.01"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <Button type="submit" className="w-full" data-style="primary">
          Transfer Funds
        </Button>
      </form>
      <div className="mt-6">
        {mutation.isSuccess && <Banner type="success" message={`Transfer successful`} />}
        {mutation.isError && <Banner type="error" message={mutation.error?.message} />}
      </div>
    </div>
  )
}
