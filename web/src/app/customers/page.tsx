'use client'

import { useState } from 'react'
import BackButton from '@/components/BackButton'
import CustomerPicker from '@/components/customer/CustomerPicker'
import CustomerDetails from '@/components/customer/CustomerDetails'
import CustomerAccounts from '@/components/customer/CustomerAccounts'

export default function CustomerPage() {
  const [customerNumber, setCustomerNumber] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton />
      <h1 className="mb-4 text-2xl font-bold">Customer Details</h1>
      <form className="mb-6">
        <CustomerPicker selectedCustomer={customerNumber} onSelectCustomer={setCustomerNumber} />
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
