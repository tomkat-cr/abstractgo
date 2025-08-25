"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useConfusionMatrix } from "@/hooks/api/useDashboard"
import { Loader2, Heart, Brain, Activity, Microscope, Check } from "lucide-react"
import { useState } from "react"

interface ConfusionMatrixProps {
  className?: string
}

export function ConfusionMatrix({ className = "" }: ConfusionMatrixProps) {
  const { data: confusionMatrix, loading, error, refetch } = useConfusionMatrix()
  const [activeView, setActiveView] = useState<"table" | "heatmap">("heatmap")

  // Icon mapping for medical categories
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cardiovascular':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'neurological':
        return <Brain className="h-4 w-4 text-purple-500" />
      case 'hepatorenal':
        return <Activity className="h-4 w-4 text-blue-500" />
      case 'oncological':
        return <Microscope className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  // Calculate heatmap data for individual category confusion matrices
  const getCategoryHeatmapData = () => {
    if (!confusionMatrix?.matrix || !confusionMatrix?.categories) return []
    
    const categories = confusionMatrix.categories
    const heatmapData: Array<{
      category: string
      matrix: number[][]
      values: { tp: number; fn: number; fp: number; tn: number }
      total: number
      accuracy: number
    }> = []
    
    categories.forEach((category) => {
      const categoryMatrix = confusionMatrix.matrix[category]
      if (!categoryMatrix || !Array.isArray(categoryMatrix) || categoryMatrix.length < 2) {
        return
      }

      // Extract values from 2x2 matrix: [[TP, FN], [FP, TN]]
      const tp = categoryMatrix[0]?.[0] || 0
      const fn = categoryMatrix[0]?.[1] || 0
      const fp = categoryMatrix[1]?.[0] || 0
      const tn = categoryMatrix[1]?.[1] || 0
      
      // Create 2x2 matrix for this category
      const matrix = [
        [tn, fp], // Actual Negative: [TN, FP]
        [fn, tp]  // Actual Positive: [FN, TP]
      ]
      
      heatmapData.push({
        category,
        matrix,
        values: { tp, fn, fp, tn },
        total: tp + fn + fp + tn,
        accuracy: (tp + tn) / (tp + fn + fp + tn)
      })
    })
    
    return heatmapData
  }

  // Get cell background color based on value and max value
  const getCellColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue
    const alpha = 0.3 + intensity * 0.7 // Range from 0.3 to 1.0
    return `rgba(59, 130, 246, ${alpha})` // Blue color with varying opacity
  }

  // Calculate overall statistics
  const getOverallStats = () => {
    if (!confusionMatrix) return { total: 0, accuracy: 0, bestCategory: '' }
    
    let totalPredictions = 0
    let totalCorrect = 0
    let bestCategory = ''
    let bestAccuracy = 0
    
    confusionMatrix.categories.forEach((category) => {
      const matrix = confusionMatrix.matrix[category]
      if (matrix && Array.isArray(matrix) && matrix.length >= 2) {
        const tp = matrix[0]?.[0] || 0
        const fn = matrix[0]?.[1] || 0
        const fp = matrix[1]?.[0] || 0
        const tn = matrix[1]?.[1] || 0
        const total = tp + fn + fp + tn
        const accuracy = total > 0 ? (tp + tn) / total : 0
        
        totalPredictions += total
        totalCorrect += (tp + tn)
        
        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy
          bestCategory = category
        }
      }
    })
    
    const overallAccuracy = totalPredictions > 0 ? totalCorrect / totalPredictions : 0
    
    return {
      total: totalPredictions,
      accuracy: overallAccuracy,
      bestCategory: bestCategory.charAt(0).toUpperCase() + bestCategory.slice(1)
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Confusion Matrix
          </CardTitle>
          <CardDescription>
            Interactive classification accuracy heatmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Confusion Matrix
          </CardTitle>
          <CardDescription>
            Interactive classification accuracy heatmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load confusion matrix</p>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!confusionMatrix || !confusionMatrix.matrix || !confusionMatrix.categories) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Confusion Matrix
          </CardTitle>
          <CardDescription>
            Interactive classification accuracy heatmap
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No confusion matrix data available
          </div>
        </CardContent>
      </Card>
    )
  }

  const categories = confusionMatrix.categories
  const accuracyPerCategory = confusionMatrix.accuracy_per_category || {}
  const heatmapData = getCategoryHeatmapData()
  const stats = getOverallStats()

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Confusion Matrix
            </CardTitle>
            <CardDescription>
              Interactive classification accuracy heatmap
            </CardDescription>
          </div>
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "table" | "heatmap")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {activeView === "table" ? (
          // Table View
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Categoría</TableHead>
                    <TableHead className="text-center font-semibold">TP</TableHead>
                    <TableHead className="text-center font-semibold">FN</TableHead>
                    <TableHead className="text-center font-semibold">FP</TableHead>
                    <TableHead className="text-center font-semibold">TN</TableHead>
                    <TableHead className="text-center font-semibold">Accuracy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => {
                    const categoryMatrix = confusionMatrix.matrix[category]
                    if (!categoryMatrix || !Array.isArray(categoryMatrix) || categoryMatrix.length < 2) {
                      return null
                    }

                    const tp = categoryMatrix[0]?.[0] || 0
                    const fn = categoryMatrix[0]?.[1] || 0
                    const fp = categoryMatrix[1]?.[0] || 0
                    const tn = categoryMatrix[1]?.[1] || 0
                    const accuracy = accuracyPerCategory[category] || 0

                    return (
                      <TableRow key={category}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(category)}
                            <span className="capitalize">{category}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                            {tp.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 border-pink-200">
                            {fn.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">
                            {fp.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">
                            {tn.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 font-mono">
                            {(accuracy * 100).toFixed(4)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Metrics Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200 text-xs">
                    TP
                  </Badge>
                  <span className="text-sm text-gray-600">True Positives</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-100 border-pink-200 text-xs">
                    FN
                  </Badge>
                  <span className="text-sm text-gray-600">False Negatives</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200 text-xs">
                    FP
                  </Badge>
                  <span className="text-sm text-gray-600">False Positives</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 text-xs">
                    TN
                  </Badge>
                  <span className="text-sm text-gray-600">True Negatives</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Heatmap View
          <>
            <div className="space-y-8">
              {heatmapData.map((item) => {
                const maxValue = Math.max(...item.matrix.flat())
                
                return (
                  <div key={item.category} className="border rounded-lg p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <span className="capitalize">Confusion Matrix for {item.category}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Accuracy: {(item.accuracy * 100).toFixed(1)}% | Total: {item.total.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <div className="inline-block">
                        {/* Column Headers */}
                        <div className="grid grid-cols-3 gap-1 mb-2">
                          <div className="h-8"></div> {/* Empty corner */}
                          <div className="h-8 flex items-center justify-center text-xs font-medium text-center">
                            Predicted Negative
                          </div>
                          <div className="h-8 flex items-center justify-center text-xs font-medium text-center">
                            Predicted Positive
                          </div>
                        </div>
                        
                        {/* Matrix Rows */}
                        {item.matrix.map((row, rowIndex) => (
                          <div key={rowIndex} className="grid grid-cols-3 gap-1 mb-1">
                            {/* Row Header */}
                            <div className="h-12 flex items-center text-xs font-medium">
                              {rowIndex === 0 ? "Actual Negative" : "Actual Positive"}
                            </div>
                            
                            {/* Matrix Cells */}
                            {row.map((value, colIndex) => (
                              <div
                                key={colIndex}
                                className="h-12 flex items-center justify-center text-xs font-medium relative group cursor-pointer border"
                                style={{
                                  backgroundColor: getCellColor(value, maxValue),
                                  color: value / maxValue > 0.5 ? 'white' : 'black'
                                }}
                                title={`${rowIndex === 0 ? "Actual Negative" : "Actual Positive"} → ${colIndex === 0 ? "Predicted Negative" : "Predicted Positive"}\nCount: ${value} | Percentage: ${(value / item.total * 100).toFixed(1)}%`}
                              >
                                <div className="font-bold">{value}</div>
                                
                                {/* Hover Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                  <div className="font-semibold">
                                    {rowIndex === 0 ? "Actual Negative" : "Actual Positive"} → {colIndex === 0 ? "Predicted Negative" : "Predicted Positive"}
                                  </div>
                                  <div>Count: {value} | Percentage: {(value / item.total * 100).toFixed(1)}%</div>
                                  <div className="flex items-center gap-1">
                                    {rowIndex === colIndex ? (
                                      <>
                                        <Check className="h-3 w-3 text-green-400" />
                                        <span>Correct Classification</span>
                                      </>
                                    ) : (
                                      <>
                                        <span>Misclassification</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Category Statistics */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-semibold text-green-700">True Positives</div>
                        <div className="text-lg font-bold">{item.values.tp}</div>
                      </div>
                      <div className="text-center p-2 bg-red-50 rounded">
                        <div className="font-semibold text-red-700">False Negatives</div>
                        <div className="text-lg font-bold">{item.values.fn}</div>
                      </div>
                      <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-semibold text-orange-700">False Positives</div>
                        <div className="text-lg font-bold">{item.values.fp}</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="font-semibold text-blue-700">True Negatives</div>
                        <div className="text-lg font-bold">{item.values.tn}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Overall Statistics */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-3 text-gray-700">Overall Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Predictions:</span>
                  <span className="font-medium">{stats.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Overall Accuracy:</span>
                  <span className="font-medium text-green-600">{(stats.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Category:</span>
                  <span className="font-medium">{stats.bestCategory}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
