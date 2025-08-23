export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}

export const API_ENDPOINTS = {
  // Dashboard endpoints
  DASHBOARD: {
    METRICS: '/dashboard/metrics',
    CONFUSION_MATRIX: '/dashboard/confusion-matrix',
    PERFORMANCE: '/dashboard/performance',
    DISTRIBUTION: '/dashboard/distribution',
    ANALYTICS: '/dashboard/analytics',
    CLASSIFICATION_HISTORY: '/dashboard/classification-history',
  },
  // Classification endpoints
  CLASSIFICATION: {
    PREDICT: '/predict',
    BATCH_PREDICT: '/predict/batch',
    HISTORY: '/classification/history',
  },
  // Export endpoints
  EXPORT: {
    DASHBOARD: '/export',
  },
  // Health check
  HEALTH: '/health',
}

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
} 