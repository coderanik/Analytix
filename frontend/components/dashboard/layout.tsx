"use client"

import { Sidebar } from "./sidebar"
import { Navbar } from "./navbar"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-0 md:pl-[240px] transition-all duration-200">
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-4rem)] p-4 md:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
