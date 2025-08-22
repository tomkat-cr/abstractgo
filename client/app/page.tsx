"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/metric-card"
import { ConfusionMatrix } from "@/components/confusion-matrix"
import { PerformanceChart } from "@/components/performance-chart"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { ClassificationDemo } from "@/components/classification-demo"
import { DistributionAnalysis } from "@/components/distribution-analysis"
import { ExportFeatures } from "@/components/export-features"
import {
  Activity,
  Brain,
  Heart,
  Microscope,
  Stethoscope,
  FileText,
  TrendingUp,
  Download,
  Moon,
  Sun,
  Zap,
} from "lucide-react"

export default function MedicalDashboard() {
  const [darkMode, setDarkMode] = useState(false)

  // Mock data for demonstration
  const metrics = {
    f1Score: 0.94,
    accuracy: 0.92,
    totalArticles: 15847,
    processingSpeed: 245,
  }

  const confusionMatrix = [
    [892, 23, 15, 8],
    [18, 756, 12, 21],
    [11, 19, 634, 7],
    [5, 14, 8, 423],
  ]

  const categories = ["Cardiovascular", "Neurological", "Hepatorenal", "Oncological"]

  const categoryPerformance = [
    {
      category: "Cardiovascular",
      f1Score: 0.95,
      precision: 0.94,
      recall: 0.96,
      support: 938,
      trend: 1.2,
      icon: Heart,
      color: "bg-red-500",
    },
    {
      category: "Neurological",
      f1Score: 0.93,
      precision: 0.91,
      recall: 0.95,
      support: 807,
      trend: 2.3,
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      category: "Hepatorenal",
      f1Score: 0.91,
      precision: 0.89,
      recall: 0.93,
      support: 671,
      trend: -0.5,
      icon: Activity,
      color: "bg-blue-500",
    },
    {
      category: "Oncological",
      f1Score: 0.96,
      precision: 0.97,
      recall: 0.95,
      support: 450,
      trend: 0.8,
      icon: Microscope,
      color: "bg-green-500",
    },
  ]

  // Mock time series data for analytics
  const timeSeriesData = [
    { date: "2024-01-15", accuracy: 0.89, f1Score: 0.91, throughput: 220 },
    { date: "2024-01-16", accuracy: 0.9, f1Score: 0.92, throughput: 225 },
    { date: "2024-01-17", accuracy: 0.91, f1Score: 0.93, throughput: 230 },
    { date: "2024-01-18", accuracy: 0.9, f1Score: 0.92, throughput: 235 },
    { date: "2024-01-19", accuracy: 0.92, f1Score: 0.94, throughput: 240 },
    { date: "2024-01-20", accuracy: 0.92, f1Score: 0.94, throughput: 245 },
    { date: "2024-01-21", accuracy: 0.92, f1Score: 0.94, throughput: 245 },
  ]

  const distributionData = [
    {
      category: "Cardiovascular",
      count: 4754,
      percentage: 30,
      trend: 2.1,
      qualityScore: 94,
      avgConfidence: 0.91,
      monthlyData: [
        { month: "Jul", count: 380 },
        { month: "Aug", count: 395 },
        { month: "Sep", count: 410 },
        { month: "Oct", count: 425 },
        { month: "Nov", count: 440 },
        { month: "Dec", count: 455 },
      ],
      icon: Heart,
      color: "bg-red-500",
    },
    {
      category: "Neurological",
      count: 3962,
      percentage: 25,
      trend: 1.8,
      qualityScore: 89,
      avgConfidence: 0.88,
      monthlyData: [
        { month: "Jul", count: 320 },
        { month: "Aug", count: 330 },
        { month: "Sep", count: 340 },
        { month: "Oct", count: 350 },
        { month: "Nov", count: 360 },
        { month: "Dec", count: 370 },
      ],
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      category: "Hepatorenal",
      count: 3168,
      percentage: 20,
      trend: -0.3,
      qualityScore: 86,
      avgConfidence: 0.85,
      monthlyData: [
        { month: "Jul", count: 270 },
        { month: "Aug", count: 265 },
        { month: "Sep", count: 260 },
        { month: "Oct", count: 255 },
        { month: "Nov", count: 250 },
        { month: "Dec", count: 245 },
      ],
      icon: Activity,
      color: "bg-blue-500",
    },
    {
      category: "Oncological",
      count: 3963,
      percentage: 25,
      trend: 3.2,
      qualityScore: 92,
      avgConfidence: 0.93,
      monthlyData: [
        { month: "Jul", count: 310 },
        { month: "Aug", count: 325 },
        { month: "Sep", count: 340 },
        { month: "Oct", count: 355 },
        { month: "Nov", count: 370 },
        { month: "Dec", count: 385 },
      ],
      icon: Microscope,
      color: "bg-green-500",
    },
  ]

  return (
    <div className={`min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">AbstractGo</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Classification System</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Overall F1-Score"
            value={metrics.f1Score}
            icon={TrendingUp}
            type="gauge"
            color="hsl(var(--accent))"
            trend={{
              value: 2.3,
              label: "vs last month",
              positive: true,
            }}
          />

          <MetricCard
            title="Overall Accuracy"
            value={metrics.accuracy}
            icon={Activity}
            type="progress"
            color="hsl(var(--primary))"
            trend={{
              value: 1.8,
              label: "vs last month",
              positive: true,
            }}
          />

          <MetricCard
            title="Total Articles Classified"
            value={metrics.totalArticles}
            icon={FileText}
            type="number"
            trend={{
              value: 12.5,
              label: "this month",
              positive: true,
            }}
          />

          <MetricCard
            title="Processing Speed"
            value={metrics.processingSpeed}
            icon={Zap}
            type="gauge"
            max={300}
            unit=" art/sec"
            color="hsl(var(--secondary))"
            trend={{
              value: 8.2,
              label: "improvement",
              positive: true,
            }}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger
              value="overview"
              className="hover:cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black data-[state=active]:cursor-default data-[state=active]:hover:bg-transparent data-[state=active]:hover:text-inherit"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="hover:cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black data-[state=active]:cursor-default data-[state=active]:hover:bg-transparent data-[state=active]:hover:text-inherit"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="demo"
              className="hover:cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black data-[state=active]:cursor-default data-[state=active]:hover:bg-transparent data-[state=active]:hover:text-inherit"
            >
              Live Demo
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="hover:cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black data-[state=active]:cursor-default data-[state=active]:hover:bg-transparent data-[state=active]:hover:text-inherit"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Confusion Matrix */}
              <ConfusionMatrix matrix={confusionMatrix} categories={categories} />

              <DistributionAnalysis data={distributionData} />
            </div>

            <ExportFeatures />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceChart data={categoryPerformance} />
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <ClassificationDemo />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard timeSeriesData={timeSeriesData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
