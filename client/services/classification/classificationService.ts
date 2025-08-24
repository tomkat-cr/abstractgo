import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/config/api'
import {
  ClassificationRequest,
  ClassificationResponse,
  PDFUploadRequest,
  PDFReadResponse,
  ClassificationApiResponse,
  PDFReadApiResponse,
} from '@/services/types/classification'

export class ClassificationService {
  // Predict classification for text input
  async predictClassification(request: ClassificationRequest): Promise<ClassificationResponse> {
    try {
      const response = await apiClient.post<ClassificationApiResponse>(
        API_ENDPOINTS.CLASSIFICATION.PREDICT,
        request
      )
      return response.data
    } catch (error) {
      console.error('Error predicting classification:', error)
      throw error
    }
  }

  // Upload PDF and extract title/abstract
  async uploadPDFAndExtract(file: File): Promise<PDFReadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post<PDFReadApiResponse>(
        API_ENDPOINTS.CLASSIFICATION.PDF_READ,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('Error uploading PDF:', error)
      throw error
    }
  }

  // Batch prediction for multiple articles
  async batchPredict(requests: ClassificationRequest[]): Promise<ClassificationResponse[]> {
    try {
      const response = await apiClient.post<ClassificationApiResponse[]>(
        API_ENDPOINTS.CLASSIFICATION.BATCH_PREDICT,
        { articles: requests }
      )
      return response.data.map(item => item.data)
    } catch (error) {
      console.error('Error in batch prediction:', error)
      throw error
    }
  }

  // Get classification history
  async getClassificationHistory(limit: number = 50): Promise<ClassificationResponse[]> {
    try {
      const response = await apiClient.get<ClassificationApiResponse[]>(
        `${API_ENDPOINTS.CLASSIFICATION.HISTORY}?limit=${limit}`
      )
      return response.data.map(item => item.data)
    } catch (error) {
      console.error('Error fetching classification history:', error)
      throw error
    }
  }

  // Validate input before sending to API
  validateClassificationInput(input: ClassificationRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!input.title || input.title.trim().length === 0) {
      errors.push('Title is required')
    }

    if (!input.abstract || input.abstract.trim().length === 0) {
      errors.push('Abstract is required')
    }

    if (input.title && input.title.length > 500) {
      errors.push('Title must be less than 500 characters')
    }

    if (input.abstract && input.abstract.length > 5000) {
      errors.push('Abstract must be less than 5000 characters')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  // Validate PDF file
  validatePDFFile(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!file) {
      errors.push('No file selected')
      return { valid: false, errors }
    }

    if (file.type !== 'application/pdf') {
      errors.push('File must be a PDF')
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      errors.push('File size must be less than 10MB')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

// Export singleton instance
export const classificationService = new ClassificationService()
export default classificationService 