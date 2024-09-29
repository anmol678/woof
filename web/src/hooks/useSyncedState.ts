import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useSyncedState<T>(
  paramName: string,
  initialValue: T,
  parseFn?: (value: string) => T,
  serializeFn?: (value: T) => string
): [T, (value: T | null) => void] {
  const router = useRouter()

  const [state, setState] = useState<T>(initialValue)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const paramValue = urlParams.get(paramName)
    if (paramValue !== null) {
      setState(parseFn ? parseFn(paramValue) : (paramValue as unknown as T))
    }
  }, [paramName, parseFn, router])

  const setSyncedState = (value: T | null) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (value !== null) {
      urlParams.set(paramName, serializeFn ? serializeFn(value) : String(value))
    } else {
      urlParams.delete(paramName)
    }
    router.replace(`${window.location.pathname}?${urlParams.toString()}`)
    setState(value === null ? initialValue : value)
  }

  return [state, setSyncedState]
}
