"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  SettingsIcon,
  Clock,
  Download,
  CreditCard,
} from "lucide-react"
import type { View, UserType } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface SettingsViewProps {
  user: UserType
  updateProfile: (updates: Partial<UserType>) => void
  setCurrentView: (view: View) => void
  handleLogout: () => void
}

export function SettingsView({ user, updateProfile, setCurrentView, handleLogout }: SettingsViewProps) {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoLock, setAutoLock] = useState(true)

  // Provide default user values if user is undefined
  const safeUser = user || {
    firstName: "User",
    lastName: "",
    email: "user@example.com",
    subscription: "Free",
    maxDevices: 5
  }

  // Additional safety for firstName and lastName  
  const firstName = safeUser.firstName || "User"
  const lastName = safeUser.lastName || ""
  const fullName = `${firstName} ${lastName}`.trim()
  const userInitial = firstName.charAt(0).toUpperCase()

  const menuItems = [
    {
      icon: User,
      label: "Profile Settings",
      description: "Manage your account information",
      action: () => setCurrentView("profile"),
      showChevron: true,
    },
    {
      icon: CreditCard,
      label: "Subscription",
      description: "Manage your subscription plan",
      action: () => setCurrentView("subscription"),
      showChevron: true,
      badge: safeUser.subscription,
    },
    {
      icon: Clock,
      label: "Activity History",
      description: "View your recent activities",
      action: () => setCurrentView("history"),
      showChevron: true,
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Push notifications and alerts",
      action: () => setNotifications(!notifications),
      toggle: notifications,
    },
    {
      icon: Palette,
      label: "Dark Mode",
      description: "Switch between light and dark themes",
      action: () => setDarkMode(!darkMode),
      toggle: darkMode,
    },
    {
      icon: Shield,
      label: "Auto Lock",
      description: "Automatically lock when inactive",
      action: () => setAutoLock(!autoLock),
      toggle: autoLock,
    },
    {
      icon: Globe,
      label: "Language",
      description: "English (US)",
      action: () => {},
      showChevron: true,
    },
    {
      icon: Download,
      label: "Export Data",
      description: "Download your smart home data",
      action: () => {},
      showChevron: true,
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get help and contact support",
      action: () => {},
      showChevron: true,
    },
    {
      icon: Info,
      label: "About",
      description: "App version and information",
      action: () => {},
      showChevron: true,
    },
  ]

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "Pro":
        return "bg-purple-500"
      case "Premium":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 pb-20 text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/10 p-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("dashboard")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
              <SettingsIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* User Profile Card */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white text-xl font-bold">
                {userInitial}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{fullName}</h3>
                <p className="text-sm text-purple-200">{safeUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${getSubscriptionColor(safeUser.subscription)} text-white`}>{safeUser.subscription}</Badge>
                  <span className="text-xs text-purple-200">
                    {safeUser.maxDevices} device{safeUser.maxDevices !== 1 ? "s" : ""} max
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentView("profile")}
                className="text-purple-200 hover:text-white hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Card
                key={index}
                className="bg-white/15 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
                onClick={item.action}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <IconComponent className="h-5 w-5 text-purple-200" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{item.label}</h4>
                          {item.badge && (
                            <Badge className={`${getSubscriptionColor(item.badge)} text-white text-xs`}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-purple-200">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {item.toggle !== undefined && (
                        <Switch
                          checked={item.toggle}
                          onCheckedChange={() => item.action()}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      {item.showChevron && <ChevronRight className="h-5 w-5 text-purple-200 ml-2" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Logout Button */}
        <Card className="bg-red-500/20 backdrop-blur-md border-red-500/30">
          <CardContent className="p-4">
            <Button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white">
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-purple-200 text-sm">
          <p>Smart Home App v2.1.0</p>
          <p>© 2024 Smart Home Solutions</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="settings" setCurrentView={setCurrentView} handleLogout={handleLogout} />
    </div>
  )
}
