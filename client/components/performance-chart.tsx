"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingError } from "@/components/ui/loading-error"
import { usePerformance } from "@/hooks/api/useDashboard"
import { BarChart3 } from "lucide-react"

interface PerformanceChartProps {
  className?: string
}

export function PerformanceChart({ className = "" }: PerformanceChartProps) {
  const { data: performance, loading, error, refetch } = usePerformance()

  const getStatusColor = (accuracy: number) => {
    if (accuracy >= 0.9) return "text-green-600"
    if (accuracy >= 0.8) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = (accuracy: number) => {
    if (accuracy >= 0.9) return "Excellent"
    if (accuracy >= 0.8) return "Good"
    return "Needs Improvement"
  }

  const getStatusBgColor = (accuracy: number) => {
    if (accuracy >= 0.9) return "bg-green-100 text-green-800"
    if (accuracy >= 0.8) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Category Performance
        </CardTitle>
        <CardDescription>
          Detailed performance metrics by medical category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingError
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingText="Loading performance data..."
          errorTitle="Failed to load performance data"
        >
          {performance && (
            <div className="space-y-6">
              {performance.map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">{item.category}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBgColor(item.accuracy)}`}>
                      {getStatusBadge(item.accuracy)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Accuracy */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className={`font-medium ${getStatusColor(item.accuracy)}`}>
                          {(item.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatusColor(item.accuracy).replace('text-', 'bg-')}`}
                          style={{ width: `${item.accuracy * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* F1 Score */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">F1 Score</span>
                        <span className={`font-medium ${getStatusColor(item.f1_score)}`}>
                          {(item.f1_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatusColor(item.f1_score).replace('text-', 'bg-')}`}
                          style={{ width: `${item.f1_score * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Precision */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Precision</span>
                        <span className={`font-medium ${getStatusColor(item.precision)}`}>
                          {(item.precision * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatusColor(item.precision).replace('text-', 'bg-')}`}
                          style={{ width: `${item.precision * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{item.total_predictions}</div>
                      <div className="text-xs text-muted-foreground">Total Predictions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{item.correct_predictions}</div>
                      <div className="text-xs text-muted-foreground">Correct</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {item.total_predictions - item.correct_predictions}
                      </div>
                      <div className="text-xs text-muted-foreground">Incorrect</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {((item.correct_predictions / item.total_predictions) * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Performance Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {performance.filter(p => p.accuracy >= 0.9).length}
                    </div>
                    <div className="text-muted-foreground">Excellent Categories</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">
                      {performance.filter(p => p.accuracy >= 0.8 && p.accuracy < 0.9).length}
                    </div>
                    <div className="text-muted-foreground">Good Categories</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {performance.filter(p => p.accuracy < 0.8).length}
                    </div>
                    <div className="text-muted-foreground">Needs Improvement</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </LoadingError>
      </CardContent>
    </Card>
  )
}
