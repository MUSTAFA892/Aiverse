"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, Lock, Camera, Save, Shield, CreditCard, Palette } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Replace the useState initialization with proper data fetching
export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    usageAlerts: true,
    darkMode: true,
    animations: true,
  })

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setProfileData({
          name: data.user.name,
          email: data.user.email,
          bio: data.user.profile?.bio || "",
          location: data.user.profile?.location || "",
          website: data.user.profile?.website || "",
        })
        setPreferences(
          data.user.preferences || {
            emailNotifications: true,
            marketingEmails: false,
            usageAlerts: true,
            darkMode: true,
            animations: true,
          },
        )
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          profile: {
            bio: profileData.bio,
            location: profileData.location,
            website: profileData.website,
          },
        }),
      })

      if (response.ok) {
        toast({
          title: "Profile updated!",
          description: "Your profile has been updated successfully.",
        })
        fetchUserData() // Refresh user data
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePreferencesUpdate = async () => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      })

      if (response.ok) {
        toast({
          title: "Preferences saved!",
          description: "Your preferences have been updated successfully.",
        })
      } else {
        throw new Error("Failed to update preferences")
      }
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load profile</h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password change
    console.log("Password changed")
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Handle avatar upload
      console.log("Avatar uploaded:", file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Profile Settings
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-teal-500/50">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-2xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-teal-500 hover:bg-teal-600 rounded-full p-2 cursor-pointer transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
                  <p className="text-gray-400 mb-3">{user.email}</p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">{user.plan} Plan</Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      Joined {user.joinDate}
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      {user.totalGenerations.toLocaleString()} generations
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-800/50 border border-gray-700/50">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400"
              >
                <Palette className="w-4 h-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Full Name</label>
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Email</label>
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Bio</label>
                      <Input
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Location</label>
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Website</label>
                        <Input
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Current Password</label>
                      <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">New Password</label>
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Confirm New Password</label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-teal-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
              <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Billing & Subscription</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your subscription and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Current Plan: Pro</h3>
                        <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">Active</Badge>
                      </div>
                      <p className="text-gray-300 mb-4">$19/month • Unlimited AI generations</p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 bg-transparent"
                        >
                          Change Plan
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                        >
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Payment Method</h4>
                      <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-6 h-6 text-gray-400" />
                            <div>
                              <p className="text-white">•••• •••• •••• 4242</p>
                              <p className="text-gray-400 text-sm">Expires 12/25</p>
                            </div>
                          </div>
                          <Button variant="ghost" className="text-teal-400 hover:text-teal-300">
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Preferences</CardTitle>
                  <CardDescription className="text-gray-400">Customize your AIverse experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Notifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Email notifications</p>
                            <p className="text-gray-400 text-sm">Receive updates about your account</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.emailNotifications}
                            onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                            className="rounded border-gray-600 text-teal-500 focus:ring-teal-500/20"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Marketing emails</p>
                            <p className="text-gray-400 text-sm">Get tips and product updates</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.marketingEmails}
                            onChange={(e) => setPreferences({ ...preferences, marketingEmails: e.target.checked })}
                            className="rounded border-gray-600 text-teal-500 focus:ring-teal-500/20"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Usage alerts</p>
                            <p className="text-gray-400 text-sm">Notify when approaching limits</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.usageAlerts}
                            onChange={(e) => setPreferences({ ...preferences, usageAlerts: e.target.checked })}
                            className="rounded border-gray-600 text-teal-500 focus:ring-teal-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Interface</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Dark mode</p>
                            <p className="text-gray-400 text-sm">Use dark theme</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.darkMode}
                            onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                            className="rounded border-gray-600 text-teal-500 focus:ring-teal-500/20"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Animations</p>
                            <p className="text-gray-400 text-sm">Enable interface animations</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.animations}
                            onChange={(e) => setPreferences({ ...preferences, animations: e.target.checked })}
                            className="rounded border-gray-600 text-teal-500 focus:ring-teal-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handlePreferencesUpdate}
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
