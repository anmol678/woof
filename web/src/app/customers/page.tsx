'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import CustomerPicker from '@/components/customer/CustomerPicker'
import CustomerDetails from '@/components/customer/CustomerDetails'
import CustomerAccounts from '@/components/customer/CustomerAccounts'

export default function CustomerPage({ searchParams }: { searchParams: { customerNumber: string } }) {
  const router = useRouter()

  const [customerNumber, setCustomerNumber] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.customerNumber) {
      setCustomerNumber(searchParams.customerNumber)
    }
  }, [searchParams.customerNumber])

  const handleCustomerChange = (customerNumber: string | null) => {
    if (customerNumber) {
      router.replace(`/customers?customerNumber=${customerNumber}`)
    } else {
      router.replace('/customers')
    }
    setCustomerNumber(customerNumber)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton />
      <h1 className="mb-4 text-2xl font-bold">Customer Details</h1>
      <form className="mb-6">
        <CustomerPicker selectedCustomer={customerNumber} onSelectCustomer={handleCustomerChange} />
      </form>

      {customerNumber && (
        <div className="space-y-6">
          <CustomerDetails customerNumber={customerNumber} />
          <CustomerAccounts customerNumber={customerNumber} />
        </div>
      )}
    </div>
  )
}
