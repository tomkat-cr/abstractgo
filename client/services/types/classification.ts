// Classification Request Types
export interface ClassificationRequest {
  title: string
  abstract: string
}

export interface PDFUploadRequest {
  file: File
}

// Server Response Types (actual response from /predict endpoint)
export interface PredictionItem {
  label: string
  score: number
}

// Classification Response Types (processed for frontend)
export interface ClassificationResponse {
  category: string
  confidence: number
  processing_time?: number
  model_version?: string
  timestamp?: string
  all_predictions?: PredictionItem[]
}

export interface PDFReadResponse {
  title: string
  abstract: string
}

// API Response Types
export interface ClassificationApiResponse {
  success: boolean
  data: ClassificationResponse
  message?: string
  error?: string
  timestamp: string
}

export interface PDFReadApiResponse {
  success: boolean
  data: PDFReadResponse
  message?: string
  error?: string
  timestamp: string
}

// Combined types for the demo
export interface ClassificationDemoData {
  input: ClassificationRequest
  result: ClassificationResponse | null
  loading: boolean
  error: string | null
}

export interface PDFUploadData {
  file: File | null
  extractedData: PDFReadResponse | null
  loading: boolean
  error: string | null
} 