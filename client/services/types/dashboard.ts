// Dashboard Metrics Types
export interface DashboardMetrics {
  f1_score: number
  accuracy: number
  total_articles: number
  processing_speed: number
  precision?: number
  recall?: number
  avg_processing_time?: number
}

// Confusion Matrix Types
export interface ConfusionMatrix {
  matrix: number[][]
  categories: string[]
  total_predictions: number
  accuracy_per_category: Record<string, number>
}

// Performance by Category Types
export interface CategoryPerformance {
  category: string
  accuracy: number
  f1_score: number
  precision: number
  recall: number
  total_predictions: number
  correct_predictions: number
}

// Distribution Analysis Types
export interface CategoryDistribution {
  category: string
  count: number
  percentage: number
  trend?: number // Percentage change from previous period
}

// Analytics Types
export interface AnalyticsData {
  daily_classifications: number[]
  accuracy_trend: number[]
  categories_trend: {
    cardiovascular: number[]
    neurological: number[]
    hepatorenal: number[]
    oncological: number[]
  }
  processing_speed_trend: number[]
  error_rate_trend: number[]
}

// Classification History Types
export interface ClassificationHistory {
  id: number
  title: string
  abstract: string
  category: string
  confidence: number
  date: string
  processing_time: number
  status: 'success' | 'error' | 'pending'
}

// Dashboard Summary Types
export interface DashboardSummary {
  metrics: DashboardMetrics
  confusion_matrix: ConfusionMatrix
  performance: CategoryPerformance[]
  distribution: CategoryDistribution[]
  analytics: AnalyticsData
  classification_history: ClassificationHistory[]
  last_updated: string
  data_range: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  timestamp: string
}

export interface DashboardApiResponse extends ApiResponse<DashboardSummary> {}
export interface MetricsApiResponse extends ApiResponse<DashboardMetrics> {}
export interface ConfusionMatrixApiResponse extends ApiResponse<ConfusionMatrix> {}
export interface PerformanceApiResponse extends ApiResponse<CategoryPerformance[]> {}
export interface DistributionApiResponse extends ApiResponse<CategoryDistribution[]> {}
export interface AnalyticsApiResponse extends ApiResponse<AnalyticsData> {}
export interface ClassificationHistoryApiResponse extends ApiResponse<ClassificationHistory[]> {} 