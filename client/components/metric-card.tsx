"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CircularGauge } from "./circular-gauge"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  type?: "gauge" | "progress" | "number"
  max?: number
  unit?: string
  trend?: {
    value: number
    label: string
    positive: boolean
  }
  color?: string
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  type = "number",
  max = 1,
  unit = "",
  trend,
  color = "hsl(var(--accent))",
}: MetricCardProps) {
  const numericValue = typeof value === "string" ? Number.parseFloat(value) : value

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {type === "gauge" ? (
              <div className="flex items-center gap-4">
                <CircularGauge value={numericValue} max={max} size={80} strokeWidth={6} color={color} />
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {max === 1 ? (numericValue * 100).toFixed(1) : numericValue}
                    {max === 1 ? "%" : unit}
                  </div>
                  {trend && (
                    <div
                      className={`text-xs flex items-center gap-1 mt-1 ${
                        trend.positive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span>{trend.positive ? "↗" : "↘"}</span>
                      <span>
                        {trend.value}% {trend.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : type === "progress" ? (
              <div>
                <div className="text-2xl font-bold text-primary mb-2">
                  {max === 1 ? (numericValue * 100).toFixed(1) : numericValue}
                  {max === 1 ? "%" : unit}
                </div>
                <Progress value={max === 1 ? numericValue * 100 : (numericValue / max) * 100} className="h-3" />
                {trend && (
                  <div
                    className={`text-xs flex items-center gap-1 mt-2 ${
                      trend.positive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span>{trend.positive ? "↗" : "↘"}</span>
                    <span>
                      {trend.value}% {trend.label}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold text-primary">
                  {typeof value === "number" ? value.toLocaleString() : value}
                  {unit}
                </div>
                {trend && (
                  <div
                    className={`text-xs flex items-center gap-1 mt-1 ${
                      trend.positive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span>{trend.positive ? "↗" : "↘"}</span>
                    <span>
                      {trend.value}% {trend.label}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
