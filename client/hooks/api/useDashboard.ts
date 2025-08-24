import { useState, useEffect, useCallback } from 'react'
import { dashboardService } from '@/services/dashboard/dashboardService'
import {
  DashboardSummary,
  DashboardMetrics,
  ConfusionMatrix,
  CategoryPerformance,
  CategoryDistribution,
  AnalyticsData,
  ClassificationHistory,
} from '@/services/types/dashboard'

interface UseDashboardState {
  data: DashboardSummary | null
  loading: boolean
  error: string | null
  lastUpdated: string | null
}

interface UseDashboardReturn extends UseDashboardState {
  refetch: () => Promise<void>
  refetchSection: (section: keyof DashboardSummary) => Promise<void>
  clearError: () => void
}

export const useDashboard = (): UseDashboardReturn => {
  const [state, setState] = useState<UseDashboardState>({
    data: null,
    loading: true,
    error: null,
    lastUpdated: null,
  })

  const fetchDashboardData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const data = await dashboardService.getAllDashboardData()
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      }))
    }
  }, [])

  const refetchSection = useCallback(async (section: keyof DashboardSummary) => {
    if (!state.data) return

    try {
      const newSectionData = await dashboardService.refreshSection(section)
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data!,
          [section]: newSectionData,
          last_updated: new Date().toISOString(),
        },
        lastUpdated: new Date().toISOString(),
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh section',
      }))
    }
  }, [state.data])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    ...state,
    refetch: fetchDashboardData,
    refetchSection,
    clearError,
  }
}

// Individual hooks for specific sections
export const useMetrics = () => {
  const [data, setData] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const metrics = await dashboardService.getMetrics()
      setData(metrics)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return { data, loading, error, refetch: fetchMetrics }
}

export const useConfusionMatrix = () => {
  const [data, setData] = useState<ConfusionMatrix | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfusionMatrix = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const matrix = await dashboardService.getConfusionMatrix()
      setData(matrix)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch confusion matrix')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfusionMatrix()
  }, [fetchConfusionMatrix])

  return { data, loading, error, refetch: fetchConfusionMatrix }
}

export const usePerformance = () => {
  const [data, setData] = useState<CategoryPerformance[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const performance = await dashboardService.getPerformance()
      setData(performance)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch performance data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPerformance()
  }, [fetchPerformance])

  return { data, loading, error, refetch: fetchPerformance }
}

export const useDistribution = () => {
  const [data, setData] = useState<CategoryDistribution[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDistribution = useCallback(async () => {
    try {
      console.log('🔍 useDistribution: Starting fetch...')
      setLoading(true)
      setError(null)
      const distribution = await dashboardService.getDistribution()
      console.log('🔍 useDistribution: Received data:', distribution)
      console.log('🔍 useDistribution: Data length:', distribution?.length)
      setData(distribution)
    } catch (error) {
      console.error('🔍 useDistribution: Error occurred:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch distribution data')
    } finally {
      console.log('🔍 useDistribution: Setting loading to false')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log('🔍 useDistribution: useEffect triggered')
    fetchDistribution()
  }, [fetchDistribution])

  console.log('🔍 useDistribution: Current state:', { data, loading, error })

  return { data, loading, error, refetch: fetchDistribution }
}

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      console.log('🔍 useAnalytics: Starting fetch...')
      setLoading(true)
      setError(null)
      const analytics = await dashboardService.getAnalytics()
      console.log('🔍 useAnalytics: Received data:', analytics)
      console.log('🔍 useAnalytics: Daily classifications length:', analytics?.daily_classifications?.length)
      setData(analytics)
    } catch (error) {
      console.error('🔍 useAnalytics: Error occurred:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch analytics data')
    } finally {
      console.log('🔍 useAnalytics: Setting loading to false')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log('🔍 useAnalytics: useEffect triggered')
    fetchAnalytics()
  }, [fetchAnalytics])

  console.log('🔍 useAnalytics: Current state:', { data, loading, error })

  return { data, loading, error, refetch: fetchAnalytics }
}

export const useClassificationHistory = (limit: number = 10) => {
  const [data, setData] = useState<ClassificationHistory[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const history = await dashboardService.getClassificationHistory(limit)
      setData(history)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch classification history')
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return { data, loading, error, refetch: fetchHistory }
} 