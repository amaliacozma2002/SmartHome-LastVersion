"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Home, Thermometer, Zap, Activity, Settings, History, Mic, Palette, Crown, Plus } from "lucide-react"
import type { View, Device, Room, Category, UserType } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface DashboardViewProps {
  currentUser: UserType
  devices: Device[]
  rooms: Room[]
  categories: Category[]
  toggleDevice: (deviceId: string) => void
  setCurrentView: (view: View) => void
  handleLogout: () => void
}

export function DashboardView({
  currentUser,
  devices = [],
  rooms = [],
  categories = [],
  toggleDevice,
  setCurrentView,
  handleLogout,
}: DashboardViewProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const activeDevices = (devices || []).filter((device) => device.status === "on")
  const totalEnergyUsage = activeDevices.reduce((sum, device) => sum + (device.energyUsage || 0), 0)

  const quickActions = [
    {
      id: "all-devices",
      title: "All Devices",
      subtitle: `${devices.length} devices`,
      icon: <Home className="h-6 w-6" />,
      color: "bg-blue-500",
      view: "all-devices" as View,
    },
    {
      id: "add-device",
      title: "Add Device",
      subtitle: "Add new device",
      icon: <Plus className="h-6 w-6" />,
      color: "bg-emerald-500",
      view: "add-device" as View,
    },
    {
      id: "active-devices",
      title: "Active Devices",
      subtitle: `${activeDevices.length} active`,
      icon: <Activity className="h-6 w-6" />,
      color: "bg-green-500",
      view: "active-devices" as View,
    },
    {
      id: "automation",
      title: "Automation",
      subtitle: "Smart scenes",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-purple-500",
      view: "automation" as View,
    },
    {
      id: "energy",
      title: "Energy Monitor",
      subtitle: `${totalEnergyUsage.toFixed(1)}kW`,
      icon: <Zap className="h-6 w-6" />,
      color: "bg-yellow-500",
      view: "energy-monitoring" as View,
    },
    {
      id: "voice",
      title: "Voice Control",
      subtitle: "Hey Assistant",
      icon: <Mic className="h-6 w-6" />,
      color: "bg-indigo-500",
      view: "voice-control" as View,
    },
    {
      id: "scenes",
      title: "Scenes",
      subtitle: "Quick settings",
      icon: <Palette className="h-6 w-6" />,
      color: "bg-pink-500",
      view: "scenes" as View,
    },
    {
      id: "climate",
      title: "Climate",
      subtitle: "Heating & Cooling",
      icon: <Thermometer className="h-6 w-6" />,
      color: "bg-red-500",
      view: "heating-cooling" as View,
    },
    {
      id: "history",
      title: "History",
      subtitle: "Device logs",
      icon: <History className="h-6 w-6" />,
      color: "bg-gray-500",
      view: "history" as View,
    },
  ]

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 pb-20 text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/10 p-4 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-purple-200">
            {currentUser.firstName} {currentUser.lastName}
          </p>
        </div>
        <div className="text-right">
          <div className="text-base font-medium">{getCurrentTime()}</div>
          <div className="text-sm text-purple-200">{currentUser.subscription} Plan</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{devices.length}</div>
              <div className="text-sm text-purple-200">Total Devices</div>
            </CardContent>
          </Card>
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{activeDevices.length}</div>
              <div className="text-sm text-purple-200">Active Now</div>
            </CardContent>
          </Card>
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{totalEnergyUsage.toFixed(1)}kW</div>
              <div className="text-sm text-purple-200">Energy Usage</div>
            </CardContent>
          </Card>
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{rooms.length}</div>
              <div className="text-sm text-purple-200">Rooms</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.id}
                className="bg-white/15 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => setCurrentView(action.view)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{action.title}</h3>
                      <p className="text-sm text-purple-200">{action.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Devices */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Devices</h2>
          <div className="space-y-3">
            {devices.slice(0, 3).map((device) => (
              <Card key={device.id} className="bg-white/15 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          device.status === "on" ? "bg-emerald-500" : "bg-gray-500"
                        }`}
                      >
                        <Home className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{device.name}</h4>
                        <p className="text-sm text-purple-200">{device.room}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toggleDevice(device.id)}
                      className={`${
                        device.status === "on" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                      }`}
                    >
                      {device.status === "on" ? "OFF" : "ON"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Banner */}
        {currentUser.subscription === "Free" && (
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border-yellow-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-8 w-8 text-yellow-400" />
                  <div>
                    <h3 className="font-semibold text-white">Upgrade to Premium</h3>
                    <p className="text-sm text-yellow-200">Unlock unlimited devices and advanced features</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setCurrentView("subscription")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="dashboard"
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
    </div>
  )
}
