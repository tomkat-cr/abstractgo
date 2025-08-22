"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Microscope,
  Clock,
  FileText,
  Sparkles,
  Activity,
  Brain,
  Heart,
  Loader2,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  Upload,
  File,
} from "lucide-react"

interface ClassificationResult {
  predictions: Array<{
    category: string
    confidence: number
    icon: any
    color: string
  }>
  timestamp: string
  processingTime: number
  confidence: "high" | "medium" | "low"
  id: string
}

interface ClassificationHistory {
  id: string
  title: string
  category: string
  confidence: number
  timestamp: string
}

export function ClassificationDemo() {
  const [articleTitle, setArticleTitle] = useState("")
  const [articleAbstract, setArticleAbstract] = useState("")
  const [isClassifying, setIsClassifying] = useState(false)
  const [isProcessingPdf, setIsProcessingPdf] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState("")
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null)
  const [classificationHistory, setClassificationHistory] = useState<ClassificationHistory[]>([])
  const [selectedExample, setSelectedExample] = useState("")

  const exampleArticles = [
    {
      id: "cardio",
      title: "Effects of ACE Inhibitors on Cardiovascular Outcomes in Heart Failure Patients",
      abstract:
        "This randomized controlled trial examined the efficacy of ACE inhibitors in reducing cardiovascular mortality and morbidity in patients with chronic heart failure. A total of 2,500 patients were enrolled and followed for 24 months. Primary endpoints included cardiovascular death, myocardial infarction, and heart failure hospitalization.",
      category: "Cardiovascular",
    },
    {
      id: "neuro",
      title: "Neuroplasticity and Cognitive Recovery Following Stroke: A Longitudinal Study",
      abstract:
        "We investigated neuroplasticity mechanisms underlying cognitive recovery in stroke patients through longitudinal neuroimaging and cognitive assessments. Fifty-eight patients with ischemic stroke underwent comprehensive neuropsychological testing and fMRI scanning at 1, 3, 6, and 12 months post-stroke.",
      category: "Neurological",
    },
    {
      id: "hepato",
      title: "Renal Function Preservation in Chronic Kidney Disease: Role of SGLT2 Inhibitors",
      abstract:
        "This study evaluated the nephroprotective effects of SGLT2 inhibitors in patients with chronic kidney disease and diabetes. We analyzed renal function markers, proteinuria, and progression to end-stage renal disease in 1,200 patients over 36 months of treatment.",
      category: "Hepatorenal",
    },
    {
      id: "onco",
      title: "Immunotherapy Response Biomarkers in Non-Small Cell Lung Cancer",
      abstract:
        "We identified predictive biomarkers for immunotherapy response in non-small cell lung cancer patients. Tumor samples from 450 patients were analyzed for PD-L1 expression, tumor mutational burden, and microsatellite instability. Response rates and progression-free survival were correlated with biomarker status.",
      category: "Oncological",
    },
  ]

  const categoryIcons = {
    Cardiovascular: { icon: Heart, color: "bg-red-500" },
    Neurological: { icon: Brain, color: "bg-purple-500" },
    Hepatorenal: { icon: Activity, color: "bg-blue-500" },
    Oncological: { icon: Microscope, color: "bg-green-500" },
  }

  const handleExampleSelect = (exampleId: string) => {
    const example = exampleArticles.find((ex) => ex.id === exampleId)
    if (example) {
      setArticleTitle(example.title)
      setArticleAbstract(example.abstract)
      setSelectedExample(exampleId)
    }
  }

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || file.type !== "application/pdf") {
      alert("Por favor selecciona un archivo PDF válido")
      return
    }

    setIsProcessingPdf(true)
    setUploadedFileName(file.name)

    try {
      // Simulate PDF processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

      // Mock PDF text extraction - in a real implementation, you'd use a PDF parsing library
      const mockExtractedData = {
        title: "Efficacy of Novel Immunotherapy in Advanced Melanoma: A Phase III Randomized Controlled Trial",
        abstract:
          "Background: Advanced melanoma remains a challenging malignancy with limited treatment options. This study evaluated the efficacy and safety of a novel immunotherapy agent in patients with advanced melanoma. Methods: We conducted a randomized, double-blind, placebo-controlled phase III trial involving 450 patients with advanced melanoma. Patients were randomly assigned to receive either the novel immunotherapy or placebo. The primary endpoint was overall survival. Results: The median overall survival was significantly longer in the immunotherapy group compared to placebo (18.2 months vs 11.4 months; hazard ratio, 0.68; 95% CI, 0.54-0.86; P=0.001). The most common adverse events were fatigue, rash, and diarrhea. Conclusions: This novel immunotherapy demonstrated significant improvement in overall survival in patients with advanced melanoma, with a manageable safety profile.",
      }

      setArticleTitle(mockExtractedData.title)
      setArticleAbstract(mockExtractedData.abstract)
      setSelectedExample("") // Clear example selection
    } catch (error) {
      console.error("Error processing PDF:", error)
      alert("Error al procesar el PDF. Por favor intenta de nuevo.")
    } finally {
      setIsProcessingPdf(false)
    }
  }

  const clearForm = () => {
    setArticleTitle("")
    setArticleAbstract("")
    setSelectedExample("")
    setClassificationResult(null)
    setUploadedFileName("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleClassification = async () => {
    if (!articleTitle || !articleAbstract) return

    setIsClassifying(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

    // Generate realistic mock results based on content
    const generatePredictions = () => {
      const text = (articleTitle + " " + articleAbstract).toLowerCase()
      const predictions = [
        { category: "Cardiovascular", confidence: 0.25, ...categoryIcons["Cardiovascular"] },
        { category: "Neurological", confidence: 0.25, ...categoryIcons["Neurological"] },
        { category: "Hepatorenal", confidence: 0.25, ...categoryIcons["Hepatorenal"] },
        { category: "Oncological", confidence: 0.25, ...categoryIcons["Oncological"] },
      ]

      // Boost confidence based on keywords
      if (text.includes("heart") || text.includes("cardio") || text.includes("ace inhibitor")) {
        predictions[0].confidence = 0.78 + Math.random() * 0.15
      } else if (text.includes("neuro") || text.includes("brain") || text.includes("stroke")) {
        predictions[1].confidence = 0.75 + Math.random() * 0.18
      } else if (text.includes("kidney") || text.includes("renal") || text.includes("hepato")) {
        predictions[2].confidence = 0.72 + Math.random() * 0.2
      } else if (text.includes("cancer") || text.includes("tumor") || text.includes("oncol")) {
        predictions[3].confidence = 0.8 + Math.random() * 0.15
      }

      // Normalize remaining confidence
      const primaryIndex = predictions.findIndex((p) => p.confidence > 0.5)
      if (primaryIndex !== -1) {
        const remaining = 1 - predictions[primaryIndex].confidence
        predictions.forEach((p, i) => {
          if (i !== primaryIndex) {
            p.confidence = (remaining / 3) * (0.5 + Math.random())
          }
        })
      }

      return predictions.sort((a, b) => b.confidence - a.confidence)
    }

    const predictions = generatePredictions()
    const processingTime = 1.2 + Math.random() * 0.8
    const topConfidence = predictions[0].confidence
    const confidence = topConfidence > 0.8 ? "high" : topConfidence > 0.6 ? "medium" : "low"

    const result: ClassificationResult = {
      predictions,
      timestamp: new Date().toLocaleTimeString(),
      processingTime,
      confidence,
      id: Date.now().toString(),
    }

    setClassificationResult(result)

    // Add to history
    const historyItem: ClassificationHistory = {
      id: result.id,
      title: articleTitle.substring(0, 50) + (articleTitle.length > 50 ? "..." : ""),
      category: predictions[0].category,
      confidence: predictions[0].confidence,
      timestamp: result.timestamp,
    }

    setClassificationHistory((prev) => [historyItem, ...prev.slice(0, 9)]) // Keep last 10
    setIsClassifying(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Section */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Microscope className="h-5 w-5 text-primary" />
              Real-time Classification
            </CardTitle>
            <CardDescription>
              Input article details or upload a PDF for instant AI-powered medical literature classification - UPDATED
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* PDF Upload Section */}
            <div className="space-y-2">
              <Label>Upload PDF Article</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    disabled={isProcessingPdf}
                    className="file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
                {isProcessingPdf && (
                  <Button variant="outline" size="icon" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </Button>
                )}
              </div>
              {uploadedFileName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <File className="h-4 w-4" />
                  <span>Archivo cargado: {uploadedFileName}</span>
                </div>
              )}
              {isProcessingPdf && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Upload className="h-4 w-4" />
                  <span>Extrayendo título y abstract del PDF...</span>
                </div>
              )}
            </div>

            {/* Example Selector */}
            <div className="space-y-2">
              <Label>Quick Examples</Label>
              <div className="flex gap-2">
                <Select value={selectedExample} onValueChange={handleExampleSelect}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Choose an example article..." />
                  </SelectTrigger>
                  <SelectContent>
                    {exampleArticles.map((example) => (
                      <SelectItem key={example.id} value={example.id}>
                        {example.category}: {example.title.substring(0, 40)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={clearForm}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Article Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Article Title
                </Label>
                <Textarea
                  id="title"
                  placeholder="Enter the complete article title or upload a PDF to auto-extract..."
                  value={articleTitle}
                  onChange={(e) => setArticleTitle(e.target.value)}
                  className="min-h-[80px] resize-none"
                  disabled={isProcessingPdf}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{articleTitle.length} characters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => copyToClipboard(articleTitle)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="abstract" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Abstract
                </Label>
                <Textarea
                  id="abstract"
                  placeholder="Paste the article abstract here or upload a PDF to auto-extract. Include methodology, results, and conclusions for best classification accuracy..."
                  value={articleAbstract}
                  onChange={(e) => setArticleAbstract(e.target.value)}
                  className="min-h-[160px] resize-none"
                  disabled={isProcessingPdf}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{articleAbstract.length} characters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => copyToClipboard(articleAbstract)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            {/* Classification Button */}
            <Button
              onClick={handleClassification}
              className="w-full h-12"
              disabled={!articleTitle || !articleAbstract || isClassifying || isProcessingPdf}
            >
              {isClassifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Classifying Article...
                </>
              ) : (
                <>
                  <Microscope className="mr-2 h-4 w-4" />
                  Classify Article
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Classification Results
            </CardTitle>
            <CardDescription>AI confidence scores and category predictions</CardDescription>
          </CardHeader>
          <CardContent>
            {classificationResult ? (
              <div className="space-y-6">
                {/* Processing Info */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Processed at {classificationResult.timestamp}</span>
                  </div>
                  <Badge
                    variant={
                      classificationResult.confidence === "high"
                        ? "default"
                        : classificationResult.confidence === "medium"
                          ? "secondary"
                          : "outline"
                    }
                    className="capitalize"
                  >
                    {classificationResult.confidence === "high" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {classificationResult.confidence === "low" && <AlertCircle className="h-3 w-3 mr-1" />}
                    {classificationResult.confidence} Confidence
                  </Badge>
                </div>

                {/* Predictions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Category Predictions</h4>
                  {classificationResult.predictions.map((pred, index) => {
                    const IconComponent = pred.icon
                    const isTop = index === 0

                    return (
                      <div
                        key={pred.category}
                        className={`p-3 rounded-lg border transition-all ${
                          isTop ? "bg-accent/5 border-accent/30" : "bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${pred.color}`}>
                              <IconComponent className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-medium text-sm">{pred.category}</span>
                            {isTop && (
                              <Badge variant="secondary" className="text-xs">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm font-mono">{(pred.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={pred.confidence * 100} className="h-2" />
                      </div>
                    )
                  })}
                </div>

                {/* Processing Stats */}
                <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span className="font-mono">{classificationResult.processingTime.toFixed(2)}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Version:</span>
                    <span className="font-mono">v2.1.4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classification ID:</span>
                    <span className="font-mono">#{classificationResult.id}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center space-y-3">
                  <Microscope className="h-12 w-12 mx-auto opacity-50" />
                  <div>
                    <p className="font-medium">Ready for Classification</p>
                    <p className="text-sm">Enter article details or upload a PDF and click "Classify Article"</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Classification History */}
        {classificationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Classifications</CardTitle>
              <CardDescription>Your classification history</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {classificationHistory.map((item) => (
                    <div key={item.id} className="p-2 rounded border text-xs">
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="flex justify-between text-muted-foreground mt-1">
                        <span>{item.category}</span>
                        <span>{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="text-muted-foreground">{item.timestamp}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
