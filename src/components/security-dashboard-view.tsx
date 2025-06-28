"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Shield, Camera, Lock, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { View, Device } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface SecurityDashboardViewProps {
  devices?: Device[]
  setCurrentView: (view: View) => void
  handleLogout: () => void
}

export function SecurityDashboardView({ devices = [], setCurrentView, handleLogout }: SecurityDashboardViewProps) {
  const [securityMode, setSecurityMode] = useState<"home" | "away" | "night" | "off">("home")

  // Ensure devices is an array before filtering
  const securityDevices = (devices || []).filter(
    (device) => device.type === "security" || device.type === "camera" || device.type === "access",
  )

  const activeSecurityDevices = securityDevices.filter((device) => device.status === "on")

  // Mock security events
  const securityEvents = [
    {
      id: "1",
      type: "motion",
      device: "Security Camera",
      location: "Front Door",
      time: "2 minutes ago",
      severity: "low",
    },
    {
      id: "2",
      type: "door",
      device: "Smart Lock",
      location: "Main Entrance",
      time: "1 hour ago",
      severity: "medium",
    },
    {
      id: "3",
      type: "alarm",
      device: "Security System",
      location: "Living Room",
      time: "3 hours ago",
      severity: "high",
    },
  ]

  const getSecurityStatus = () => {
    const totalDevices = securityDevices.length
    const activeDevices = activeSecurityDevices.length

    if (activeDevices === totalDevices) return { status: "secure", color: "text-green-400" }
    if (activeDevices > totalDevices / 2) return { status: "partial", color: "text-yellow-400" }
    return { status: "vulnerable", color: "text-red-400" }
  }

  const securityStatus = getSecurityStatus()

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
          <h1 className="text-xl font-bold">Security Dashboard</h1>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Security Status */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className={`h-12 w-12 ${securityStatus.color}`} />
                <div>
                  <h3 className="text-xl font-bold text-white capitalize">{securityStatus.status}</h3>
                  <p className="text-purple-200">
                    {activeSecurityDevices.length} of {securityDevices.length} devices active
                  </p>
                </div>
              </div>
              <Badge
                className={`${
                  securityStatus.status === "secure"
                    ? "bg-green-500"
                    : securityStatus.status === "partial"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                } text-white`}
              >
                {securityStatus.status.toUpperCase()}
              </Badge>
            </div>

            {/* Security Mode Selector */}
            <div className="grid grid-cols-4 gap-2">
              {["home", "away", "night", "off"].map((mode) => (
                <Button
                  key={mode}
                  variant={securityMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSecurityMode(mode as any)}
                  className={`capitalize ${
                    securityMode === mode ? "bg-purple-500 text-white" : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {mode}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Devices */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Security Devices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      device.status === "on" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {device.type === "camera" ? (
                      <Camera className="h-4 w-4" />
                    ) : device.type === "access" ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{device.name}</h4>
                    <p className="text-sm text-purple-200">{device.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.battery && <span className="text-xs text-purple-200">{device.battery}%</span>}
                  <Switch checked={device.status === "on"} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/10">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    event.severity === "high"
                      ? "bg-red-500"
                      : event.severity === "medium"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                >
                  {event.type === "motion" ? (
                    <Camera className="h-4 w-4" />
                  ) : event.type === "door" ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{event.device}</h4>
                  <p className="text-sm text-purple-200">{event.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-purple-200">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="h-16 bg-red-500 hover:bg-red-600 text-white">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Emergency Alert
          </Button>
          <Button className="h-16 bg-blue-500 hover:bg-blue-600 text-white">
            <CheckCircle className="h-6 w-6 mr-2" />
            Arm All Devices
          </Button>
        </div>
      </div>

      <BottomNavigation activeTab="control" setCurrentView={setCurrentView} handleLogout={handleLogout} />
    </div>
  )
}
