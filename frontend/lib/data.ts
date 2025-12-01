

export const revenueData = [
  { month: "Jan", revenue: 4500, target: 4000 },
  { month: "Feb", revenue: 5200, target: 4500 },
  { month: "Mar", revenue: 4800, target: 5000 },
  { month: "Apr", revenue: 6100, target: 5500 },
  { month: "May", revenue: 5900, target: 6000 },
  { month: "Jun", revenue: 7200, target: 6500 },
  { month: "Jul", revenue: 6800, target: 7000 },
  { month: "Aug", revenue: 7500, target: 7200 },
  { month: "Sep", revenue: 8100, target: 7500 },
  { month: "Oct", revenue: 7900, target: 8000 },
  { month: "Nov", revenue: 8600, target: 8200 },
  { month: "Dec", revenue: 9200, target: 8500 },
]

export const userActivityData = [
  { day: "Mon", active: 2400, new: 400 },
  { day: "Tue", active: 1398, new: 300 },
  { day: "Wed", active: 9800, new: 500 },
  { day: "Thu", active: 3908, new: 480 },
  { day: "Fri", active: 4800, new: 380 },
  { day: "Sat", active: 3800, new: 430 },
  { day: "Sun", active: 4300, new: 390 },
]

export const trafficSourceData = [
  { name: "Organic", value: 4500, fill: "#3b82f6" },
  { name: "Direct", value: 3200, fill: "#22c55e" },
  { name: "Referral", value: 2100, fill: "#f59e0b" },
  { name: "Social", value: 1800, fill: "#8b5cf6" },
  { name: "Email", value: 1200, fill: "#ef4444" },
]

export const kpiData = {
  revenue: {
    value: 124592,
    change: "+12.5%",
    trend: "up" as const,
    description: "Total revenue this month",
  },
  users: {
    value: "24,521",
    change: "+8.2%",
    trend: "up" as const,
    description: "Active users this month",
  },
  conversion: {
    value: "3.24%",
    change: "+0.4%",
    trend: "up" as const,
    description: "Conversion rate",
  },
  retention: {
    value: "89.2%",
    change: "-1.2%",
    trend: "down" as const,
    description: "User retention rate",
  },
}

export const usersTableData = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    status: "active",
    role: "Admin",
    lastActive: "2 hours ago",
    revenue: "$12,450",
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    status: "active",
    role: "User",
    lastActive: "5 hours ago",
    revenue: "$8,920",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    status: "inactive",
    role: "User",
    lastActive: "2 days ago",
    revenue: "$5,340",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    status: "active",
    role: "Editor",
    lastActive: "1 hour ago",
    revenue: "$15,780",
  },
  {
    id: "5",
    name: "James Wilson",
    email: "james@example.com",
    status: "pending",
    role: "User",
    lastActive: "3 hours ago",
    revenue: "$3,200",
  },
  {
    id: "6",
    name: "Jessica Martinez",
    email: "jessica@example.com",
    status: "active",
    role: "User",
    lastActive: "30 minutes ago",
    revenue: "$9,450",
  },
  {
    id: "7",
    name: "David Anderson",
    email: "david@example.com",
    status: "active",
    role: "Admin",
    lastActive: "1 day ago",
    revenue: "$22,100",
  },
  {
    id: "8",
    name: "Ashley Thomas",
    email: "ashley@example.com",
    status: "inactive",
    role: "User",
    lastActive: "1 week ago",
    revenue: "$1,890",
  },
]

export const notifications = [
  {
    id: "1",
    title: "New user registered",
    description: "Alex Johnson just signed up",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Payment received",
    description: "$1,200 from Sarah Williams",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Server alert",
    description: "CPU usage exceeded 80%",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "New feature deployed",
    description: "Analytics v2.0 is now live",
    time: "1 day ago",
    read: true,
  },
]
