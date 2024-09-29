'use client'

import { useQuery } from '@tanstack/react-query'
import { Account } from '@/types'
import { AccountQuery } from '@/queries'
import Banner from '@/components/Banner'
import Loader from '@/components/Loader'
import Picker from '@/components/Picker'

interface AccountPickerProps {
  selectedAccount: string | null
  onSelectAccount: (accountNumber: string | null) => void
  autoFocus?: boolean
}

function accountToString(account: Account): string {
  return `${account.account_number} - Customer: ${account.customer_number}`
}

export default function AccountPicker({ selectedAccount, onSelectAccount, autoFocus = true }: AccountPickerProps) {
  const {
    data: accounts,
    isSuccess,
    isError,
    error,
    isLoading
  } = useQuery<Account[]>({
    queryKey: ['accounts'],
    queryFn: AccountQuery.getAll
  })

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="w-full rounded-md border bg-background p-2.5">
          <Loader data-style="accent" />
        </div>
      ) : null}
      {isSuccess ? (
        <Picker
          options={accounts}
          getOptionLabel={accountToString}
          getOptionValue={(account) => account.account_number}
          selectedOption={selectedAccount}
          onSelect={onSelectAccount}
          placeholder="Search accounts..."
          autoFocus={autoFocus}
        />
      ) : null}
      {isError && <Banner type="error" message={error?.message} />}
    </div>
  )
}
