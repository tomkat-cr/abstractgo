"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingError } from "@/components/ui/loading-error"
import { useDistribution } from "@/hooks/api/useDashboard"
import { BarChart3 } from "lucide-react"

interface DistributionAnalysisProps {
  className?: string
}

export function DistributionAnalysis({ className = "" }: DistributionAnalysisProps) {
  const { data: distribution, loading, error, refetch } = useDistribution()

  const getCategoryColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-teal-500"
    ]
    return colors[index % colors.length]
  }

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null
    if (trend > 0) return "↗"
    if (trend < 0) return "↘"
    return "→"
  }

  const getTrendColor = (trend?: number) => {
    if (!trend) return "text-muted-foreground"
    if (trend > 0) return "text-green-600"
    if (trend < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  const totalCount = distribution?.reduce((sum, item) => sum + item.count, 0) || 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Distribution Analysis
        </CardTitle>
        <CardDescription>
          Dataset composition and category distribution trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingError
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingText="Loading distribution data..."
          errorTitle="Failed to load distribution data"
        >
          {distribution && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{totalCount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Articles</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{distribution.length}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {(totalCount / distribution.length).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg per Category</div>
                </div>
              </div>

              {/* Distribution Chart */}
              <div className="space-y-4">
                <h4 className="font-medium">Category Distribution</h4>
                <div className="space-y-3">
                  {distribution.map((item, index) => {
                    const barWidth = (item.count / totalCount) * 100
                    const trendIcon = getTrendIcon(item.trend)
                    const trendColor = getTrendColor(item.trend)
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getCategoryColor(index)}`} />
                            <span className="font-medium">{item.category}</span>
                            {trendIcon && (
                              <span className={`text-xs ${trendColor}`}>
                                {trendIcon} {Math.abs(item.trend || 0).toFixed(1)}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-muted-foreground">{item.count.toLocaleString()}</span>
                            <span className="font-medium min-w-[60px] text-right">{item.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getCategoryColor(index)} transition-all duration-500`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Insights */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Key Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Largest Category:</span>
                      <span className="font-medium">
                        {distribution.reduce((max, item) => item.count > max.count ? item : max).category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Smallest Category:</span>
                      <span className="font-medium">
                        {distribution.reduce((min, item) => item.count < min.count ? item : min).category}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance Score:</span>
                      <span className="font-medium">
                        {((1 - distribution.reduce((sum, item) => sum + Math.abs(item.percentage - 100/distribution.length), 0) / 200) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categories with Growth:</span>
                      <span className="font-medium text-green-600">
                        {distribution.filter(item => (item.trend || 0) > 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Categories with Decline:</span>
                      <span className="font-medium text-red-600">
                        {distribution.filter(item => (item.trend || 0) < 0).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stable Categories:</span>
                      <span className="font-medium text-muted-foreground">
                        {distribution.filter(item => !item.trend || item.trend === 0).length}
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
