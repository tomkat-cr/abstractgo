"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingError } from "@/components/ui/loading-error"
import { useMetrics } from "@/hooks/api/useDashboard"
import { Activity, Brain, Heart, Microscope } from "lucide-react"

interface MetricCardProps {
  className?: string
}

export function MetricCard({ className = "" }: MetricCardProps) {
  const { data: metrics, loading, error, refetch } = useMetrics()

  // Helper function to calculate average from category-based metrics
  const calculateAverage = (categoryMetrics: Record<string, number> | undefined): number => {
    if (!categoryMetrics) return 0
    const values = Object.values(categoryMetrics)
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
  }

  const metricConfigs = [
    {
      title: "F1-Score",
      value: `${(calculateAverage(metrics?.f1_score) * 100).toFixed(1)}%`,
      description: "Average F1-score across all categories",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Accuracy",
      value: `${(calculateAverage(metrics?.accuracy) * 100).toFixed(1)}%`,
      description: "Average accuracy across all categories",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Articles",
      value: metrics?.total_articles?.toLocaleString() || "0",
      description: "Articles processed to date",
      icon: Microscope,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Processing Speed",
      value: metrics?.processing_speed ? `${metrics.processing_speed} ms` : "0 ms",
      description: "Average processing time per article",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <LoadingError
      loading={loading}
      error={error}
      onRetry={refetch}
      loadingText="Loading metrics..."
      errorTitle="Failed to load metrics"
      className={className}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricConfigs.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </LoadingError>
  )
}
