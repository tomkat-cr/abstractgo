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
      const response = await apiClient.get<MetricsApiResponse>(API_ENDPOINTS.DASHBOARD.METRICS)
      return response.data
    } catch (error) {
      console.error('Error fetching metrics:', error)
      throw error
    }
  }

  // Get confusion matrix
  async getConfusionMatrix(): Promise<ConfusionMatrix> {
    try {
      const response = await apiClient.get<ConfusionMatrixApiResponse>(API_ENDPOINTS.DASHBOARD.CONFUSION_MATRIX)
      return response.data
    } catch (error) {
      console.error('Error fetching confusion matrix:', error)
      throw error
    }
  }

  // Get performance by category
  async getPerformance(): Promise<CategoryPerformance[]> {
    try {
      const response = await apiClient.get<PerformanceApiResponse>(API_ENDPOINTS.DASHBOARD.PERFORMANCE)
      return response.data
    } catch (error) {
      console.error('Error fetching performance data:', error)
      throw error
    }
  }

  // Get distribution analysis
  async getDistribution(): Promise<CategoryDistribution[]> {
    try {
      const response = await apiClient.get<DistributionApiResponse>(API_ENDPOINTS.DASHBOARD.DISTRIBUTION)
      return response.data
    } catch (error) {
      console.error('Error fetching distribution data:', error)
      throw error
    }
  }

  // Get analytics data
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const response = await apiClient.get<AnalyticsApiResponse>(API_ENDPOINTS.DASHBOARD.ANALYTICS)
      return response.data
    } catch (error) {
      console.error('Error fetching analytics data:', error)
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