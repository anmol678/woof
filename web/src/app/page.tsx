'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Customer, Account, CustomerCreate, AccountCreate } from '@/types'
import { CustomerQuery, AccountQuery, TransferQuery } from '@/queries'

export default function Home() {
  const queryClient = useQueryClient()

  // Fetch Customers
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: CustomerQuery.getAll
  })

  const { data: accounts } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: AccountQuery.getAll
  })

  // Mutations for creating customer and account
  const createCustomerMutation = useMutation<Customer, Error, CustomerCreate>({
    mutationFn: CustomerQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    }
  })

  const createAccountMutation = useMutation<Account, Error, AccountCreate>({
    mutationFn: AccountQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    }
  })

  // Handlers
  const [customerName, setCustomerName] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [initialDeposit, setInitialDeposit] = useState(0)

  const handleCreateCustomer = () => {
    if (customerName.trim() === '') return
    createCustomerMutation.mutate({ name: customerName })
    setCustomerName('')
  }

  const handleCreateAccount = () => {
    if (selectedCustomer === null || initialDeposit < 0) return
    createAccountMutation.mutate({
      customer_number: selectedCustomer,
      initial_deposit: initialDeposit
    })
    setInitialDeposit(0)
    setSelectedCustomer(null)
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Customer Support Dashboard</h1>

      {/* Create Customer */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Create New Customer</h2>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
          className="mr-2 rounded border p-2"
        />
        <button onClick={handleCreateCustomer} className="rounded bg-blue-500 px-4 py-2 text-white">
          Create Customer
        </button>
      </div>

      {/* Create Account */}
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Create New Account</h2>
        <select
          value={selectedCustomer ?? ''}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="mr-2 rounded border p-2"
        >
          <option value="" disabled>
            Select Customer
          </option>
          {customers?.map((customer) => (
            <option key={customer.customer_number} value={customer.customer_number}>
              {customer.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={initialDeposit}
          onChange={(e) => setInitialDeposit(parseFloat(e.target.value))}
          placeholder="Initial Deposit"
          className="mr-2 rounded border p-2"
        />
        <button onClick={handleCreateAccount} className="rounded bg-green-500 px-4 py-2 text-white">
          Create Account
        </button>
      </div>

      {/* Accounts List */}
      <div>
        <h2 className="mb-2 text-xl font-semibold">Accounts</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Account Number</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts?.map((account) => (
              <tr key={account.id}>
                <td className="border px-4 py-2">{account.account_number}</td>
                <td className="border px-4 py-2">
                  {customers?.find((c) => c.customer_number === account.customer_number)?.name}
                </td>
                <td className="border px-4 py-2">${account.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
