"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { AnalyticsPage } from "@/components/pages/analytics-page"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Analytics() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <AnalyticsPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
