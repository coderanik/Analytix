"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/hooks/use-theme"
import { Moon, Sun, Loader2, CheckCircle2 } from "lucide-react"
import { api } from "@/lib/api"
import { useCurrency } from "@/contexts/currency-context"

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "ZA", name: "South Africa" },
]

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
]

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { currency: globalCurrency, setCurrency: setGlobalCurrency } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)
  
  // Profile form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  
  // Settings form state
  const [timezone, setTimezone] = useState("utc-8")
  const [language, setLanguage] = useState("en")
  const [country, setCountry] = useState("US")
  const [currency, setCurrency] = useState(globalCurrency || "USD")
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(false)
  const [marketing, setMarketing] = useState(false)
  
  // Display settings
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, settingsData] = await Promise.all([
          api.getProfile(),
          api.getSettings()
        ])
        setProfile(profileData)
        setSettings(settingsData)
        
        // Populate form fields from profile
        setName(profileData.name || "")
        setEmail(profileData.email || "")
        setCompany(profileData.company || "")
        setLocation(profileData.location || "")
        
        // Populate settings
        if (settingsData) {
          setTimezone(settingsData.timezone || "utc-8")
          setLanguage(settingsData.language || "en")
          // Use country/currency from settings if available, otherwise from profile
          const resolvedCountry = settingsData.country || profileData.country || "US"
          const resolvedCurrency = settingsData.currency || profileData.currency || "USD"

          setCountry(resolvedCountry)
          setCurrency(resolvedCurrency)
          setGlobalCurrency(resolvedCurrency)
          setEmailNotifications(settingsData.notifications?.email ?? true)
          setPushNotifications(settingsData.notifications?.push ?? true)
          setWeeklyReports(settingsData.notifications?.weeklyReports ?? false)
          setMarketing(settingsData.notifications?.marketing ?? false)
          setCompactMode(settingsData.display?.compactMode ?? false)
          setAnimations(settingsData.display?.animations ?? true)
          setHighContrast(settingsData.display?.highContrast ?? false)
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await api.updateProfile({
        name,
        email,
        company,
        location,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await api.updateSettings({
        timezone,
        language,
        country,
        currency,
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
          weeklyReports,
          marketing,
        },
        display: {
          compactMode,
          animations,
          highContrast,
        },
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Failed to update settings')
    } finally {
      setSaving(false)
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account information and email address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                  />
                </div>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Timezone & Language</CardTitle>
                <CardDescription>Configure your timezone and language preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="utc+0">UTC</SelectItem>
                        <SelectItem value="utc+1">Central European (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Currency</Label>
                    <Select
                      value={currency}
                      onValueChange={(value) => {
                        setCurrency(value)
                        setGlobalCurrency(value as any)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.name} ({c.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Settings"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Theme</CardTitle>
                <CardDescription>Choose your preferred color theme for the dashboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                  ].map((option) => {
                    const Icon = option.icon
                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTheme(option.value as "light" | "dark")}
                        className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
                          theme === option.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`rounded-lg p-3 ${
                            theme === option.value ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium">{option.label}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Display Settings</CardTitle>
                <CardDescription>Customize how the dashboard looks and feels.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact layout with smaller spacing.</p>
                  </div>
                  <Switch checked={compactMode} onCheckedChange={setCompactMode} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable smooth animations and transitions.</p>
                  </div>
                  <Switch checked={animations} onCheckedChange={setAnimations} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-muted-foreground">Increase contrast for better visibility.</p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full sm:w-auto mt-4"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Display Settings"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email notifications for important updates.</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>
                  <Separator className="mt-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser.</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                  <Separator className="mt-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Get a weekly summary of your analytics.</p>
                    </div>
                    <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
                  </div>
                  <Separator className="mt-4" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive product updates and marketing emails.</p>
                    </div>
                    <Switch checked={marketing} onCheckedChange={setMarketing} />
                  </div>
                </div>
                <Button 
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full sm:w-auto mt-4"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    "Save Notification Settings"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordError && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm border border-destructive/20">
                    {passwordError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={async () => {
                    setPasswordError("")
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      setPasswordError("Please fill in all fields")
                      return
                    }
                    if (newPassword.length < 6) {
                      setPasswordError("Password must be at least 6 characters")
                      return
                    }
                    if (newPassword !== confirmPassword) {
                      setPasswordError("Passwords do not match")
                      return
                    }
                    setSaving(true)
                    try {
                      await api.updatePassword(currentPassword, newPassword)
                      setCurrentPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                      setSaved(true)
                      setTimeout(() => setSaved(false), 3000)
                    } catch (error: any) {
                      setPasswordError(error.message || "Failed to update password")
                    } finally {
                      setSaving(false)
                    }
                  }}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Updated!
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Use an authenticator app for additional security.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions that affect your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive">Delete Account</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
