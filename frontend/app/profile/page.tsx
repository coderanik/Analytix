"use client"

import { DashboardLayout } from "@/components/dashboard/layout"
import { ProfilePage } from "@/components/pages/profile-page"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Profile() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ProfilePage />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
