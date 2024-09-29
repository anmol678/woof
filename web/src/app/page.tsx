import Link from 'next/link'
import DashboardLinks from '@/utils/dashboard-links'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="my-4 text-xl font-semibold">Support Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DashboardLinks.map((link) => (
          <DashboardLink key={link.href} {...link} />
        ))}
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
  icon: React.ElementType
}) {
  return (
    <Link href={href} className="dashboard-link flex items-start">
      <Icon className="stroke-1.5 h-7 max-h-7 w-9 text-gray-600" />
      <div className="ml-4 flex flex-col">
        <h2>{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
