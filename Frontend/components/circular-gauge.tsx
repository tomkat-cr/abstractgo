"use client"

import { useEffect, useState } from "react"

interface CircularGaugeProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  className?: string
  label?: string
  color?: string
}

export function CircularGauge({
  value,
  max = 1,
  size = 120,
  strokeWidth = 8,
  className = "",
  label,
  color = "hsl(var(--accent))",
}: CircularGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = (animatedValue / max) * 100
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-primary">
          {max === 1 ? (value * 100).toFixed(1) : value}
          {max === 1 ? "%" : ""}
        </span>
        {label && <span className="text-xs text-muted-foreground text-center mt-1">{label}</span>}
      </div>
    </div>
  )
}
