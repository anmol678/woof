'use client'

import { useState } from 'react'
import BackButton from '@/components/BackButton'
import AccountPicker from '@/components/account/AccountPicker'
import AccountDetails from '@/components/account/AccountDetails'
import AccountTransfers from '@/components/account/AccountTransfers'

export default function AccountPage() {
  const [accountNumber, setAccountNumber] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton />
      <h1 className="mb-4 text-2xl font-bold">Account Details</h1>
      <form className="mb-6">
        <AccountPicker selectedAccount={accountNumber} onSelectAccount={setAccountNumber} />
      </form>

      {accountNumber && (
        <div className="space-y-6">
          <AccountDetails accountNumber={accountNumber} />
          <AccountTransfers accountNumber={accountNumber} />
        </div>
      )}
    </div>
  )
}
