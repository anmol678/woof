'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Account, AccountCreate } from '@/types'
import { AccountQuery } from '@/queries'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Banner from '@/components/Banner'
import CustomerPicker from '@/components/customer/CustomerPicker'
import Routes from '@/utils/routes'

export default function CreateAccount({
  searchParams
}: {
  searchParams: { customerNumber: string; redirect: string }
}) {
  const router = useRouter()

  const queryClient = useQueryClient()

  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [initialDeposit, setInitialDeposit] = useState('')
  const initialDepositRef = useRef<HTMLInputElement>(null)

  const isRedirect = Object.values(Routes).includes(searchParams.redirect as Routes)

  useEffect(() => {
    if (searchParams.customerNumber) {
      setSelectedCustomer(searchParams.customerNumber)
      initialDepositRef.current?.focus()
    }
  }, [searchParams.customerNumber])

  const mutation = useMutation<Account, Error, AccountCreate>({
    mutationFn: AccountQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  })

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (selectedCustomer === null) {
        alert('Select a customer')
        return
      }

      mutation.mutate(
        { customer_number: selectedCustomer, initial_deposit: parseFloat(initialDeposit) },
        {
          onSuccess: (data) => {
            setSelectedCustomer(null)
            setInitialDeposit('')
            const redirect = isRedirect ? searchParams.redirect : Routes.CUSTOMER_DETAILS
            router.push(`${redirect}?customerNumber=${data.customer_number}&from=create-account`)
          }
        }
      )
    },
    [selectedCustomer, initialDeposit, mutation, isRedirect, searchParams, router]
  )

  const handleCustomerSelect = useCallback(
    (customerNumber: string | null) => {
      setSelectedCustomer(customerNumber)
      if (customerNumber) {
        initialDepositRef.current?.focus()
      }
    },
    [initialDepositRef]
  )

  const backRoute = isRedirect ? undefined : '/'

  return (
    <div className="mx-auto max-w-md">
      <BackButton route={backRoute} />
      <h1>Create New Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerNumber" className="mb-2 block">
            Pick a customer
          </label>
          <CustomerPicker selectedCustomer={selectedCustomer} onSelectCustomer={handleCustomerSelect} />
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
      <div className="mt-6">
        {mutation.isSuccess && <Banner type="success" message={`Account created: ${mutation.data?.account_number}`} />}
        {mutation.isError && <Banner type="error" message={mutation.error?.message} />}
      </div>
    </div>
  )
}
