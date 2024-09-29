'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouting } from '@/hooks/useRouting'
import { useSyncedState } from '@/hooks/useSyncedState'
import { useMutationHandler } from '@/hooks/useMutationHandler'
import { Account, AccountCreate } from '@/types'
import { AccountQuery } from '@/queries'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Banner from '@/components/Banner'
import CustomerPicker from '@/components/customer/CustomerPicker'
import Routes from '@/utils/routes'
import Params from '@/utils/params'

interface CreateAccountProps {
  searchParams: { customerNumber: string; redirect: string }
}

export default function CreateAccount({ searchParams }: CreateAccountProps) {
  const { redirectTo } = useRouting()

  const [selectedCustomer, setSelectedCustomer] = useSyncedState<string | null>(Params.CUSTOMER_NUMBER, null)

  const [initialDeposit, setInitialDeposit] = useState('')
  const initialDepositRef = useRef<HTMLInputElement>(null)

  const isRedirect = Object.values(Routes).includes(searchParams.redirect as Routes)

  useEffect(() => {
    if (selectedCustomer) {
      initialDepositRef.current?.focus()
    }
  }, [selectedCustomer, initialDepositRef])

  const mutation = useMutationHandler<Account, AccountCreate, Error>({
    mutationFn: AccountQuery.create,
    invalidateQuery: ['accounts']
  })

  const resetForm = () => {
    setSelectedCustomer(null)
    setInitialDeposit('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCustomer === null) {
      alert('Select a customer')
      return
    }

    const accountCreate: AccountCreate = {
      customer_number: selectedCustomer,
      initial_deposit: parseFloat(initialDeposit)
    }

    mutation.mutate(accountCreate, {
      onSuccess: (data: Account) => {
        resetForm()
        const redirect = isRedirect ? searchParams.redirect : Routes.CUSTOMER_DETAILS
        redirectTo(redirect as Routes, {
          [Params.CUSTOMER_NUMBER]: data.customer_number,
          [Params.FROM]: Routes.CREATE_ACCOUNT
        })
      }
    })
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton route={isRedirect ? undefined : '/'} />
      <h1>Create New Account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="customerNumber" className="mb-2 block">
            Pick a customer
          </label>
          <CustomerPicker selectedCustomer={selectedCustomer} onSelectCustomer={setSelectedCustomer} />
        </div>
        <div>
          <label htmlFor="initialDeposit" className="mb-2 block">
            Initial Deposit
          </label>
          <input
            ref={initialDepositRef}
            type="number"
            id="initialDeposit"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full" data-style="action">
          Create Account
        </Button>
      </form>
      <div>
        {mutation.isSuccess && <Banner type="success" message={`Account created: ${mutation.data?.account_number}`} />}
        {mutation.isError && <Banner type="error" message={mutation.error?.message} />}
      </div>
    </div>
  )
}
