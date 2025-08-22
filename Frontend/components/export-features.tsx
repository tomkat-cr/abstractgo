"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Table, BarChart3, Settings, CheckCircle, Loader2 } from "lucide-react"

interface ExportFeaturesProps {
  className?: string
}

export function ExportFeatures({ className = "" }: ExportFeaturesProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "metrics",
    "confusion-matrix",
    "performance",
    "distribution",
  ])
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv" | "json">("pdf")
  const [dateRange, setDateRange] = useState<"current" | "30d" | "90d" | "1y">("current")
  const [isExporting, setIsExporting] = useState(false)
  const [lastExport, setLastExport] = useState<string | null>(null)

  const exportSections = [
    {
      id: "metrics",
      label: "Performance Metrics",
      description: "F1-Score, Accuracy, Processing Speed",
      icon: BarChart3,
    },
    {
      id: "confusion-matrix",
      label: "Confusion Matrix",
      description: "Classification accuracy heatmap",
      icon: Table,
    },
    {
      id: "performance",
      label: "Category Performance",
      description: "Detailed performance by medical category",
      icon: BarChart3,
    },
    {
      id: "distribution",
      label: "Distribution Analysis",
      description: "Dataset composition and trends",
      icon: BarChart3,
    },
    {
      id: "analytics",
      label: "Advanced Analytics",
      description: "Time series and system insights",
      icon: BarChart3,
    },
    {
      id: "classification-history",
      label: "Classification History",
      description: "Recent classification results",
      icon: FileText,
    },
  ]

  const formatOptions = [
    { value: "pdf", label: "PDF Report", icon: FileText, description: "Comprehensive formatted report" },
    { value: "excel", label: "Excel Workbook", icon: Table, description: "Spreadsheet with multiple sheets" },
    { value: "csv", label: "CSV Data", icon: Table, description: "Raw data in CSV format" },
    { value: "json", label: "JSON Export", icon: Settings, description: "Machine-readable data format" },
  ]

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000))

    setLastExport(new Date().toLocaleString())
    setIsExporting(false)

    // In a real implementation, this would trigger the actual export
    console.log("Exporting:", {
      sections: selectedSections,
      format: exportFormat,
      dateRange,
    })
  }

  const getEstimatedSize = () => {
    const baseSize = selectedSections.length * 0.5 // MB per section
    const formatMultiplier = exportFormat === "pdf" ? 2 : exportFormat === "excel" ? 1.5 : 0.5
    return (baseSize * formatMultiplier).toFixed(1)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          Export Dashboard
        </CardTitle>
        <CardDescription>Generate comprehensive reports and export data in multiple formats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format Selection */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Export Format</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formatOptions.map((format) => {
              const IconComponent = format.icon
              return (
                <div
                  key={format.value}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    exportFormat === format.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setExportFormat(format.value as any)}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{format.label}</div>
                      <div className="text-xs text-muted-foreground">{format.description}</div>
                    </div>
                    {exportFormat === format.value && <CheckCircle className="h-4 w-4 text-primary" />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Section Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Include Sections</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedSections(exportSections.map((s) => s.id))}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedSections([])}>
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {exportSections.map((section) => {
              const IconComponent = section.icon
              const isSelected = selectedSections.includes(section.id)

              return (
                <div
                  key={section.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    isSelected ? "bg-accent/5 border-accent/30" : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    id={section.id}
                    checked={isSelected}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                  />
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <label htmlFor={section.id} className="font-medium text-sm cursor-pointer">
                      {section.label}
                    </label>
                    <div className="text-xs text-muted-foreground">{section.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Date Range Selection */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Data Range</h4>
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Data</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Export Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Export Summary</h4>
          <div className="p-3 rounded-lg bg-muted/30 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Selected Sections:</span>
              <Badge variant="secondary">
                {selectedSections.length} of {exportSections.length}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Format:</span>
              <span className="font-medium">{formatOptions.find((f) => f.value === exportFormat)?.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Size:</span>
              <span className="font-medium">{getEstimatedSize()} MB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Data Range:</span>
              <span className="font-medium">
                {dateRange === "current"
                  ? "Current"
                  : dateRange === "30d"
                    ? "30 Days"
                    : dateRange === "90d"
                      ? "90 Days"
                      : "1 Year"}
              </span>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <Button onClick={handleExport} disabled={selectedSections.length === 0 || isExporting} className="w-full h-12">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Export...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Dashboard ({getEstimatedSize()} MB)
            </>
          )}
        </Button>

        {/* Last Export Info */}
        {lastExport && (
          <div className="text-center text-sm text-muted-foreground">
            <CheckCircle className="inline h-4 w-4 mr-1 text-green-600" />
            Last exported: {lastExport}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
