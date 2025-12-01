"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Download,
  Calendar,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  MoreHorizontal,
  Loader2,
  Trash2,
} from "lucide-react"
import { api } from "@/lib/api"

const reportTypeIcons: Record<string, typeof DollarSign> = {
  Revenue: DollarSign,
  Analytics: BarChart3,
  Growth: TrendingUp,
  Team: Users,
}

const reportTypes = ["Revenue", "Analytics", "Growth", "Team"]

interface Report {
  id: string
  title: string
  description: string
  type: string
  date: string
  status: "ready" | "generating" | "failed"
  fileUrl?: string
}

interface ScheduledReport {
  title: string
  frequency: string
  nextRun: string
}

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [schedulesDialogOpen, setSchedulesDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Generate report form state
  const [newReportTitle, setNewReportTitle] = useState("")
  const [newReportDescription, setNewReportDescription] = useState("")
  const [newReportType, setNewReportType] = useState("Analytics")

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      const [reportsData, scheduledData] = await Promise.all([
        api.getReports(),
        api.getScheduledReports(),
      ])
      setReports(reportsData)
      setScheduledReports(scheduledData)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  // Poll for status updates on generating reports
  useEffect(() => {
    const hasGenerating = reports.some((r) => r.status === "generating")
    if (!hasGenerating) return

    const interval = setInterval(() => {
      fetchReports()
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(interval)
  }, [reports, fetchReports])

  const handleGenerateReport = async () => {
    if (!newReportTitle.trim()) {
      alert("Please enter a report title")
      return
    }

    setGenerating(true)
    try {
      await api.createReport({
        title: newReportTitle,
        description: newReportDescription || undefined,
        type: newReportType,
      })
      setGenerateDialogOpen(false)
      setNewReportTitle("")
      setNewReportDescription("")
      setNewReportType("Analytics")
      // Refresh reports list
      await fetchReports()
    } catch (error) {
      console.error("Error generating report:", error)
      alert("Failed to generate report")
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async (report: Report) => {
    if (report.status !== "ready") {
      alert("Report is not ready for download yet")
      return
    }

    try {
      const blob = await api.downloadReport(report.id)
      
      // Create a temporary link and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${report.title.replace(/\s+/g, "_")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error("Error downloading report:", error)
      alert(error.message || "Failed to download report")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return
    }

    setDeletingId(id)
    try {
      await api.deleteReport(id)
      await fetchReports()
    } catch (error) {
      console.error("Error deleting report:", error)
      alert("Failed to delete report")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Reports</h1>
          <p className="text-muted-foreground">Generate and download reports for your business data.</p>
        </div>
        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>Create a new report with custom parameters.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  placeholder="Enter report title"
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="Enter report description"
                  value={newReportDescription}
                  onChange={(e) => setNewReportDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Report Type</Label>
                <Select value={newReportType} onValueChange={setNewReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGenerateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateReport} disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reports List */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Recent Reports</h2>
          {reports.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reports yet. Generate your first report to get started.</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report, index) => {
              const Icon = reportTypeIcons[report.type] || FileText
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="transition-all hover:shadow-md">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="rounded-lg bg-muted p-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium truncate">{report.title}</h3>
                          <Badge variant={report.status === "ready" ? "default" : "secondary"}>
                            {report.status === "ready" ? "Ready" : report.status === "generating" ? "Generating..." : "Failed"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{report.description}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {report.date}
                          </span>
                          <span>{report.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          disabled={report.status !== "ready"}
                          onClick={() => handleDownload(report)}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(report.id)}
                              disabled={deletingId === report.id}
                            >
                              {deletingId === report.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>

        {/* Scheduled Reports */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Scheduled Reports
              </CardTitle>
              <CardDescription>Automatically generated reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduledReports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No scheduled reports configured.</p>
              ) : (
                scheduledReports.map((report) => (
                  <div key={report.title} className="rounded-lg border p-3 space-y-1">
                    <h4 className="font-medium text-sm">{report.title}</h4>
                    <p className="text-xs text-muted-foreground">{report.frequency}</p>
                    <p className="text-xs text-muted-foreground">Next: {report.nextRun}</p>
                  </div>
                ))
              )}
              <Dialog open={schedulesDialogOpen} onOpenChange={setSchedulesDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    Manage Schedules
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage Scheduled Reports</DialogTitle>
                    <DialogDescription>
                      Configure automatic report generation schedules.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    {scheduledReports.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No scheduled reports configured. This feature will be available soon.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {scheduledReports.map((report) => (
                          <div key={report.title} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{report.title}</h4>
                                <p className="text-sm text-muted-foreground">{report.frequency}</p>
                                <p className="text-xs text-muted-foreground">Next: {report.nextRun}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSchedulesDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
