'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import AccountPicker from '@/components/account/AccountPicker'
import AccountDetails from '@/components/account/AccountDetails'
import AccountTransfers from '@/components/account/AccountTransfers'
import Routes from '@/utils/routes'

export default function AccountPage({ searchParams }: { searchParams: { accountNumber: string; from: string } }) {
  const router = useRouter()

  const [accountNumber, setAccountNumber] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.accountNumber) {
      setAccountNumber(searchParams.accountNumber)
    }
  }, [searchParams.accountNumber])

  const handleAccountChange = (accountNumber: string | null) => {
    if (accountNumber) {
      router.replace(`${Routes.ACCOUNT_DETAILS}?accountNumber=${accountNumber}`)
    } else {
      router.replace(Routes.ACCOUNT_DETAILS)
    }
    setAccountNumber(accountNumber)
  }

  const backRoute = searchParams.from ? '/' : undefined

  return (
    <div className="mx-auto max-w-4xl">
      <BackButton route={backRoute} />
      <h1>Account Details</h1>
      <form className="mb-6">
        <AccountPicker selectedAccount={accountNumber} onSelectAccount={handleAccountChange} />
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
