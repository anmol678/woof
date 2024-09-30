import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function useSyncedState<T>(
  paramName: string,
  initialValue: T,
  parseFn: (value: string) => T = (value) => value as unknown as T,
  serializeFn: (value: T) => string = String
): [T, (value: T | null) => void] {
  const router = useRouter()

  const searchParams = useSearchParams()

  const getValueFromParam = useCallback(
    (paramValue: string | null): T => {
      return paramValue !== null ? parseFn(paramValue) : initialValue
    },
    [parseFn, initialValue]
  )

  const [state, setState] = useState<T>(() => getValueFromParam(searchParams.get(paramName)))

  useEffect(() => {
    setState(getValueFromParam(searchParams.get(paramName)))
  }, [searchParams, paramName, getValueFromParam])

  const setSyncedState = useCallback(
    (value: T | null) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      if (value !== null) {
        newSearchParams.set(paramName, serializeFn(value))
      } else {
        newSearchParams.delete(paramName)
      }
      router.replace(`${window.location.pathname}?${newSearchParams.toString()}`)
      setState(value === null ? initialValue : value)
    },
    [searchParams, paramName, serializeFn, router, initialValue]
  )

  return [state, setSyncedState]
}
