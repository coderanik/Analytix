"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { UsersPage } from "@/components/pages/users-page"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Users() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <UsersPage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
