"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Mail, MapPin, Building, Edit, Camera, Shield, Award, Loader2, Globe } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"

export function ProfilePage() {
  const { user: authUser } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, activityData] = await Promise.all([
          api.getProfile(),
          api.getProfileActivity()
        ])
        setProfile(profileData)
        setActivity(activityData)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    if (authUser) {
      fetchProfile()
      // Load profile picture preview from localStorage if exists
      const savedPreview = localStorage.getItem('profilePicPreview');
      if (savedPreview) {
        setProfilePicPreview(savedPreview);
      }
    }
  }, [authUser])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Failed to load profile</p>
      </div>
    )
  }

  // Get user initials for avatar fallback
  const initials = profile.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  // Format joined date
  const joinedDate = profile.joinedDate || "March 2023"
  
  // Get stats from profile
  const stats = [
    { label: "Projects", value: profile.stats?.projects || "24" },
    { label: "Tasks Completed", value: profile.stats?.tasksCompleted || "156" },
    { label: "Team Members", value: profile.stats?.teamMembers || "12" },
    { label: "Revenue Generated", value: profile.stats?.revenueGenerated || "$0" },
  ]

  // Get achievements from profile or use defaults
  const achievements = profile.achievements && profile.achievements.length > 0
    ? profile.achievements.map((ach: string, idx: number) => ({
        icon: idx === 0 ? Shield : Award,
        label: ach,
        color: idx === 0 ? "text-blue-500" : "text-yellow-500"
      }))
    : [
        { icon: Shield, label: "Early Adopter", color: "text-blue-500" },
        { icon: Award, label: "Top Contributor", color: "text-yellow-500" },
      ]
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Profile</h1>
        <p className="text-muted-foreground">View and manage your profile information.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {profilePicPreview ? (
                      <AvatarImage src={profilePicPreview} alt={profile.name || "User"} />
                    ) : null}
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md hover:shadow-lg transition-shadow"
                    onClick={() => {
                      // Profile picture upload functionality (frontend only for now)
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Image size must be less than 5MB');
                            return;
                          }
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            alert('Please select a valid image file');
                            return;
                          }
                          // Create a local preview (not saved to backend)
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const imageUrl = event.target?.result as string;
                            setProfilePicPreview(imageUrl);
                            // Store in localStorage for persistence (frontend only)
                            localStorage.setItem('profilePicPreview', imageUrl);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    title="Add profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                {profilePicPreview && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Preview only (not saved to server)
                  </p>
                )}
                <h2 className="mt-4 text-xl font-semibold">{profile.name || "User"}</h2>
                <p className="text-sm text-muted-foreground">{profile.role || "User"}</p>
                <Badge variant="secondary" className="mt-2">
                  {profile.plan || "Pro Plan"}
                </Badge>

                <div className="mt-6 flex w-full flex-col gap-2">
                  <Button 
                    className="w-full"
                    onClick={() => router.push('/settings')}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="w-full space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.company || "No company"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.location || "No location"}</span>
                  </div>
                  {profile.country && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.country}</span>
                      {profile.currency && (
                        <Badge variant="outline" className="ml-2">
                          {profile.currency}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {joinedDate}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="w-full">
                  <h3 className="mb-3 text-sm font-medium">Achievements</h3>
                  <div className="flex flex-wrap gap-2">
                    {achievements.map((achievement) => {
                      const Icon = achievement.icon
                      return (
                        <div
                          key={achievement.label}
                          className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs"
                        >
                          <Icon className={`h-3.5 w-3.5 ${achievement.color}`} />
                          {achievement.label}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats and Activity */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Your performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="rounded-lg bg-muted/50 p-4 text-center"
                    >
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activity && activity.length > 0 ? (
                    activity.map((act, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <span className="text-sm">{act.action}</span>
                        <span className="text-xs text-muted-foreground">{act.time}</span>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bio */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>A brief introduction about yourself</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {profile.bio || "No bio available. Click 'Edit Profile' to add a bio about yourself."}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
