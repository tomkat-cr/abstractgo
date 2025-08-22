"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Brain, Heart, Microscope } from "lucide-react"

interface ConfusionMatrixProps {
  matrix: number[][]
  categories: string[]
  className?: string
}

export function ConfusionMatrix({ matrix, categories, className = "" }: ConfusionMatrixProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)
  const [selectedView, setSelectedView] = useState<"absolute" | "percentage">("absolute")

  const categoryIcons = [Heart, Brain, Activity, Microscope]
  const categoryColors = ["text-red-500", "text-purple-500", "text-blue-500", "text-green-500"]

  // Calculate totals for percentage view
  const rowTotals = matrix.map((row) => row.reduce((sum, val) => sum + val, 0))
  const maxValue = Math.max(...matrix.flat())

  const getIntensity = (value: number, row: number) => {
    if (selectedView === "percentage") {
      const percentage = (value / rowTotals[row]) * 100
      return percentage
    }
    return (value / maxValue) * 100
  }

  const getCellValue = (value: number, row: number) => {
    if (selectedView === "percentage") {
      return ((value / rowTotals[row]) * 100).toFixed(1) + "%"
    }
    return value.toString()
  }

  const getAccuracy = (row: number) => {
    return ((matrix[row][row] / rowTotals[row]) * 100).toFixed(1)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Confusion Matrix</CardTitle>
            <CardDescription>Interactive classification accuracy heatmap</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedView === "absolute" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView("absolute")}
            >
              Absolute
            </Button>
            <Button
              variant={selectedView === "percentage" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView("percentage")}
            >
              Percentage
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Matrix Grid */}
        <div className="space-y-4">
          {/* Column Headers */}
          <div className="grid grid-cols-5 gap-2 text-xs font-medium">
            <div></div>
            {categories.map((category, index) => {
              const IconComponent = categoryIcons[index]
              return (
                <div key={index} className="text-center space-y-1">
                  <IconComponent className={`h-4 w-4 mx-auto ${categoryColors[index]}`} />
                  <div className="truncate">{category}</div>
                </div>
              )
            })}
          </div>

          {/* Matrix Rows */}
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-2 items-center">
              {/* Row Header */}
              <div className="text-xs font-medium text-right space-y-1">
                <div className="flex items-center justify-end gap-1">
                  {(() => {
                    const IconComponent = categoryIcons[rowIndex]
                    return <IconComponent className={`h-3 w-3 ${categoryColors[rowIndex]}`} />
                  })()}
                  <span className="truncate">{categories[rowIndex]}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getAccuracy(rowIndex)}% acc
                </Badge>
              </div>

              {/* Matrix Cells */}
              {row.map((value, colIndex) => {
                const intensity = getIntensity(value, rowIndex)
                const isCorrect = rowIndex === colIndex
                const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex

                return (
                  <div
                    key={colIndex}
                    className={`
                      relative aspect-square flex items-center justify-center rounded-lg text-xs font-semibold
                      cursor-pointer transition-all duration-200 border-2
                      ${isHovered ? "scale-110 z-10 shadow-lg" : ""}
                      ${isCorrect ? "border-accent/50" : "border-transparent"}
                    `}
                    style={{
                      backgroundColor: isCorrect
                        ? `hsl(var(--accent) / ${Math.max(intensity / 100, 0.2)})`
                        : `hsl(var(--destructive) / ${Math.max(intensity / 100, 0.1)})`,
                      color: intensity > 50 ? "white" : "hsl(var(--foreground))",
                    }}
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {getCellValue(value, rowIndex)}

                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover border rounded-lg shadow-lg text-popover-foreground z-20 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {categories[rowIndex]} → {categories[colIndex]}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Count: {value} | Percentage: {((value / rowTotals[rowIndex]) * 100).toFixed(1)}%
                        </div>
                        {isCorrect && <div className="text-xs text-accent font-medium">✓ Correct Classification</div>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend and Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <h4 className="text-sm font-medium mb-2">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-accent/80"></div>
                <span>Correct Classifications (Diagonal)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-destructive/30"></div>
                <span>Misclassifications (Off-diagonal)</span>
              </div>
              <div className="text-muted-foreground">
                Intensity represents {selectedView === "absolute" ? "absolute count" : "percentage of row total"}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Overall Statistics</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Total Predictions:</span>
                <span className="font-medium">{rowTotals.reduce((sum, val) => sum + val, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Overall Accuracy:</span>
                <span className="font-medium text-accent">
                  {(
                    (matrix.reduce((sum, row, i) => sum + row[i], 0) / rowTotals.reduce((sum, val) => sum + val, 0)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Best Category:</span>
                <span className="font-medium">
                  {
                    categories[
                      rowTotals.findIndex(
                        (_, i) =>
                          Number.parseFloat(getAccuracy(i)) ===
                          Math.max(...rowTotals.map((_, j) => Number.parseFloat(getAccuracy(j)))),
                      )
                    ]
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
