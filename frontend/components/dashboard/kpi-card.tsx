"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface KpiCardProps {
  title: string
  value: string | number
  change: string
  trend: "up" | "down"
  description: string
  icon: LucideIcon
  index?: number
}

export function KpiCard({ title, value, change, trend, description, icon: Icon, index = 0 }: KpiCardProps) {
  const { format } = useCurrency()

  const displayValue =
    typeof value === "number"
      ? format(value)
      : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayValue}</div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <span
              className={cn(
                "flex items-center gap-0.5 font-medium",
                trend === "up" ? "text-emerald-500" : "text-red-500",
              )}
            >
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        </CardContent>
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  )
}
