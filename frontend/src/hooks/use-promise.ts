import { useEffect, useState } from 'react'

export interface UsePromiseValue<T, E = unknown> {
  result: T | null
  loading: boolean
  error?: E
  settled: boolean
}

const initialValue: UsePromiseValue<any, any> = {
  result: null,
  loading: false,
  settled: false,
  error: null
}

export function usePromise<T, E = Error>(promise: Promise<T> | null): UsePromiseValue<T, E> {
  const [value, setValue] = useState<UsePromiseValue<T, E>>(initialValue)

  useEffect(() => {
    const cancelled = {
      current: false
    }

    if (promise) {
      setValue({ ...initialValue, loading: true })
      promise
        .then(res => {
          if (!cancelled.current) {
            setValue({ result: res, loading: false, settled: true })
          }
        })
        .catch(e => {
          if (!cancelled.current) {
            setValue({ result: null, loading: false, error: e, settled: false })
          }
        })
    } else {
      setValue(initialValue)
    }

    return () => {
      cancelled.current = true
    }
  }, [promise])

  return value
}