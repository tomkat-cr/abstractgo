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
    { value: "pdf", label: "PDF Report", icon: FileText, description: "Real PDF document with tables and charts" },
    { value: "excel", label: "Excel Workbook", icon: Table, description: "Real Excel file with multiple sheets" },
    { value: "csv", label: "CSV Data", icon: Table, description: "Simple CSV with all data sections" },
    { value: "json", label: "JSON Export", icon: Settings, description: "Structured data with metadata" },
  ]

  // Mock data for export - in a real app, this would come from your dashboard state
  const getDashboardData = () => ({
    metrics: {
      f1_score: 0.94,
      accuracy: 0.92,
      total_articles: 15847,
      processing_speed: 245
    },
    "confusion-matrix": [
      [892, 23, 15, 8],
      [18, 756, 12, 21],
      [11, 19, 634, 7],
      [5, 14, 8, 423]
    ],
    categories: ["Cardiovascular", "Neurological", "Hepatorenal", "Oncological"],
    performance: [
      { category: "Cardiovascular", accuracy: 0.95, f1_score: 0.94 },
      { category: "Neurological", accuracy: 0.93, f1_score: 0.92 },
      { category: "Hepatorenal", accuracy: 0.91, f1_score: 0.90 },
      { category: "Oncological", accuracy: 0.89, f1_score: 0.88 }
    ],
    distribution: [
      { category: "Cardiovascular", count: 938, percentage: 35.2 },
      { category: "Neurological", count: 807, percentage: 30.3 },
      { category: "Hepatorenal", count: 671, percentage: 25.2 },
      { category: "Oncological", count: 250, percentage: 9.3 }
    ],
    analytics: {
      daily_classifications: [245, 267, 289, 234, 256, 278, 290],
      accuracy_trend: [0.89, 0.91, 0.92, 0.93, 0.92, 0.94, 0.92],
      categories_trend: {
        cardiovascular: [120, 135, 142, 128, 140, 155, 148],
        neurological: [98, 105, 112, 95, 108, 115, 110],
        hepatorenal: [85, 92, 98, 88, 95, 102, 98],
        oncological: [42, 35, 37, 23, 13, 6, 34]
      }
    },
    "classification-history": [
      { id: 1, title: "Cardiovascular Disease Study", category: "Cardiovascular", confidence: 0.95, date: "2024-01-15" },
      { id: 2, title: "Neurological Disorder Research", category: "Neurological", confidence: 0.92, date: "2024-01-14" },
      { id: 3, title: "Liver Function Analysis", category: "Hepatorenal", confidence: 0.88, date: "2024-01-13" },
      { id: 4, title: "Cancer Treatment Review", category: "Oncological", confidence: 0.91, date: "2024-01-12" }
    ]
  })

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
      Object.entries(data.metrics).forEach(([key, value]) => {
        csvContent += `${key},${value}\n`
      })
      csvContent += "\n"
    }

    // Add performance section
    if (data.performance) {
      csvContent += "Performance by Category\n"
      csvContent += "Category,Accuracy,F1 Score\n"
      data.performance.forEach((item: any) => {
        csvContent += `${item.category},${item.accuracy},${item.f1_score}\n`
      })
      csvContent += "\n"
    }

    // Add distribution section
    if (data.distribution) {
      csvContent += "Distribution Analysis\n"
      csvContent += "Category,Count,Percentage\n"
      data.distribution.forEach((item: any) => {
        csvContent += `${item.category},${item.count},${item.percentage}%\n`
      })
      csvContent += "\n"
    }

    // Add confusion matrix
    if (data["confusion-matrix"]) {
      csvContent += "Confusion Matrix\n"
      data["confusion-matrix"].forEach((row: number[], index: number) => {
        csvContent += row.join(',') + '\n'
      })
      csvContent += "\n"
    }

    // Add classification history
    if (data["classification-history"]) {
      csvContent += "Classification History\n"
      csvContent += "ID,Title,Category,Confidence,Date\n"
      data["classification-history"].forEach((item: any) => {
        csvContent += `${item.id},"${item.title}",${item.category},${item.confidence},${item.date}\n`
      })
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

    // Metrics Section
    if (data.metrics) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Performance Metrics', 20, yPosition)
      yPosition += 10
      
      const metricsData = Object.entries(data.metrics).map(([key, value]) => [
        key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        typeof value === 'number' && value < 1 ? `${(value * 100).toFixed(1)}%` : value
      ])
      
      autoTable(doc, {
        head: [['Metric', 'Value']],
        body: metricsData,
        startY: yPosition,
        margin: { left: 20 },
        styles: { fontSize: 10 }
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

    // Confusion Matrix Section
    if (data["confusion-matrix"]) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Confusion Matrix', 20, yPosition)
      yPosition += 10
      
      const categories = data.categories || ["Cardio", "Neuro", "Hepato", "Onco"]
      const matrixData = data["confusion-matrix"].map((row: number[], index: number) => [
        categories[index],
        ...row.map(val => val.toString())
      ])
      
      autoTable(doc, {
        head: [['Actual/Predicted', ...categories]],
        body: matrixData,
        startY: yPosition,
        margin: { left: 20 },
        styles: { fontSize: 9 }
      })
      yPosition = (doc as any).lastAutoTable.finalY + 15
    }

    // Classification History Section
    if (data["classification-history"]) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Recent Classifications', 20, yPosition)
      yPosition += 10
      
      const historyData = data["classification-history"].map((item: any) => [
        item.id,
        item.title.substring(0, 30) + (item.title.length > 30 ? '...' : ''),
        item.category,
        `${(item.confidence * 100).toFixed(1)}%`,
        item.date
      ])
      
      autoTable(doc, {
        head: [['ID', 'Title', 'Category', 'Confidence', 'Date']],
        body: historyData,
        startY: yPosition,
        margin: { left: 20 },
        styles: { fontSize: 8 }
      })
    }

    return doc
  }

  const generateExcelWorkbook = (data: any) => {
    const workbook = XLSX.utils.book_new()
    
    // Sheet 1: Metrics
    if (data.metrics) {
      const metricsData = Object.entries(data.metrics).map(([key, value]) => [
        key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        typeof value === 'number' && value < 1 ? `${(value * 100).toFixed(1)}%` : value
      ])
      const metricsSheet = XLSX.utils.aoa_to_sheet([
        ['Performance Metrics'],
        ['Metric', 'Value'],
        ...metricsData
      ])
      XLSX.utils.book_append_sheet(workbook, metricsSheet, 'Metrics')
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
     if (data["confusion-matrix"]) {
       const categories = data.categories || ["Cardiovascular", "Neurological", "Hepatorenal", "Oncological"]
       const matrixSheet = XLSX.utils.aoa_to_sheet([
         ['Confusion Matrix'],
         ['Actual/Predicted', ...categories],
         [categories[0], data["confusion-matrix"][0][0], data["confusion-matrix"][0][1], data["confusion-matrix"][0][2], data["confusion-matrix"][0][3]],
         [categories[1], data["confusion-matrix"][1][0], data["confusion-matrix"][1][1], data["confusion-matrix"][1][2], data["confusion-matrix"][1][3]],
         [categories[2], data["confusion-matrix"][2][0], data["confusion-matrix"][2][1], data["confusion-matrix"][2][2], data["confusion-matrix"][2][3]],
         [categories[3], data["confusion-matrix"][3][0], data["confusion-matrix"][3][1], data["confusion-matrix"][3][2], data["confusion-matrix"][3][3]]
       ] as any)
       XLSX.utils.book_append_sheet(workbook, matrixSheet, 'Confusion Matrix')
     }

    // Sheet 5: Classification History
    if (data["classification-history"]) {
      const historyData = data["classification-history"].map((item: any) => [
        item.id,
        item.title,
        item.category,
        item.confidence,
        item.date,
        item.confidence > 0.9 ? "High" : item.confidence > 0.7 ? "Medium" : "Low"
      ])
      const historySheet = XLSX.utils.aoa_to_sheet([
        ['Classification History'],
        ['ID', 'Title', 'Category', 'Confidence', 'Date', 'Confidence Level'],
        ...historyData
      ])
      XLSX.utils.book_append_sheet(workbook, historySheet, 'Classification History')
    }

    // Sheet 6: Analytics Summary
    if (data.analytics) {
      const avgAccuracy = data.analytics.accuracy_trend.reduce((a: number, b: number) => a + b, 0) / data.analytics.accuracy_trend.length
      const totalClassifications = data.analytics.daily_classifications.reduce((a: number, b: number) => a + b, 0)
      const avgDaily = totalClassifications / data.analytics.daily_classifications.length
      
      const analyticsData = [
        ['Analytics Summary'],
        ['Metric', 'Value', 'Description'],
        ['Total Classifications', totalClassifications, 'Sum of daily classifications'],
        ['Average Daily', avgDaily.toFixed(1), 'Average daily classifications'],
        ['Peak Accuracy', Math.max(...data.analytics.accuracy_trend), 'Highest accuracy achieved'],
        ['Average Accuracy', avgAccuracy.toFixed(3), 'Average accuracy over time']
      ]
      const analyticsSheet = XLSX.utils.aoa_to_sheet(analyticsData)
      XLSX.utils.book_append_sheet(workbook, analyticsSheet, 'Analytics Summary')
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
      // Get dashboard data
      const allData = getDashboardData()
      
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
