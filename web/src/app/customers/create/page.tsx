'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Customer, CustomerCreate } from '@/types'
import { CustomerQuery } from '@/queries'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import Banner from '@/components/Banner'
import PATHS from '@/utils/paths'

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

  const isRedirect = Object.values(PATHS).includes(searchParams.redirect as PATHS)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutation.mutate(
      { name },
      {
        onSuccess: (data) => {
          setName('')
          const redirect = isRedirect ? searchParams.redirect : PATHS.CUSTOMER_DETAILS
          router.push(`${redirect}?customerNumber=${data.customer_number}&from=create-customer`)
        }
      }
    )
  }

  return (
    <div className="mx-auto max-w-md">
      <BackButton />
      <h1 className="my-4 text-2xl font-bold">Create New Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
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
