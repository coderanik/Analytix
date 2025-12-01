"use client"

import { cn } from "@/lib/utils"
import {
  BarChart3,
  ChevronLeft,
  Home,
  LayoutDashboard,
  Settings,
  Users,
  FileText,
  Bell,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const mainNavItems = [
  { icon: Home, label: "Overview", href: "/" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Users, label: "Users", href: "/users" },
  { icon: FileText, label: "Reports", href: "/reports" },
]

const bottomNavItems = [
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar-background"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sidebar-foreground">Analytix</span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
              <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          <div className="mb-2">
            {!collapsed && (
              <span className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Main</span>
            )}
          </div>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-sidebar-foreground"
                        : "text-muted-foreground group-hover:text-sidebar-foreground",
                    )}
                  />
                </motion.div>
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            )

            return (
              <div key={item.href} className="relative">
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-border p-3">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Icon className="h-5 w-5" />
                </motion.div>
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )

            return (
              <div key={item.href}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </div>
            )
          })}

          {/* Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-2 flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronLeft className="h-5 w-5" />
            </motion.div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
