import Link from 'next/link'
import { UserPlus, Grid2x2Plus, ArrowRightLeft, UserSearch, WalletCards, LucideIcon } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-700">Support Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardLink
          href="/customers/create"
          title="Create Customer"
          description="Register a new customer"
          icon={UserPlus}
        />
        <DashboardLink
          href="/accounts/create"
          title="Create Account"
          description="Open a new bank account"
          icon={Grid2x2Plus}
        />
        <DashboardLink
          href="/transfer"
          title="Transfer Funds"
          description="Transfer money between accounts"
          icon={ArrowRightLeft}
        />
        <DashboardLink
          href="/customers"
          title="Customer Lookup"
          description="View customer information and accounts"
          icon={UserSearch}
        />
        <DashboardLink
          href="/accounts"
          title="Account Lookup"
          description="View account balance and transfer history"
          icon={WalletCards}
        />
      </div>
    </div>
  )
}

function DashboardLink({
  href,
  title,
  description,
  icon: Icon
}: {
  href: string
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <Link href={href} className="dashboard-link flex items-start">
      <Icon className="mt-1 text-gray-600" />
      <div className="ml-4 flex flex-col">
        <h2 className="mb-2 text-xl font-semibold text-gray-700">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
