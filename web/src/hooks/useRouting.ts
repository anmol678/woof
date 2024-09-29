import { useRouter } from 'next/navigation'
import Routes from '@/utils/routes'
import Params from '@/utils/params'

export function useRouting() {
  const router = useRouter()

  const prepareUrl = (route: Routes, queryParams?: Record<string, string>) => {
    let url = route as string
    if (queryParams) {
      const params = new URLSearchParams(queryParams).toString()
      url = [url, params].join('?')
    }
    return url
  }

  const redirectTo = (route: Routes, queryParams?: Record<string, string>) => {
    const url = prepareUrl(route, queryParams)
    router.push(url)
  }

  const replaceRoute = (route: Routes, queryParams?: Record<string, string>) => {
    const url = prepareUrl(route, queryParams)
    router.replace(url)
  }

  return { redirectTo, replaceRoute }
}

export function useAccountRouting() {
  const { redirectTo } = useRouting()

  const redirectToAccountDetails = (accountNumber: string) => {
    redirectTo(Routes.ACCOUNT_DETAILS, { [Params.ACCOUNT_NUMBER]: accountNumber })
  }

  return { redirectToAccountDetails }
}

export function useCustomerRouting() {
  const { redirectTo } = useRouting()

  const redirectToCustomerDetails = (customerNumber: string) => {
    redirectTo(Routes.CUSTOMER_DETAILS, { [Params.CUSTOMER_NUMBER]: customerNumber })
  }

  return { redirectToCustomerDetails }
}
