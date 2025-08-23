"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingError } from "@/components/ui/loading-error"
import { useConfusionMatrix } from "@/hooks/api/useDashboard"
import { Table } from "lucide-react"

interface ConfusionMatrixProps {
  className?: string
}

export function ConfusionMatrix({ className = "" }: ConfusionMatrixProps) {
  const { data: confusionMatrix, loading, error, refetch } = useConfusionMatrix()

  const getCellColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue
    const alpha = 0.3 + intensity * 0.7 // Range from 0.3 to 1.0
    return `rgba(59, 130, 246, ${alpha})` // Blue color with varying opacity
  }

  const getMaxValue = () => {
    if (!confusionMatrix?.matrix) return 1
    return Math.max(...confusionMatrix.matrix.flat())
  }

  const maxValue = getMaxValue()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Table className="h-5 w-5 text-primary" />
          Confusion Matrix
        </CardTitle>
        <CardDescription>
          Classification accuracy heatmap showing true vs predicted categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingError
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingText="Loading confusion matrix..."
          errorTitle="Failed to load confusion matrix"
        >
          {confusionMatrix && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-left font-medium text-muted-foreground">
                        Actual ↓ / Predicted →
                      </th>
                      {confusionMatrix.categories.map((category, index) => (
                        <th key={index} className="p-2 text-center font-medium text-sm">
                          {category}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {confusionMatrix.matrix.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="p-2 font-medium text-sm text-muted-foreground">
                          {confusionMatrix.categories[rowIndex]}
                        </td>
                        {row.map((value, colIndex) => (
                          <td
                            key={colIndex}
                            className="p-2 text-center text-sm font-medium border"
                            style={{
                              backgroundColor: getCellColor(value, maxValue),
                              color: value > maxValue / 2 ? 'white' : 'black',
                            }}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div>Total Predictions: {confusionMatrix.total_predictions}</div>
                    <div>Categories: {confusionMatrix.categories.length}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Accuracy by Category</h4>
                  <div className="space-y-1">
                    {Object.entries(confusionMatrix.accuracy_per_category).map(([category, accuracy]) => (
                      <div key={category} className="flex justify-between">
                        <span className="text-muted-foreground">{category}:</span>
                        <span className="font-medium">{(accuracy * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </LoadingError>
      </CardContent>
    </Card>
  )
}
