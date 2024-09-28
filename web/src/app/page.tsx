import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Support Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardLink href="/customers/create" title="Create Customer" description="Create a new customer account" />
        <DashboardLink href="/accounts/create" title="Create Account" description="Open a new bank account for a customer" />
        <DashboardLink href="/transfer" title="Transfer Funds" description="Transfer money between accounts" />
        <DashboardLink href="/customers" title="Customer Lookup" description="View customer information and accounts" />
        <DashboardLink href="/accounts" title="Account Lookup" description="View account balance and transfer history" />
      </div>
    </div>
  )
}

function DashboardLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link href={href} className="dashboard-link">
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}
