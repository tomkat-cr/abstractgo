"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingError, LoadingSpinner } from "@/components/ui/loading-error"
import { useClassification, usePDFUpload } from "@/hooks/api/useClassification"
import { 
  Brain, 
  Upload, 
  FileText, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Download,
  Activity,
  Heart,
  Droplets,
  AlertTriangle
} from "lucide-react"
import { ClassificationResponse } from "@/services/types/classification"

interface ClassificationDemoProps {
  className?: string
}

// Function to calculate confidence level based on scores
function calculateConfidenceLevel(result: ClassificationResponse): {
  level: 'high' | 'medium' | 'low';
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
} {
  if (!result.all_predictions || result.all_predictions.length === 0) {
    return {
      level: 'low',
      label: 'Low Confidence',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: <AlertTriangle className="h-3 w-3 mr-1" />
    }
  }

  const sortedPredictions = [...result.all_predictions].sort((a, b) => b.score - a.score)
  const primaryScore = sortedPredictions[0].score
  const secondaryScore = sortedPredictions[1]?.score || 0
  const scoreDifference = primaryScore - secondaryScore

  // High confidence: primary score > 0.7 and difference > 0.3
  if (primaryScore > 0.7 && scoreDifference > 0.3) {
    return {
      level: 'high',
      label: 'High Confidence',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: <CheckCircle className="h-3 w-3 mr-1" />
    }
  }
  
  // Medium confidence: primary score > 0.5 and difference > 0.15
  if (primaryScore > 0.5 && scoreDifference > 0.15) {
    return {
      level: 'medium',
      label: 'Medium Confidence',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: <AlertTriangle className="h-3 w-3 mr-1" />
    }
  }
  
  // Low confidence: everything else
  return {
    level: 'low',
    label: 'Low Confidence',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: <AlertTriangle className="h-3 w-3 mr-1" />
  }
}

export function ClassificationDemo({ className = "" }: ClassificationDemoProps) {
  const [activeTab, setActiveTab] = useState("text")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const {
    input,
    result,
    loading: classificationLoading,
    error: classificationError,
    predict,
    reset: resetClassification,
    clearError: clearClassificationError,
  } = useClassification()

  const {
    file,
    extractedData,
    loading: pdfLoading,
    error: pdfError,
    uploadPDF,
    reset: resetPDF,
    clearError: clearPDFError,
  } = usePDFUpload()

  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
  })

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.abstract.trim()) return

    try {
      await predict({
        title: formData.title.trim(),
        abstract: formData.abstract.trim(),
      })
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleFileUpload(file)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      const extractedData = await uploadPDF(file)
      
      // Automatically classify the extracted content
      if (extractedData && extractedData.title && extractedData.abstract) {
        await predict({
          title: extractedData.title,
          abstract: extractedData.abstract,
        })
      } else {
        // Error is handled by the hook
      }
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handlePDFExtractAndClassify = async () => {
    if (!extractedData?.title || !extractedData?.abstract) return

    try {
      await predict({
        title: extractedData.title,
        abstract: extractedData.abstract,
      })
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const resetAll = () => {
    resetClassification()
    resetPDF()
    setFormData({ title: "", abstract: "" })
    setSelectedFile(null)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cardiovascular: "bg-red-100 text-red-800",
      neurological: "bg-purple-100 text-purple-800",
      hepatorenal: "bg-blue-100 text-blue-800",
      oncological: "bg-green-100 text-green-800",
    }
    return colors[category.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.8) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Live Classification Demo
        </CardTitle>
        <CardDescription>
          Test the AI classification system with your own medical articles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input Section */}
          <div className="space-y-4">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 border-b border-gray-200 dark:border-gray-700">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Text Input Card */}
            {activeTab === "text" && (
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Text Input
                  </CardTitle>
                  <CardDescription>
                    Enter the title and abstract of your medical article for classification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleTextSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Article Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter the article title..."
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        maxLength={500}
                        disabled={classificationLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.title.length}/500 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="abstract">Abstract</Label>
                      <Textarea
                        id="abstract"
                        placeholder="Enter the article abstract..."
                        value={formData.abstract}
                        onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                        rows={6}
                        maxLength={5000}
                        disabled={classificationLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.abstract.length}/5000 characters
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={classificationLoading || !formData.title.trim() || !formData.abstract.trim()}
                        className="flex items-center gap-2"
                      >
                        {classificationLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Brain className="h-4 w-4" />
                        )}
                        Classify Article
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={resetAll}
                        disabled={classificationLoading}
                      >
                        Reset
                      </Button>
                    </div>
                  </form>

                  {/* Error Display */}
                  {classificationError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">{classificationError}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearClassificationError}
                        className="ml-auto h-6 px-2"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* PDF Upload Card */}
            {activeTab === "pdf" && (
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    PDF Upload
                  </CardTitle>
                  <CardDescription>
                    Upload a PDF file to extract title and abstract for classification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdf-upload">Upload PDF Article</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        disabled={pdfLoading}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximum file size: 10MB. Only PDF files are supported.
                    </p>
                    {selectedFile && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">
                          Selected: {selectedFile.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Error Display */}
                  {pdfError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">{pdfError}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearPDFError}
                        className="ml-auto h-6 px-2"
                      >
                        ×
                      </Button>
                    </div>
                  )}

                  {/* PDF Loading */}
                  {pdfLoading && (
                    <div className="flex items-center justify-center p-8">
                      <LoadingSpinner text="Extracting text from PDF..." />
                    </div>
                  )}

                  {/* Extracted Data Display */}
                  {extractedData && extractedData.title && extractedData.abstract && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Extracted Content
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="font-medium">Title:</Label>
                          <p className="text-sm bg-white p-2 rounded border">
                            {extractedData.title}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="font-medium">Abstract:</Label>
                          <p className="text-sm bg-white p-2 rounded border max-h-32 overflow-y-auto">
                            {extractedData.abstract}
                          </p>
                        </div>

                        <Button 
                          onClick={handlePDFExtractAndClassify}
                          disabled={classificationLoading}
                          className="w-full flex items-center gap-2"
                        >
                          {classificationLoading ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Brain className="h-4 w-4" />
                          )}
                          Classify Extracted Content
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Results Display */}
          <div className="lg:sticky lg:top-6">
            {result ? (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                      <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Classification Results
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        AI confidence scores and category predictions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6 space-y-6">
                  {/* Processing Info */}
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Processed at {new Date(result.timestamp || Date.now()).toLocaleTimeString()}</span>
                    </div>
                    {(() => {
                      const confidenceInfo = calculateConfidenceLevel(result)
                      return (
                        <Badge 
                          variant="outline" 
                          className={`${confidenceInfo.borderColor} ${confidenceInfo.color} ${confidenceInfo.bgColor} dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                        >
                          {confidenceInfo.icon}
                          {confidenceInfo.label}
                        </Badge>
                      )
                    })()}
                  </div>

                  {/* Category Predictions */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Category Predictions</h3>
                    
                    {result.all_predictions && result.all_predictions.length > 0 && (
                      <div className="space-y-3">
                        {result.all_predictions
                          .sort((a, b) => b.score - a.score) // Sort by confidence descending
                          .map((prediction, index) => {
                            const isPrimary = index === 0;
                            const percentage = (prediction.score * 100).toFixed(1);
                            
                            return (
                              <div 
                                key={prediction.label}
                                className={`p-4 rounded-lg border transition-all ${
                                  isPrimary 
                                    ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 shadow-sm dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700' 
                                    : 'bg-white border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${
                                      prediction.label === 'neurological' ? 'bg-purple-100 dark:bg-purple-900' :
                                      prediction.label === 'oncological' ? 'bg-green-100 dark:bg-green-900' :
                                      prediction.label === 'cardiovascular' ? 'bg-red-100 dark:bg-red-900' :
                                      'bg-blue-100 dark:bg-blue-900'
                                    }`}>
                                      {prediction.label === 'neurological' ? (
                                        <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                      ) : prediction.label === 'oncological' ? (
                                        <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                                      ) : prediction.label === 'cardiovascular' ? (
                                        <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                                      ) : (
                                        <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                                        {prediction.label}
                                      </span>
                                      {isPrimary && (
                                        <Badge className="ml-2 bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                                          Primary
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <span className={`font-bold text-lg ${
                                    isPrimary ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {percentage}%
                                  </span>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-500 ${
                                      isPrimary ? 'bg-purple-600 dark:bg-purple-400' : 'bg-gray-400 dark:bg-gray-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>

                  {/* Additional Details */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                    {result.processing_time && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Processing Time:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {(result.processing_time / 1000).toFixed(2)}s
                        </span>
                      </div>
                    )}
                    
                    {result.model_version && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">Model Version:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{result.model_version}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300 font-medium">Classification ID:</span>
                      <span className="text-gray-900 dark:text-white font-semibold">
                        #{Date.now().toString().slice(-12)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                      <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Classification Results
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        AI confidence scores and category predictions
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-12 pb-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700">
                      <Brain className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Ready for Classification
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 max-w-sm">
                        Enter article details or upload a PDF and click 'Classify Article'
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <div className="h-8"></div> {/* Bottom spacing */}
      </CardContent>

        {/* Reset All Button */}
        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={resetAll}
            className="w-full"
            disabled={classificationLoading || pdfLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset All
          </Button>
        </div>
    </Card>
  )
}
