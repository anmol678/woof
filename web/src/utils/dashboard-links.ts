import {
  UserPlusIcon,
  CreditCardIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline'
import Routes from '@/utils/routes'

const DashboardLinks = [
  {
    href: Routes.CREATE_CUSTOMER,
    title: 'Create Customer',
    description: 'Register a new customer',
    icon: UserPlusIcon
  },
  {
    href: Routes.CREATE_ACCOUNT,
    title: 'Create Account',
    description: 'Open a new bank account',
    icon: CreditCardIcon
  },
  {
    href: Routes.TRANSFER,
    title: 'Transfer Funds',
    description: 'Transfer money between accounts',
    icon: ArrowsRightLeftIcon
  },
  {
    href: Routes.CUSTOMER_DETAILS,
    title: 'Customer Lookup',
    description: 'View customer information and accounts',
    icon: UserGroupIcon
  },
  {
    href: Routes.ACCOUNT_DETAILS,
    title: 'Account Lookup',
    description: 'View account balance and transfer history',
    icon: RectangleStackIcon
  }
]

export default DashboardLinks
