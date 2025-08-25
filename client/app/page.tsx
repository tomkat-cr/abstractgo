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

  return (
    <div className={`min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              {/* <Stethoscope className="h-6 w-6 text-primary-foreground" /> */}
              <img src="/abstractgo.logo.020.png" alt="AbstractGo Logo" width={40} height={40} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground"><a href="https://github.com/tomkat-cr/abstractgo" target="_blank" rel="noopener noreferrer">AbstractGo</a></h1>
              <p className="text-sm text-muted-foreground"><a href="https://github.com/tomkat-cr/abstractgo" target="_blank" rel="noopener noreferrer">AI-Powered Classification System</a></p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overview Tab */}
        <Tabs defaultValue="classification" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>            
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <MetricCard />

            {/* Confusion Matrix - Full Width */}
            <ConfusionMatrix />

            {/* Performance Chart and Distribution Analysis - Half Width Each */}
            <div className="grid gap-6 md:grid-cols-2">
              <PerformanceChart />
              <DistributionAnalysis />
            </div>

            {/* Analytics Dashboard - Full Width */}
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="classification" className="space-y-6">
            <ClassificationDemo />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ExportFeatures />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
