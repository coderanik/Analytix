"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { SettingsPage } from "@/components/pages/settings-page"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Settings() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <SettingsPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
