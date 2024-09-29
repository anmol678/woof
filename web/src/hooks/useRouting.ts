import { useRouter } from 'next/navigation'
import Routes from '@/utils/routes'

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
