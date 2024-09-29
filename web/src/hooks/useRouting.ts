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

  const redirectToCreateAccount = (customerNumber: string, redirect: Routes) => {
    redirectTo(Routes.CREATE_ACCOUNT, { [Params.CUSTOMER_NUMBER]: customerNumber, [Params.REDIRECT]: redirect })
  }

  return { redirectToAccountDetails, redirectToCreateAccount }
}

export function useCustomerRouting() {
  const { redirectTo } = useRouting()

  const redirectToCustomerDetails = (customerNumber: string) => {
    redirectTo(Routes.CUSTOMER_DETAILS, { [Params.CUSTOMER_NUMBER]: customerNumber })
  }

  const redirectToCreateCustomer = (redirect?: Routes) => {
    redirectTo(Routes.CREATE_CUSTOMER, { ...(redirect && { [Params.REDIRECT]: redirect }) })
  }

  return { redirectToCustomerDetails, redirectToCreateCustomer }
}

export function useTransferRouting() {
  const { redirectTo } = useRouting()

  const redirectToTransferDetails = ({ from, to }: { from?: string; to?: string }) => {
    redirectTo(Routes.TRANSFER, {
      ...(from && { [Params.TRANSFER_FROM]: from }),
      ...(to && { [Params.TRANSFER_TO]: to })
    })
  }

  return { redirectToTransferDetails }
}
