"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { ReportsPage } from "@/components/pages/reports-page"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Reports() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ReportsPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
