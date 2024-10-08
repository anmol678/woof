'use client'

import { useState } from 'react'
import { useRouting } from '@/hooks/useRouting'
import { useAlerts } from '@/contexts/alert'
import { useMutationHandler } from '@/hooks/useMutationHandler'
import { Customer, CustomerCreate } from '@/types'
import { CustomerQuery } from '@/queries'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Routes from '@/utils/routes'
import Params from '@/utils/params'

interface CreateCustomerProps {
  searchParams: { redirect: string }
}

export default function CreateCustomer({ searchParams }: CreateCustomerProps) {
  const { redirectTo } = useRouting()

  const { addAlert } = useAlerts()

  const [name, setName] = useState('')

  const mutation = useMutationHandler<Customer, CustomerCreate, Error>({
    mutationFn: CustomerQuery.create,
    invalidateQuery: ['customers']
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(
      { name },
      {
        onSuccess: (data: Customer) => {
          setName('')
          addAlert('success', `Customer created: ${data.customer_number} - ${data.name}`)
          const isValidRedirect = Object.values(Routes).includes(searchParams.redirect as Routes)
          const redirect = isValidRedirect ? searchParams.redirect : Routes.CUSTOMER_DETAILS
          redirectTo(redirect as Routes, {
            [Params.CUSTOMER_NUMBER]: data.customer_number,
            [Params.FROM]: Routes.CREATE_CUSTOMER
          })
        },
        onError: (error: Error) => {
          addAlert('error', error.message)
        }
      }
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton />
      <h1>Create New Customer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
            autoFocus
          />
        </div>
        <Button type="submit" className="w-full" data-style="action" isLoading={mutation.isPending}>
          Create Customer
        </Button>
      </form>
    </div>
  )
}
