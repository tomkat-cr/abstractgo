"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Clock, Target, Zap, AlertCircle, CheckCircle } from "lucide-react"
import { useState } from "react"

interface TimeSeriesData {
  date: string
  accuracy: number
  f1Score: number
  throughput: number
}

interface AnalyticsDashboardProps {
  timeSeriesData: TimeSeriesData[]
  className?: string
}

export function AnalyticsDashboard({ timeSeriesData, className = "" }: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  const filteredData = timeSeriesData.slice(-Number.parseInt(selectedTimeRange))

  const currentMetrics = filteredData[filteredData.length - 1]
  const previousMetrics = filteredData[filteredData.length - 2]

  const getChange = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(1)}%`
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600"
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Advanced Analytics</CardTitle>
            <CardDescription>Performance trends and system insights</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedTimeRange === "7d" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeRange("7d")}
            >
              7 Days
            </Button>
            <Button
              variant={selectedTimeRange === "30d" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeRange("30d")}
            >
              30 Days
            </Button>
            <Button
              variant={selectedTimeRange === "90d" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeRange("90d")}
            >
              90 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Performance Trends</TabsTrigger>
            <TabsTrigger value="insights">System Insights</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Accuracy Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{(currentMetrics?.accuracy * 100).toFixed(1)}%</div>
                  {previousMetrics && (
                    <div
                      className={`text-xs flex items-center gap-1 mt-1 ${getChangeColor(
                        getChange(currentMetrics.accuracy, previousMetrics.accuracy),
                      )}`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      <span>{formatChange(getChange(currentMetrics.accuracy, previousMetrics.accuracy))}</span>
                    </div>
                  )}
                  <Progress value={currentMetrics?.accuracy * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    F1-Score Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{(currentMetrics?.f1Score * 100).toFixed(1)}%</div>
                  {previousMetrics && (
                    <div
                      className={`text-xs flex items-center gap-1 mt-1 ${getChangeColor(
                        getChange(currentMetrics.f1Score, previousMetrics.f1Score),
                      )}`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      <span>{formatChange(getChange(currentMetrics.f1Score, previousMetrics.f1Score))}</span>
                    </div>
                  )}
                  <Progress value={currentMetrics?.f1Score * 100} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-secondary" />
                    Throughput
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{currentMetrics?.throughput}</div>
                  <div className="text-xs text-muted-foreground">articles/sec</div>
                  {previousMetrics && (
                    <div
                      className={`text-xs flex items-center gap-1 mt-1 ${getChangeColor(
                        getChange(currentMetrics.throughput, previousMetrics.throughput),
                      )}`}
                    >
                      <TrendingUp className="h-3 w-3" />
                      <span>{formatChange(getChange(currentMetrics.throughput, previousMetrics.throughput))}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Simple Trend Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Over Time</CardTitle>
                <CardDescription>Accuracy and F1-Score trends for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.slice(-7).map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{data.date}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-sm font-medium text-primary">{(data.accuracy * 100).toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-accent">{(data.f1Score * 100).toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">F1-Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-secondary">{data.throughput}</div>
                          <div className="text-xs text-muted-foreground">art/sec</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model Performance Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">
                        Excellent Cardiovascular Classification
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-300">
                        95.2% F1-score with consistent performance across all metrics
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800 dark:text-blue-200">
                        Improving Neurological Accuracy
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-300">
                        +2.3% improvement over the last 30 days
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800 dark:text-yellow-200">
                        Hepatorenal Precision Opportunity
                      </div>
                      <div className="text-sm text-yellow-600 dark:text-yellow-300">
                        Consider additional training data for better precision
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Model Confidence</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        High
                      </Badge>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Processing Efficiency</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Optimal
                      </Badge>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Quality Score</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Excellent
                      </Badge>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-green-800 dark:text-green-200">All Systems Operational</div>
                  <div className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Classification pipeline running smoothly with no detected issues
                  </div>
                  <div className="text-xs text-green-500 mt-2">Last checked: 2 minutes ago</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-blue-800 dark:text-blue-200">Performance Improvement Detected</div>
                  <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Overall accuracy increased by 1.8% compared to last month
                  </div>
                  <div className="text-xs text-blue-500 mt-2">Detected: 1 hour ago</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
