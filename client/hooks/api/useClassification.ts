import { useState, useCallback } from 'react'
import { classificationService } from '@/services/classification/classificationService'
import {
  ClassificationRequest,
  ClassificationResponse,
  PDFReadResponse,
  ClassificationDemoData,
  PDFUploadData,
} from '@/services/types/classification'

// Hook for classification prediction
export const useClassification = () => {
  const [data, setData] = useState<ClassificationDemoData>({
    input: { title: '', abstract: '' },
    result: null,
    loading: false,
    error: null,
  })

  const predict = useCallback(async (request: ClassificationRequest) => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      // Validate input
      const validation = classificationService.validateClassificationInput(request)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }

      const result = await classificationService.predictClassification(request)
      
      setData({
        input: request,
        result,
        loading: false,
        error: null,
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to predict classification'
      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setData({
      input: { title: '', abstract: '' },
      result: null,
      loading: false,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setData(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...data,
    predict,
    reset,
    clearError,
  }
}

// Hook for PDF upload and extraction
export const usePDFUpload = () => {
  const [data, setData] = useState<PDFUploadData>({
    file: null,
    extractedData: null,
    loading: false,
    error: null,
  })

  const uploadPDF = useCallback(async (file: File) => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      // Validate file
      const validation = classificationService.validatePDFFile(file)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }

      const result = await classificationService.uploadPDFAndExtract(file)
      
      setData({
        file,
        extractedData: result,
        loading: false,
        error: null,
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload PDF'
      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setData({
      file: null,
      extractedData: null,
      loading: false,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setData(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...data,
    uploadPDF,
    reset,
    clearError,
  }
}

// Hook for batch classification
export const useBatchClassification = () => {
  const [data, setData] = useState<{
    results: ClassificationResponse[]
    loading: boolean
    error: string | null
  }>({
    results: [],
    loading: false,
    error: null,
  })

  const batchPredict = useCallback(async (requests: ClassificationRequest[]) => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      const results = await classificationService.batchPredict(requests)
      
      setData({
        results,
        loading: false,
        error: null,
      })

      return results
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to perform batch prediction'
      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setData({
      results: [],
      loading: false,
      error: null,
    })
  }, [])

  const clearError = useCallback(() => {
    setData(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...data,
    batchPredict,
    reset,
    clearError,
  }
}

// Hook for classification history
export const useClassificationHistory = (limit: number = 50) => {
  const [data, setData] = useState<{
    history: ClassificationResponse[]
    loading: boolean
    error: string | null
  }>({
    history: [],
    loading: true,
    error: null,
  })

  const fetchHistory = useCallback(async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }))
      
      const history = await classificationService.getClassificationHistory(limit)
      
      setData({
        history,
        loading: false,
        error: null,
      })

      return history
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch classification history'
      setData(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }))
      throw error
    }
  }, [limit])

  const clearError = useCallback(() => {
    setData(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...data,
    fetchHistory,
    clearError,
  }
} 