"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Download, FileText, Table, BarChart3, Settings, CheckCircle, Loader2 } from "lucide-react"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { useMetrics, useConfusionMatrix, usePerformance, useDistribution } from "@/hooks/api/useDashboard"

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

  const [isExporting, setIsExporting] = useState(false)
  const [lastExport, setLastExport] = useState<string | null>(null)

  // Fetch real data from dashboard using the same hooks as Overview
  const { data: metrics, loading: metricsLoading } = useMetrics()
  const { data: confusionMatrix, loading: confusionLoading } = useConfusionMatrix()
  const { data: performance, loading: performanceLoading } = usePerformance()
  const { data: distribution, loading: distributionLoading } = useDistribution()

  const exportSections = [
    {
      id: "metrics",
      label: "Performance Metrics",
      description: "F1-Score, Accuracy, Processing Speed",
      icon: BarChart3,
      loading: metricsLoading,
      hasData: !!metrics
    },
    {
      id: "confusion-matrix",
      label: "Confusion Matrix",
      description: "Classification accuracy heatmap",
      icon: Table,
      loading: confusionLoading,
      hasData: !!confusionMatrix
    },
    {
      id: "performance",
      label: "Category Performance",
      description: "Detailed performance by medical category",
      icon: BarChart3,
      loading: performanceLoading,
      hasData: !!performance
    },
    {
      id: "distribution",
      label: "Distribution Analysis",
      description: "Dataset composition and trends",
      icon: BarChart3,
      loading: distributionLoading,
      hasData: !!distribution
    }
  ]

  const formatOptions = [
    { value: "pdf", label: "PDF Report", icon: FileText, description: "Real PDF document with tables and charts" },
    { value: "excel", label: "Excel Workbook", icon: Table, description: "Real Excel file with multiple sheets" },
    { value: "csv", label: "CSV Data", icon: Table, description: "Simple CSV with all data sections" },
    { value: "json", label: "JSON Export", icon: Settings, description: "Structured data with metadata" },
  ]

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const generateCSV = (data: any) => {
    let csvContent = ""
    
    // Add metrics section
    if (data.metrics) {
      csvContent += "Metrics\n"
      csvContent += "Metric,Value\n"
      
      // Handle metrics that are objects (category-based)
      if (data.metrics.f1_score && typeof data.metrics.f1_score === 'object') {
        Object.entries(data.metrics.f1_score).forEach(([category, value]) => {
          csvContent += `F1 Score (${category}),${value}\n`
        })
      } else {
        csvContent += `F1 Score,${data.metrics.f1_score}\n`
      }
      
      if (data.metrics.accuracy && typeof data.metrics.accuracy === 'object') {
        Object.entries(data.metrics.accuracy).forEach(([category, value]) => {
          csvContent += `Accuracy (${category}),${value}\n`
        })
      } else {
        csvContent += `Accuracy,${data.metrics.accuracy}\n`
      }
      
      if (data.metrics.precision && typeof data.metrics.precision === 'object') {
        Object.entries(data.metrics.precision).forEach(([category, value]) => {
          csvContent += `Precision (${category}),${value}\n`
        })
      } else {
        csvContent += `Precision,${data.metrics.precision}\n`
      }
      
      if (data.metrics.recall && typeof data.metrics.recall === 'object') {
        Object.entries(data.metrics.recall).forEach(([category, value]) => {
          csvContent += `Recall (${category}),${value}\n`
        })
      } else {
        csvContent += `Recall,${data.metrics.recall}\n`
      }
      
      // Handle simple metrics
      if (data.metrics.total_articles !== undefined) {
        csvContent += `Total Articles,${data.metrics.total_articles}\n`
      }
      
      if (data.metrics.processing_speed !== undefined) {
        csvContent += `Processing Speed,${data.metrics.processing_speed}\n`
      }
      
      if (data.metrics.avg_processing_time !== undefined) {
        csvContent += `Avg Processing Time,${data.metrics.avg_processing_time}\n`
      }
      
      csvContent += "\n"
    }

    // Add performance section
    if (data.performance && Array.isArray(data.performance)) {
      csvContent += "Performance by Category\n"
      csvContent += "Category,Accuracy,F1 Score\n"
      data.performance.forEach((item: any) => {
        csvContent += `${item.category},${item.accuracy},${item.f1_score}\n`
      })
      csvContent += "\n"
    }

    // Add distribution section
    if (data.distribution && Array.isArray(data.distribution)) {
      csvContent += "Distribution Analysis\n"
      csvContent += "Category,Count,Percentage,Trend\n"
      data.distribution.forEach((item: any) => {
        csvContent += `${item.category},${item.count},${item.percentage}%,${item.trend || 0}\n`
      })
      csvContent += "\n"
    }

    // Add confusion matrix
    if (data["confusion-matrix"] && data["confusion-matrix"].matrix) {
      csvContent += "Confusion Matrix\n"
      csvContent += "Category,TP,FN,FP,TN,Accuracy\n"
      
      const categories = Object.keys(data["confusion-matrix"].matrix)
      const accuracyPerCategory = data["confusion-matrix"].accuracy_per_category || {}
      
      categories.forEach((category) => {
        const categoryMatrix = data["confusion-matrix"].matrix[category]
        if (categoryMatrix && Array.isArray(categoryMatrix) && categoryMatrix.length >= 2) {
          // Extract values from 2x2 matrix: [[TP, FN], [FP, TN]]
          const tp = categoryMatrix[0]?.[0] || 0
          const fn = categoryMatrix[0]?.[1] || 0
          const fp = categoryMatrix[1]?.[0] || 0
          const tn = categoryMatrix[1]?.[1] || 0
          const accuracy = accuracyPerCategory[category] || 0
          
          csvContent += `${category},${tp},${fn},${fp},${tn},${accuracy.toFixed(4)}\n`
        }
      })
      csvContent += "\n"
    }

    return csvContent
  }

  const generatePDFReport = (data: any) => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('ABSTRACTGO DASHBOARD REPORT', 105, 20, { align: 'center' })
    
    // Subtitle
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35)
    doc.text(`Sections: ${selectedSections.join(', ')}`, 20, 42)
    doc.text(`Data Range: Current`, 20, 49)
    
    let yPosition = 65

    // Add metrics section
    if (data.metrics) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Performance Metrics', 20, yPosition)
      yPosition += 10
      
      const metricsData = []
      
      // Handle metrics that are objects (category-based)
      if (data.metrics.f1_score && typeof data.metrics.f1_score === 'object') {
        Object.entries(data.metrics.f1_score).forEach(([category, value]) => {
          metricsData.push([`F1 Score (${category})`, (value as number).toString()])
        })
      } else {
        metricsData.push(['F1 Score', data.metrics.f1_score?.toString() || ''])
      }
      
      if (data.metrics.accuracy && typeof data.metrics.accuracy === 'object') {
        Object.entries(data.metrics.accuracy).forEach(([category, value]) => {
          metricsData.push([`Accuracy (${category})`, (value as number).toString()])
        })
      } else {
        metricsData.push(['Accuracy', data.metrics.accuracy?.toString() || ''])
      }
      
      if (data.metrics.precision && typeof data.metrics.precision === 'object') {
        Object.entries(data.metrics.precision).forEach(([category, value]) => {
          metricsData.push([`Precision (${category})`, (value as number).toString()])
        })
      } else {
        metricsData.push(['Precision', data.metrics.precision?.toString() || ''])
      }
      
      if (data.metrics.recall && typeof data.metrics.recall === 'object') {
        Object.entries(data.metrics.recall).forEach(([category, value]) => {
          metricsData.push([`Recall (${category})`, (value as number).toString()])
        })
      } else {
        metricsData.push(['Recall', data.metrics.recall?.toString() || ''])
      }
      
      // Handle simple metrics
      if (data.metrics.total_articles !== undefined) {
        metricsData.push(['Total Articles', data.metrics.total_articles.toString()])
      }
      
      if (data.metrics.processing_speed !== undefined) {
        metricsData.push(['Processing Speed', data.metrics.processing_speed.toString()])
      }
      
      if (data.metrics.avg_processing_time !== undefined) {
        metricsData.push(['Avg Processing Time', data.metrics.avg_processing_time.toString()])
      }
      
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: metricsData,
        startY: yPosition,
        margin: { left: 20 },
        styles: { fontSize: 9 }
      })
      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Performance Section
    if (data.performance) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Category Performance', 20, yPosition)
      yPosition += 10
      
      const performanceData = data.performance.map((item: any) => [
        item.category,
        `${(item.accuracy * 100).toFixed(1)}%`,
        `${(item.f1_score * 100).toFixed(1)}%`
      ])
      
      autoTable(doc, {
        head: [['Category', 'Accuracy', 'F1 Score']],
        body: performanceData,
        startY: yPosition,
        margin: { left: 20 },
        styles: { fontSize: 10 }
      })
      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Distribution Section
    if (data.distribution) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Distribution Analysis', 20, yPosition)
      yPosition += 10
      
      const distributionData = data.distribution.map((item: any) => [
        item.category,
        item.count,
        `${item.percentage}%`
      ])
      
      autoTable(doc, {
        head: [['Category', 'Count', 'Percentage']],
        body: distributionData,
        startY: yPosition,
        margin: { left: 20 },
        styles: { fontSize: 10 }
      })
      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Add confusion matrix
    if (data["confusion-matrix"] && data["confusion-matrix"].matrix) {
      doc.addPage()
      doc.setFontSize(16)
      doc.text("Confusion Matrix", 14, 22)
      doc.setFontSize(10)
      
      const categories = Object.keys(data["confusion-matrix"].matrix)
      const accuracyPerCategory = data["confusion-matrix"].accuracy_per_category || {}
      
      const confusionData = categories.map((category) => {
        const categoryMatrix = data["confusion-matrix"].matrix[category]
        if (categoryMatrix && Array.isArray(categoryMatrix) && categoryMatrix.length >= 2) {
          // Extract values from 2x2 matrix: [[TP, FN], [FP, TN]]
          const tp = categoryMatrix[0]?.[0] || 0
          const fn = categoryMatrix[0]?.[1] || 0
          const fp = categoryMatrix[1]?.[0] || 0
          const tn = categoryMatrix[1]?.[1] || 0
          const accuracy = accuracyPerCategory[category] || 0
          
          return [
            category,
            tp.toString(),
            fn.toString(),
            fp.toString(),
            tn.toString(),
            accuracy.toFixed(4)
          ]
        }
        return [category, "0", "0", "0", "0", "0"]
      })
      
      autoTable(doc, {
        head: [["Category", "TP", "FN", "FP", "TN", "Accuracy"]],
        body: confusionData,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      })
    }

    return doc
  }

  const generateExcelWorkbook = (data: any) => {
    const workbook = XLSX.utils.book_new()
    
    // Add metrics
    if (data.metrics) {
      const metricsRows = []
      
      // Handle metrics that are objects (category-based)
      if (data.metrics.f1_score && typeof data.metrics.f1_score === 'object') {
        Object.entries(data.metrics.f1_score).forEach(([category, value]) => {
          metricsRows.push([`F1 Score (${category})`, value])
        })
      } else {
        metricsRows.push(['F1 Score', data.metrics.f1_score])
      }
      
      if (data.metrics.accuracy && typeof data.metrics.accuracy === 'object') {
        Object.entries(data.metrics.accuracy).forEach(([category, value]) => {
          metricsRows.push([`Accuracy (${category})`, value])
        })
      } else {
        metricsRows.push(['Accuracy', data.metrics.accuracy])
      }
      
      if (data.metrics.precision && typeof data.metrics.precision === 'object') {
        Object.entries(data.metrics.precision).forEach(([category, value]) => {
          metricsRows.push([`Precision (${category})`, value])
        })
      } else {
        metricsRows.push(['Precision', data.metrics.precision])
      }
      
      if (data.metrics.recall && typeof data.metrics.recall === 'object') {
        Object.entries(data.metrics.recall).forEach(([category, value]) => {
          metricsRows.push([`Recall (${category})`, value])
        })
      } else {
        metricsRows.push(['Recall', data.metrics.recall])
      }
      
      // Handle simple metrics
      if (data.metrics.total_articles !== undefined) {
        metricsRows.push(['Total Articles', data.metrics.total_articles])
      }
      
      if (data.metrics.processing_speed !== undefined) {
        metricsRows.push(['Processing Speed', data.metrics.processing_speed])
      }
      
      if (data.metrics.avg_processing_time !== undefined) {
        metricsRows.push(['Avg Processing Time', data.metrics.avg_processing_time])
      }
      
      const metricsSheet = XLSX.utils.aoa_to_sheet([
        ['Performance Metrics'],
        ['Metric', 'Value'],
        ...metricsRows
      ])
      XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Performance Metrics')
    }

    // Sheet 2: Performance
    if (data.performance) {
      const performanceData = data.performance.map((item: any) => [
        item.category,
        item.accuracy,
        item.f1_score,
        item.accuracy > 0.9 ? "Excellent" : item.accuracy > 0.8 ? "Good" : "Needs Improvement"
      ])
      const performanceSheet = XLSX.utils.aoa_to_sheet([
        ['Category Performance'],
        ['Category', 'Accuracy', 'F1 Score', 'Status'],
        ...performanceData
      ])
      XLSX.utils.book_append_sheet(workbook, performanceSheet, 'Performance')
    }

    // Sheet 3: Distribution
    if (data.distribution) {
      const distributionData = data.distribution
        .sort((a: any, b: any) => b.count - a.count)
        .map((item: any, index: number) => [
          item.category,
          item.count,
          item.percentage,
          index + 1
        ])
      const distributionSheet = XLSX.utils.aoa_to_sheet([
        ['Distribution Analysis'],
        ['Category', 'Count', 'Percentage', 'Rank'],
        ...distributionData
      ])
      XLSX.utils.book_append_sheet(workbook, distributionSheet, 'Distribution')
    }

         // Sheet 4: Confusion Matrix
    if (data["confusion-matrix"] && data["confusion-matrix"].matrix) {
      const confusionSheet = XLSX.utils.aoa_to_sheet([
        ["Confusion Matrix"],
        ["Category", "TP", "FN", "FP", "TN", "Accuracy"],
        ...Object.keys(data["confusion-matrix"].matrix).map((category) => {
          const categoryMatrix = data["confusion-matrix"].matrix[category]
          const accuracyPerCategory = data["confusion-matrix"].accuracy_per_category || {}
          
          if (categoryMatrix && Array.isArray(categoryMatrix) && categoryMatrix.length >= 2) {
            // Extract values from 2x2 matrix: [[TP, FN], [FP, TN]]
            const tp = categoryMatrix[0]?.[0] || 0
            const fn = categoryMatrix[0]?.[1] || 0
            const fp = categoryMatrix[1]?.[0] || 0
            const tn = categoryMatrix[1]?.[1] || 0
            const accuracy = accuracyPerCategory[category] || 0
            
            return [category, tp, fn, fp, tn, accuracy.toFixed(4)]
          }
          return [category, 0, 0, 0, 0, 0]
        })
      ])
      
      XLSX.utils.book_append_sheet(workbook, confusionSheet, "Confusion Matrix")
    }

    return workbook
  }

  const generateJSONExport = (data: any) => {
    // Create a comprehensive JSON structure with metadata
    const jsonExport = {
      metadata: {
        export_info: data.export_info,
        generated_at: new Date().toISOString(),
        version: "1.0",
        dashboard_version: "1.0"
      },
      data: data
    }
    
    return JSON.stringify(jsonExport, null, 2)
  }

  const handleExport = async () => {
    setIsExporting(true)

    try {
      // Get dashboard data from real hooks (same as Overview)
      const allData = {
        metrics: metrics,
        "confusion-matrix": confusionMatrix,
        performance: performance,
        distribution: distribution
      }
      
      // Filter data based on selected sections
      const filteredData: any = {}
      selectedSections.forEach(section => {
        if (allData[section as keyof typeof allData]) {
          filteredData[section] = allData[section as keyof typeof allData]
        }
      })

      // Add export metadata
      filteredData.export_info = {
        exported_at: new Date().toISOString(),
        sections: selectedSections,
        format: exportFormat,
        date_range: "current"
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

      switch (exportFormat) {
        case "json":
          const jsonContent = generateJSONExport(filteredData)
          downloadFile(jsonContent, `abstractgo_dashboard_${timestamp}.json`, "application/json")
          break

        case "csv":
          const csvContent = generateCSV(filteredData)
          downloadFile(csvContent, `abstractgo_dashboard_${timestamp}.csv`, "text/csv")
          break

        case "excel":
          const workbook = generateExcelWorkbook(filteredData)
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
          const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          const excelUrl = URL.createObjectURL(excelBlob)
          const excelLink = document.createElement('a')
          excelLink.href = excelUrl
          excelLink.download = `abstractgo_dashboard_${timestamp}.xlsx`
          document.body.appendChild(excelLink)
          excelLink.click()
          document.body.removeChild(excelLink)
          URL.revokeObjectURL(excelUrl)
          break

        case "pdf":
          const pdfDoc = generatePDFReport(filteredData)
          pdfDoc.save(`abstractgo_dashboard_${timestamp}.pdf`)
          break

        default:
          throw new Error("Unsupported export format")
      }

      // Update last export timestamp
      setLastExport(new Date().toLocaleString())

    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
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
              const isLoading = section.loading
              const hasData = section.hasData

              return (
                <div
                  key={section.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    isSelected ? "bg-accent/5 border-accent/30" : "hover:bg-muted/50"
                  } ${!hasData && !isLoading ? "opacity-50" : ""}`}
                >
                  <Checkbox
                    id={section.id}
                    checked={isSelected}
                    onCheckedChange={() => handleSectionToggle(section.id)}
                    disabled={!hasData && !isLoading}
                  />
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <label htmlFor={section.id} className="font-medium text-sm cursor-pointer">
                      {section.label}
                      {isLoading && <span className="ml-2 text-xs text-muted-foreground">(Loading...)</span>}
                      {!hasData && !isLoading && <span className="ml-2 text-xs text-red-500">(No data)</span>}
                    </label>
                    <div className="text-xs text-muted-foreground">{section.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>



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
              <span className="font-medium">Current</span>
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
