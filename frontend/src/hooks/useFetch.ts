import { useCallback, useEffect, useState } from 'react'

interface FetchState<T> {
  status: 'loading' | 'success' | 'error'
  data: T | null
  error: Error | null
}

export function useFetch<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [result, setResult] = useState<FetchState<T>>({
    status: 'loading',
    data: null,
    error: null,
  })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    fn()
      .then((data) => {
        if (active) setResult({ status: 'success', data, error: null })
      })
      .catch((error: Error) => {
        if (active) setResult({ status: 'error', data: null, error })
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const refetch = useCallback(() => {
    setResult((r) => ({ ...r, status: 'loading' }))
    setTick((t) => t + 1)
  }, [])

  return {
    data: result.data,
    error: result.error,
    loading: result.status === 'loading',
    refetch,
  }
}
