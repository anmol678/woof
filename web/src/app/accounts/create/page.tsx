'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouting } from '@/hooks/useRouting'
import { useAlerts } from '@/contexts/alert'
import { useSyncedState } from '@/hooks/useSyncedState'
import { useMutationHandler } from '@/hooks/useMutationHandler'
import { Account, AccountCreate } from '@/types'
import { AccountQuery } from '@/queries'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import CustomerPicker from '@/components/customer/CustomerPicker'
import Routes from '@/utils/routes'
import Params from '@/utils/params'

interface CreateAccountProps {
  searchParams: { customerNumber: string; redirect: string }
}

export default function CreateAccount({ searchParams }: CreateAccountProps) {
  const { redirectTo } = useRouting()

  const { addAlert } = useAlerts()

  const [selectedCustomer, setSelectedCustomer] = useSyncedState<string | null>(Params.CUSTOMER_NUMBER, null)

  const [initialDeposit, setInitialDeposit] = useState('')
  const initialDepositRef = useRef<HTMLInputElement>(null)

  const isValidRedirect = Object.values(Routes).includes(searchParams.redirect as Routes)

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
      addAlert('error', 'Select a customer to create an account for')
      return
    }

    const accountCreate: AccountCreate = {
      customer_number: selectedCustomer,
      initial_deposit: parseFloat(initialDeposit)
    }

    mutation.mutate(accountCreate, {
      onSuccess: (data: Account) => {
        resetForm()
        addAlert('success', `Account created: ${data.account_number}`)
        const redirect = isValidRedirect ? searchParams.redirect : Routes.CUSTOMER_DETAILS
        redirectTo(redirect as Routes, {
          [Params.CUSTOMER_NUMBER]: data.customer_number,
          [Params.FROM]: Routes.CREATE_ACCOUNT
        })
      },
      onError: (error: Error) => {
        addAlert('error', error.message)
      }
    })
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton route={isValidRedirect ? undefined : '/'} />
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
    </div>
  )
}
