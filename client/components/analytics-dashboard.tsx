"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingError } from "@/components/ui/loading-error"
import { useAnalytics } from "@/hooks/api/useDashboard"
import { TrendingUp, Activity, BarChart3 } from "lucide-react"

interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className = "" }: AnalyticsDashboardProps) {
  const { data: analytics, loading, error, refetch } = useAnalytics()

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return "↗"
    if (current < previous) return "↘"
    return "→"
  }

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-600"
    if (current < previous) return "text-red-600"
    return "text-muted-foreground"
  }

  const calculateAverage = (data: number[]) => {
    return data.reduce((sum, val) => sum + val, 0) / data.length
  }

  const calculateGrowth = (data: number[]) => {
    if (data.length < 2) return 0
    const current = data[data.length - 1]
    const previous = data[data.length - 2]
    return ((current - previous) / previous) * 100
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Time series analysis and system performance insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingError
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingText="Loading analytics data..."
          errorTitle="Failed to load analytics data"
        >
          {analytics && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Daily Classifications */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Daily Classifications</p>
                        <p className="text-2xl font-bold">
                          {analytics.daily_classifications[analytics.daily_classifications.length - 1]}
                        </p>
                      </div>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={getTrendColor(
                        analytics.daily_classifications[analytics.daily_classifications.length - 1],
                        analytics.daily_classifications[analytics.daily_classifications.length - 2]
                      )}>
                        {getTrendIcon(
                          analytics.daily_classifications[analytics.daily_classifications.length - 1],
                          analytics.daily_classifications[analytics.daily_classifications.length - 2]
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {calculateGrowth(analytics.daily_classifications).toFixed(1)}% from yesterday
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Average Accuracy */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Average Accuracy</p>
                        <p className="text-2xl font-bold">
                          {(calculateAverage(analytics.accuracy_trend) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={getTrendColor(
                        analytics.accuracy_trend[analytics.accuracy_trend.length - 1],
                        analytics.accuracy_trend[analytics.accuracy_trend.length - 2]
                      )}>
                        {getTrendIcon(
                          analytics.accuracy_trend[analytics.accuracy_trend.length - 1],
                          analytics.accuracy_trend[analytics.accuracy_trend.length - 2]
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {calculateGrowth(analytics.accuracy_trend).toFixed(1)}% trend
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Peak Accuracy */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Peak Accuracy</p>
                        <p className="text-2xl font-bold">
                          {(Math.max(...analytics.accuracy_trend) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">
                        Best performance achieved
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Classifications */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Classifications</p>
                        <p className="text-2xl font-bold">
                          {analytics.daily_classifications.reduce((sum, val) => sum + val, 0).toLocaleString()}
                        </p>
                      </div>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">
                        All time total
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Trends */}
              <div className="space-y-4">
                <h4 className="font-medium">Category Trends (Last 7 Days)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(analytics.categories_trend).map(([category, data]) => {
                    const current = data[data.length - 1]
                    const previous = data[data.length - 2]
                    const growth = calculateGrowth(data)
                    
                    return (
                      <Card key={category}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground capitalize">
                                {category}
                              </p>
                              <p className="text-xl font-bold">{current}</p>
                            </div>
                            <div className={`text-sm ${getTrendColor(current, previous)}`}>
                              {getTrendIcon(current, previous)}
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className={`text-xs ${getTrendColor(current, previous)}`}>
                              {growth > 0 ? '+' : ''}{growth.toFixed(1)}% from yesterday
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h4 className="font-medium">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Processing Speed Trend */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Processing Speed Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span className="font-medium">
                            {analytics.processing_speed_trend[analytics.processing_speed_trend.length - 1]} ms
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average:</span>
                          <span className="font-medium">
                            {calculateAverage(analytics.processing_speed_trend).toFixed(1)} ms
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Best:</span>
                          <span className="font-medium text-green-600">
                            {Math.min(...analytics.processing_speed_trend)} ms
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Error Rate Trend */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Error Rate Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span className="font-medium">
                            {(analytics.error_rate_trend[analytics.error_rate_trend.length - 1] * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Average:</span>
                          <span className="font-medium">
                            {(calculateAverage(analytics.error_rate_trend) * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Lowest:</span>
                          <span className="font-medium text-green-600">
                            {(Math.min(...analytics.error_rate_trend) * 100).toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Insights */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Key Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Best Performing Category:</span>
                      <span className="font-medium">
                        {Object.entries(analytics.categories_trend).reduce((best, [category, data]) => {
                          const avg = calculateAverage(data)
                          const bestAvg = calculateAverage(best[1])
                          return avg > bestAvg ? [category, data] : best
                        })[0]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Most Improved Category:</span>
                      <span className="font-medium text-green-600">
                        {Object.entries(analytics.categories_trend).reduce((best, [category, data]) => {
                          const growth = calculateGrowth(data)
                          const bestGrowth = calculateGrowth(best[1])
                          return growth > bestGrowth ? [category, data] : best
                        })[0]}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">System Reliability:</span>
                      <span className="font-medium">
                        {((1 - calculateAverage(analytics.error_rate_trend)) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Efficiency:</span>
                      <span className="font-medium">
                        {analytics.daily_classifications[analytics.daily_classifications.length - 1] / 
                         analytics.processing_speed_trend[analytics.processing_speed_trend.length - 1] * 1000} articles/hour
                      </span>
                    </div>
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
