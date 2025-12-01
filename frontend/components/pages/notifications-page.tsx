"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, CheckCheck, CreditCard, AlertTriangle, UserPlus, Zap, X } from "lucide-react"
import { cn } from "@/lib/utils"

const allNotifications = [
  {
    id: "1",
    title: "New user registered",
    description: "Alex Johnson just signed up for a Pro account",
    time: "2 minutes ago",
    read: false,
    type: "user",
    icon: UserPlus,
  },
  {
    id: "2",
    title: "Payment received",
    description: "$1,200 payment from Sarah Williams processed successfully",
    time: "1 hour ago",
    read: false,
    type: "payment",
    icon: CreditCard,
  },
  {
    id: "3",
    title: "Server alert",
    description: "CPU usage exceeded 80% on production server",
    time: "3 hours ago",
    read: true,
    type: "alert",
    icon: AlertTriangle,
  },
  {
    id: "4",
    title: "New feature deployed",
    description: "Analytics v2.0 is now live with improved performance",
    time: "1 day ago",
    read: true,
    type: "update",
    icon: Zap,
  },
  {
    id: "5",
    title: "Weekly report ready",
    description: "Your weekly analytics report is ready to download",
    time: "2 days ago",
    read: true,
    type: "update",
    icon: Bell,
  },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "user":
        return "text-blue-500 bg-blue-500/10"
      case "payment":
        return "text-emerald-500 bg-emerald-500/10"
      case "alert":
        return "text-yellow-500 bg-yellow-500/10"
      case "update":
        return "text-purple-500 bg-purple-500/10"
      default:
        return "text-muted-foreground bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your latest activity.</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="gap-2 bg-transparent">
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
      </motion.div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            Unread
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>Your complete notification history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <AnimatePresence>
                {notifications.map((notification, index) => {
                  const Icon = notification.icon
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                        !notification.read && "bg-muted/50",
                      )}
                    >
                      <div className={cn("rounded-lg p-2", getTypeColor(notification.type))}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {!notification.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
              {notifications.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <Bell className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>Notifications you haven&apos;t seen yet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <AnimatePresence>
                {notifications
                  .filter((n) => !n.read)
                  .map((notification, index) => {
                    const Icon = notification.icon
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-4 rounded-lg border bg-muted/50 p-4"
                      >
                        <div className={cn("rounded-lg p-2", getTypeColor(notification.type))}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )
                  })}
              </AnimatePresence>
              {notifications.filter((n) => !n.read).length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <CheckCheck className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>All caught up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
