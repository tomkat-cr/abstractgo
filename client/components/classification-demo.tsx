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
  Download
} from "lucide-react"

interface ClassificationDemoProps {
  className?: string
}

export function ClassificationDemo({ className = "" }: ClassificationDemoProps) {
  const [activeTab, setActiveTab] = useState("text")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await uploadPDF(file)
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handlePDFExtractAndClassify = async () => {
    if (!extractedData?.success) return

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
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="pdf">PDF Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-6">
            {/* Text Input Form */}
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
                    <Zap className="h-4 w-4" />
                  )}
                  Classify Article
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetAll}
                  disabled={classificationLoading}
                >
                  <RefreshCw className="h-4 w-4" />
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

            {/* Results Display */}
            {result && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Classification Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Category:</span>
                    <Badge className={getCategoryColor(result.category)}>
                      {result.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Confidence:</span>
                    <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Processing Time:</span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {result.processing_time}ms
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Model Version:</span>
                    <span className="text-sm text-muted-foreground">{result.model_version}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pdf" className="space-y-6">
            {/* PDF Upload Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pdf-upload">Upload PDF Article</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    disabled={pdfLoading}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={pdfLoading}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 10MB. Only PDF files are supported.
                </p>
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
              {extractedData && extractedData.success && (
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

              {/* Classification Results from PDF */}
              {result && activeTab === "pdf" && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Classification Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Category:</span>
                      <Badge className={getCategoryColor(result.category)}>
                        {result.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Confidence:</span>
                      <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Processing Time:</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {result.processing_time}ms
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

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
      </CardContent>
    </Card>
  )
}
