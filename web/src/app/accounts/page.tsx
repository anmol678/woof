'use client'

import { useSyncedState } from '@/hooks/useSyncedState'
import BackButton from '@/components/BackButton'
import AccountPicker from '@/components/account/AccountPicker'
import AccountDetails from '@/components/account/AccountDetails'
import AccountTransfers from '@/components/account/AccountTransfers'
import Params from '@/utils/params'

interface AccountPageProps {
  searchParams: { accountNumber: string; from: string }
}

export default function AccountPage({ searchParams }: AccountPageProps) {
  const [accountNumber, setAccountNumber] = useSyncedState<string | null>(Params.ACCOUNT_NUMBER, null)

  const backRoute = searchParams.from ? '/' : undefined

  return (
    <div className="mx-auto max-w-4xl">
      <BackButton route={backRoute} />
      <h1>Account Details</h1>
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
