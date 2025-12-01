"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { NotificationsPage } from "@/components/pages/notifications-page"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Notifications() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <NotificationsPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
