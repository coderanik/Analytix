"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { usersTableData } from "@/lib/data"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Search } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/contexts/currency-context"

type SortKey = "name" | "email" | "status" | "role" | "revenue"
type SortOrder = "asc" | "desc"

export function DataTable() {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { format } = useCurrency()

  const parseRevenue = (revenue: string) => {
    const numeric = Number.parseFloat(revenue.replace(/[^0-9.-]/g, ""))
    return Number.isNaN(numeric) ? 0 : numeric
  }

  const filteredAndSortedData = useMemo(() => {
    let data = [...usersTableData]

    // Filter by search
    if (search) {
      data = data.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      data = data.filter((user) => user.status === statusFilter)
    }

    // Sort
    data.sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]

      if (sortKey === "revenue") {
        aVal = parseRevenue(aVal as string)
        bVal = parseRevenue(bVal as string)
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return data
  }, [search, sortKey, sortOrder, statusFilter])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
      case "inactive":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
      default:
        return ""
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  Status: {statusFilter === "all" ? "All" : statusFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="gap-1 p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button
                      variant="ghost"
                      className="gap-1 p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      className="gap-1 p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      className="gap-1 p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("role")}
                    >
                      Role
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Last Active</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      className="gap-1 p-0 font-medium hover:bg-transparent"
                      onClick={() => handleSort("revenue")}
                    >
                      Revenue
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("capitalize", getStatusColor(user.status))}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{user.role}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{user.lastActive}</TableCell>
                    <TableCell className="text-right font-medium">
                      {format(parseRevenue(user.revenue))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit user</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete user</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination info */}
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {filteredAndSortedData.length} of {usersTableData.length} users
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
