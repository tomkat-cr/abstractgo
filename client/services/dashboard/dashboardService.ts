import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/config/api'
import {
  DashboardSummary,
  DashboardMetrics,
  ConfusionMatrix,
  CategoryPerformance,
  CategoryDistribution,
  AnalyticsData,
  ClassificationHistory,
  DashboardApiResponse,
  MetricsApiResponse,
  ConfusionMatrixApiResponse,
  PerformanceApiResponse,
  DistributionApiResponse,
  AnalyticsApiResponse,
  ClassificationHistoryApiResponse,
} from '@/services/types/dashboard'

export class DashboardService {
  // Get complete dashboard data
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<DashboardApiResponse>('/dashboard/summary')
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard summary:', error)
      throw error
    }
  }

  // Get metrics only
  async getMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await apiClient.get<DashboardMetrics>(API_ENDPOINTS.DASHBOARD.METRICS)
      return response
    } catch (error) {
      console.error('Error fetching metrics:', error)
      throw error
    }
  }

  // Get confusion matrix
  async getConfusionMatrix(): Promise<ConfusionMatrix> {
    try {
      const response = await apiClient.get<ConfusionMatrix>(API_ENDPOINTS.DASHBOARD.CONFUSION_MATRIX)
      return response
    } catch (error) {
      console.error('Error fetching confusion matrix:', error)
      throw error
    }
  }

  // Get performance by category
  async getPerformance(): Promise<CategoryPerformance[]> {
    try {
      const response = await apiClient.get<CategoryPerformance[]>(API_ENDPOINTS.DASHBOARD.PERFORMANCE)
      return response
    } catch (error) {
      console.error('Error fetching performance data:', error)
      throw error
    }
  }

  // Get distribution analysis
  async getDistribution(): Promise<CategoryDistribution[]> {
    try {
      console.log('🔍 DashboardService: Making request to distribution endpoint...')
      const response = await apiClient.get<DistributionApiResponse>(API_ENDPOINTS.DASHBOARD.DISTRIBUTION)
      console.log('🔍 DashboardService: Raw response received:', response)
      console.log('🔍 DashboardService: Response data:', response.data)
      console.log('🔍 DashboardService: Response data length:', response.data?.length)
      
      // Manejar caso donde la respuesta es directamente el array
      const distributionData = response.data || response
      console.log('🔍 DashboardService: Final distribution data:', distributionData)
      
      return distributionData
    } catch (error) {
      console.error('🔍 DashboardService: Error fetching distribution data:', error)
      throw error
    }
  }

  // Get analytics data
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      console.log('🔍 DashboardService: Making request to analytics endpoint...')
      const response = await apiClient.get<AnalyticsData>(API_ENDPOINTS.DASHBOARD.ANALYTICS)
      console.log('🔍 DashboardService: Raw response received:', response)
      console.log('🔍 DashboardService: Daily classifications length:', response?.daily_classifications?.length)
      return response
    } catch (error) {
      console.error('🔍 DashboardService: Error fetching analytics data:', error)
      throw error
    }
  }

  // Get classification history
  async getClassificationHistory(limit: number = 10): Promise<ClassificationHistory[]> {
    try {
      const response = await apiClient.get<ClassificationHistoryApiResponse>(
        `${API_ENDPOINTS.DASHBOARD.CLASSIFICATION_HISTORY}?limit=${limit}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching classification history:', error)
      throw error
    }
  }

  // Get all dashboard data in parallel (optimized)
  async getAllDashboardData(): Promise<DashboardSummary> {
    try {
      const [
        metrics,
        confusionMatrix,
        performance,
        distribution,
        analytics,
        classificationHistory
      ] = await Promise.all([
        this.getMetrics(),
        this.getConfusionMatrix(),
        this.getPerformance(),
        this.getDistribution(),
        this.getAnalytics(),
        this.getClassificationHistory()
      ])

      return {
        metrics,
        confusion_matrix: confusionMatrix,
        performance,
        distribution,
        analytics,
        classification_history: classificationHistory,
        last_updated: new Date().toISOString(),
        data_range: 'current'
      }
    } catch (error) {
      console.error('Error fetching all dashboard data:', error)
      throw error
    }
  }

  // Refresh specific section
  async refreshSection(section: keyof DashboardSummary): Promise<any> {
    const sectionMethods = {
      metrics: this.getMetrics,
      confusion_matrix: this.getConfusionMatrix,
      performance: this.getPerformance,
      distribution: this.getDistribution,
      analytics: this.getAnalytics,
      classification_history: this.getClassificationHistory,
    }

    const method = sectionMethods[section]
    if (!method) {
      throw new Error(`Unknown section: ${section}`)
    }

    return method.call(this)
  }
}

// Export singleton instance
export const dashboardService = new DashboardService()
export default dashboardService 