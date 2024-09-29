'use client'

import { useSyncedState } from '@/hooks/useSyncedState'
import BackButton from '@/components/BackButton'
import CustomerPicker from '@/components/customer/CustomerPicker'
import CustomerDetails from '@/components/customer/CustomerDetails'
import CustomerAccounts from '@/components/customer/CustomerAccounts'
import Params from '@/utils/params'

interface CustomerPageProps {
  searchParams: { customerNumber: string; from: string }
}

export default function CustomerPage({ searchParams }: CustomerPageProps) {
  const [customerNumber, setCustomerNumber] = useSyncedState<string | null>(Params.CUSTOMER_NUMBER, null)

  const backRoute = searchParams.from ? '/' : undefined

  return (
    <div className="mx-auto max-w-4xl">
      <BackButton route={backRoute} />
      <h1>Customer Details</h1>
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
