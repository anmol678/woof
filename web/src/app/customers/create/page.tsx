'use client'

import { useState } from 'react'
import { useRouting } from '@/hooks/useRouting'
import { useMutationHandler } from '@/hooks/useMutationHandler'
import { Customer, CustomerCreate } from '@/types'
import { CustomerQuery } from '@/queries'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Banner from '@/components/Banner'
import Routes from '@/utils/routes'
import Params from '@/utils/params'

interface CreateCustomerProps {
  searchParams: { redirect: string }
}

export default function CreateCustomer({ searchParams }: CreateCustomerProps) {
  const { redirectTo } = useRouting()

  const [name, setName] = useState('')

  const mutation = useMutationHandler<Customer, CustomerCreate, Error>({
    mutationFn: CustomerQuery.create,
    invalidateQuery: ['customers']
  })

  const isRedirect = Object.values(Routes).includes(searchParams.redirect as Routes)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(
      { name },
      {
        onSuccess: (data: Customer) => {
          setName('')
          const redirect = isRedirect ? searchParams.redirect : Routes.CUSTOMER_DETAILS
          redirectTo(redirect as Routes, {
            [Params.CUSTOMER_NUMBER]: data.customer_number,
            [Params.FROM]: Routes.CREATE_CUSTOMER
          })
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
      <div>
        {mutation.isSuccess && (
          <Banner
            type="success"
            message={`Customer created: ${mutation.data?.customer_number} - ${mutation.data?.name}`}
          />
        )}
        {mutation.isError && <Banner type="error" message={mutation.error?.message} />}
      </div>
    </div>
  )
}
