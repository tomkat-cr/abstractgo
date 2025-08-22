"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, TrendingUp, Activity, Users } from "lucide-react"

interface DistributionData {
  category: string
  count: number
  percentage: number
  trend: number
  monthlyData: Array<{ month: string; count: number }>
  qualityScore: number
  avgConfidence: number
  icon: any
  color: string
}

interface DistributionAnalysisProps {
  data: DistributionData[]
  className?: string
}

export function DistributionAnalysis({ data, className = "" }: DistributionAnalysisProps) {
  const [viewMode, setViewMode] = useState<"pie" | "bar" | "trend">("pie")
  const [timeRange, setTimeRange] = useState<"6m" | "12m" | "24m">("12m")
  const [sortBy, setSortBy] = useState<"count" | "percentage" | "trend">("count")

  const totalArticles = data.reduce((sum, item) => sum + item.count, 0)
  const avgQuality = data.reduce((sum, item) => sum + item.qualityScore, 0) / data.length
  const avgConfidence = data.reduce((sum, item) => sum + item.avgConfidence, 0) / data.length

  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case "percentage":
        return b.percentage - a.percentage
      case "trend":
        return b.trend - a.trend
      default:
        return b.count - a.count
    }
  })

  const getTrendColor = (trend: number) => {
    if (trend > 5) return "text-green-600"
    if (trend > 0) return "text-green-500"
    if (trend > -5) return "text-yellow-600"
    return "text-red-600"
  }

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? "↗" : "↘"
  }

  const getQualityBadge = (score: number) => {
    if (score >= 90) return { variant: "default" as const, label: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 80) return { variant: "secondary" as const, label: "Good", color: "bg-blue-100 text-blue-800" }
    if (score >= 70) return { variant: "outline" as const, label: "Fair", color: "bg-yellow-100 text-yellow-800" }
    return { variant: "destructive" as const, label: "Poor", color: "bg-red-100 text-red-800" }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Distribution Analysis
            </CardTitle>
            <CardDescription>Comprehensive dataset composition and quality metrics</CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pie">Pie View</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="trend">Trends</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="count">By Count</SelectItem>
                <SelectItem value="percentage">By %</SelectItem>
                <SelectItem value="trend">By Trend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="space-y-6">
          <TabsContent value="pie" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">{totalArticles.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Articles</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-accent">{data.length}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-secondary">{avgQuality.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Avg Quality</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold text-primary">{(avgConfidence * 100).toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Avg Confidence</div>
              </div>
            </div>

            {/* Pie Chart Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Category Breakdown</h4>
                {sortedData.map((item, index) => {
                  const IconComponent = item.icon
                  const quality = getQualityBadge(item.qualityScore)

                  return (
                    <div key={item.category} className="space-y-3 p-4 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.color}`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{item.category}</div>
                            <div className="text-xs text-muted-foreground">{item.count.toLocaleString()} articles</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.percentage.toFixed(1)}%</div>
                          <div className={`text-xs flex items-center gap-1 ${getTrendColor(item.trend)}`}>
                            <span>{getTrendIcon(item.trend)}</span>
                            <span>{Math.abs(item.trend).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>

                      <Progress value={item.percentage} className="h-2" />

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Badge className={quality.color} variant="secondary">
                            {quality.label}
                          </Badge>
                          <span className="text-muted-foreground">Quality: {item.qualityScore}%</span>
                        </div>
                        <span className="text-muted-foreground">
                          Confidence: {(item.avgConfidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Visual Distribution</h4>
                <div className="relative">
                  {/* Simple visual representation */}
                  <div className="grid grid-cols-2 gap-2">
                    {sortedData.map((item, index) => (
                      <div
                        key={item.category}
                        className="p-4 rounded-lg border-2 border-dashed"
                        style={{
                          borderColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                          backgroundColor: `hsl(var(--chart-${(index % 5) + 1}) / 0.1)`,
                        }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: `hsl(var(--chart-${(index % 5) + 1}))` }}>
                            {item.percentage.toFixed(0)}%
                          </div>
                          <div className="text-xs font-medium">{item.category}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.count.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribution Insights */}
                <div className="space-y-3 p-4 rounded-lg bg-muted/20">
                  <h5 className="font-medium text-sm">Key Insights</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span>
                        <strong>{sortedData[0].category}</strong> has the highest representation (
                        {sortedData[0].percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-blue-600" />
                      <span>
                        Most balanced distribution with{" "}
                        {(
                          Math.max(...data.map((d) => d.percentage)) - Math.min(...data.map((d) => d.percentage))
                        ).toFixed(1)}
                        % variance
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-3 w-3 text-accent" />
                      <span>Average quality score of {avgQuality.toFixed(1)}% across all categories</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bar" className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Comparative Analysis</h4>
              {sortedData.map((item, index) => {
                const IconComponent = item.icon
                const maxCount = Math.max(...data.map((d) => d.count))
                const barWidth = (item.count / maxCount) * 100

                return (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded ${item.color}`}>
                          <IconComponent className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-medium text-sm">{item.category}</span>
                      </div>
                      <div className="text-sm font-mono">{item.count.toLocaleString()}</div>
                    </div>
                    <div className="relative h-8 bg-muted rounded">
                      <div
                        className="h-full rounded transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-3 text-xs font-medium">
                        {item.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="trend" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Trend Analysis</h4>
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="12m">12 Months</SelectItem>
                    <SelectItem value="24m">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sortedData.map((item, index) => {
                const IconComponent = item.icon
                const monthlyData = item.monthlyData.slice(-Number.parseInt(timeRange))

                return (
                  <div key={item.category} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{item.category}</div>
                          <div className="text-xs text-muted-foreground">{timeRange} trend analysis</div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 ${getTrendColor(item.trend)}`}>
                        <span>{getTrendIcon(item.trend)}</span>
                        <span className="font-medium">{Math.abs(item.trend).toFixed(1)}%</span>
                      </div>
                    </div>

                    {/* Simple trend visualization */}
                    <div className="flex items-end gap-1 h-16">
                      {monthlyData.map((month, idx) => {
                        const maxValue = Math.max(...monthlyData.map((m) => m.count))
                        const height = (month.count / maxValue) * 100

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full rounded-t transition-all duration-300"
                              style={{
                                height: `${height}%`,
                                backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
                                minHeight: "4px",
                              }}
                            />
                            <div className="text-xs text-muted-foreground mt-1 rotate-45 origin-left">
                              {month.month}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
