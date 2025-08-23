import React, { useState, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>
  clearError: () => void
  reset: () => void
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  initialData: T | null = null
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        const result = await apiFunction(...args)
        setState({
          data: result,
          loading: false,
          error: null,
        })
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred'
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        return null
      }
    },
    [apiFunction]
  )

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    })
  }, [initialData])

  return {
    ...state,
    execute,
    clearError,
    reset,
  }
}

// Hook for polling data
export function usePolling<T>(
  apiFunction: () => Promise<T>,
  interval: number = 30000, // 30 seconds default
  enabled: boolean = true
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction()
      setData(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  // Polling effect
  React.useEffect(() => {
    if (!enabled) return

    fetchData() // Initial fetch

    const intervalId = setInterval(fetchData, interval)

    return () => clearInterval(intervalId)
  }, [fetchData, interval, enabled])

  return { data, loading, error, refetch: fetchData }
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  apiFunction: (data: T) => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = useCallback(
    async (data: T) => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiFunction(data)
        onSuccess?.(result)
        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Update failed'
        setError(errorMessage)
        onError?.(errorMessage)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [apiFunction, onSuccess, onError]
  )

  return { update, loading, error, clearError: () => setError(null) }
} 