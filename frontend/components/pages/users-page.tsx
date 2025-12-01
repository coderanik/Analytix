"use client"

import { motion } from "framer-motion"
import { DataTable } from "@/components/dashboard/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"

export function UsersPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users</h1>
          <p className="text-muted-foreground">Manage your users and their permissions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </motion.div>

      <DataTable />
    </div>
  )
}
