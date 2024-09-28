'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Account, AccountCreate } from '@/types'
import { AccountQuery } from '@/queries'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Banner from '@/components/Banner'
import CustomerPicker from '@/components/CustomerPicker'

export default function CreateAccount({ searchParams }: { searchParams: { customerNumber: string } }) {
  const queryClient = useQueryClient()

  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [initialDeposit, setInitialDeposit] = useState('')

  useEffect(() => {
    if (searchParams.customerNumber) {
      setSelectedCustomer(searchParams.customerNumber)
    }
  }, [searchParams.customerNumber])

  const mutation = useMutation<Account, Error, AccountCreate>({
    mutationFn: AccountQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedCustomer === null) {
      alert('Select a customer')
      return
    }

    mutation.mutate(
      { customer_number: selectedCustomer, initial_deposit: parseFloat(initialDeposit) },
      {
        onSuccess: () => {
          setSelectedCustomer(null)
          setInitialDeposit('')
        }
      }
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton route="/" />
      <h1 className="mb-4 text-2xl font-bold">Create New Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerNumber" className="mb-2 block">
            Pick a customer
          </label>
          <CustomerPicker selectedCustomer={selectedCustomer} onSelectCustomer={setSelectedCustomer} />
        </div>
        <div>
          <label htmlFor="initialDeposit" className="mb-1 block">
            Initial Deposit
          </label>
          <input
            type="number"
            id="initialDeposit"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(e.target.value)}
            required
            min="0"
            step="0.01"
            className="w-full"
            autoFocus={!selectedCustomer}
          />
        </div>
        <Button type="submit" className="w-full" data-style="action">
          Create Account
        </Button>
      </form>
      <div className="mt-6">
        {mutation.isSuccess && <Banner type="success" message={`Account created: ${mutation.data?.account_number}`} />}
        {mutation.isError && <Banner type="error" message={mutation.error?.message} />}
      </div>
    </div>
  )
}
