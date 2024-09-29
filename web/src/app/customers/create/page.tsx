'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Customer, CustomerCreate } from '@/types'
import { CustomerQuery } from '@/queries'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Banner from '@/components/Banner'
import Routes from '@/utils/routes'

export default function CreateCustomer({ searchParams }: { searchParams: { redirect: string } }) {
  const router = useRouter()

  const queryClient = useQueryClient()

  const [name, setName] = useState('')

  const mutation = useMutation<Customer, Error, CustomerCreate>({
    mutationFn: CustomerQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })

  const isRedirect = Object.values(Routes).includes(searchParams.redirect as Routes)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(
      { name },
      {
        onSuccess: (data) => {
          setName('')
          const redirect = isRedirect ? searchParams.redirect : Routes.CUSTOMER_DETAILS
          router.push(`${redirect}?customerNumber=${data.customer_number}&from=create-customer`)
        }
      }
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton />
      <h1>Create New Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="mt-6">
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
