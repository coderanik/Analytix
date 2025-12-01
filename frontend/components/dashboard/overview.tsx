"use client"

import { KpiCard } from "./kpi-card"
import { RevenueChart } from "./charts/revenue-chart"
import { UserActivityChart } from "./charts/user-activity-chart"
import { TrafficChart } from "./charts/traffic-chart"
import { DataTable } from "./data-table"
import { kpiData } from "@/lib/data"
import { DollarSign, Users, TrendingUp, UserCheck } from "lucide-react"
import { motion } from "framer-motion"

const kpiCards = [
  { ...kpiData.revenue, title: "Total Revenue", icon: DollarSign },
  { ...kpiData.users, title: "Active Users", icon: Users },
  { ...kpiData.conversion, title: "Conversion Rate", icon: TrendingUp },
  { ...kpiData.retention, title: "Retention Rate", icon: UserCheck },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => (
          <KpiCard key={kpi.title} {...kpi} index={index} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RevenueChart />
        <UserActivityChart />
      </div>

      {/* Traffic Chart and Table */}
      <div className="grid gap-4 lg:grid-cols-3">
        <TrafficChart />
        <div className="lg:col-span-2">
          <DataTable />
        </div>
      </div>
    </div>
  )
}
