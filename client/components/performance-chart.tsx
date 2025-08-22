"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useState } from "react"

interface PerformanceData {
  category: string
  f1Score: number
  precision: number
  recall: number
  support: number
  trend: number
  icon: any
  color: string
}

interface PerformanceChartProps {
  data: PerformanceData[]
  className?: string
}

export function PerformanceChart({ data, className = "" }: PerformanceChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<"f1Score" | "precision" | "recall">("f1Score")
  const [sortBy, setSortBy] = useState<"category" | "performance">("performance")

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "performance") {
      return b[selectedMetric] - a[selectedMetric]
    }
    return a.category.localeCompare(b.category)
  })

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "f1Score":
        return "F1-Score"
      case "precision":
        return "Precision"
      case "recall":
        return "Recall"
      default:
        return metric
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (trend < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600"
    if (trend < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>Detailed metrics across medical categories</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "performance" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("performance")}
            >
              By Performance
            </Button>
            <Button
              variant={sortBy === "category" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("category")}
            >
              Alphabetical
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="f1Score">F1-Score</TabsTrigger>
            <TabsTrigger value="precision">Precision</TabsTrigger>
            <TabsTrigger value="recall">Recall</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedMetric} className="space-y-4 mt-6">
            {sortedData.map((item, index) => {
              const IconComponent = item.icon
              const metricValue = item[selectedMetric]
              const maxValue = Math.max(...data.map((d) => d[selectedMetric]))
              const isTopPerformer = metricValue === maxValue

              return (
                <div
                  key={item.category}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                    isTopPerformer ? "bg-accent/5 border-accent/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.category}</span>
                          {isTopPerformer && (
                            <Badge variant="secondary" className="text-xs bg-accent/20 text-accent">
                              Best
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{item.support.toLocaleString()} samples</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Performance Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <Progress value={metricValue * 100} className="h-3" />
                      </div>
                      <Badge variant="outline" className="min-w-[60px] justify-center font-mono">
                        {(metricValue * 100).toFixed(1)}%
                      </Badge>
                    </div>

                    {/* Trend Indicator */}
                    <div className="flex items-center gap-1 min-w-[60px]">
                      {getTrendIcon(item.trend)}
                      <span className={`text-xs font-medium ${getTrendColor(item.trend)}`}>
                        {item.trend > 0 ? "+" : ""}
                        {item.trend.toFixed(1)}%
                      </span>
                    </div>

                    {/* Detailed Metrics */}
                    <div className="text-xs text-muted-foreground space-y-1 min-w-[120px]">
                      <div className="flex justify-between">
                        <span>F1:</span>
                        <span className="font-mono">{(item.f1Score * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prec:</span>
                        <span className="font-mono">{(item.precision * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rec:</span>
                        <span className="font-mono">{(item.recall * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </TabsContent>
        </Tabs>

        {/* Summary Statistics */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {((data.reduce((sum, item) => sum + item[selectedMetric], 0) / data.length) * 100).toFixed(1)}%
              </div>
              <div className="text-muted-foreground">Avg {getMetricLabel(selectedMetric)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {(Math.max(...data.map((item) => item[selectedMetric])) * 100).toFixed(1)}%
              </div>
              <div className="text-muted-foreground">Best {getMetricLabel(selectedMetric)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {(Math.min(...data.map((item) => item[selectedMetric])) * 100).toFixed(1)}%
              </div>
              <div className="text-muted-foreground">Lowest {getMetricLabel(selectedMetric)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {data.reduce((sum, item) => sum + item.support, 0).toLocaleString()}
              </div>
              <div className="text-muted-foreground">Total Samples</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
