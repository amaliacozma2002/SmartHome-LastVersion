"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Power, Loader2, AlertCircle } from "lucide-react"
import { devicesAPI } from "@/api"
import { getDeviceIcon, getDeviceColor } from "@/lib/device-icons"
import type { View } from "@/types"

interface CategoryDetailViewProps {
  category: any
  setCurrentView: (view: View) => void
  setSelectedDevice: (device: any) => void
  handleLogout: () => void
}

export function CategoryDetailView({
  category,
  setCurrentView,
  setSelectedDevice,
  handleLogout,
}: CategoryDetailViewProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [devices, setDevices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [deviceToggleLoading, setDeviceToggleLoading] = useState<string>("")

  // Load devices for this category on component mount
  // API Call: GET /api/devices
  useEffect(() => {
    loadCategoryDevices()
  }, [category])

  const loadCategoryDevices = async () => {
    try {
      setIsLoading(true)
      setError("")

      // API Call: GET /api/devices
      // Fetches all devices and filters for this category
      const allDevices = await devicesAPI.getDevices()
      const categoryDevices = allDevices.filter((device: any) => device.type === category.id)
      setDevices(categoryDevices)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load category devices")
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle device on/off
  // API Call: POST /api/devices/:id/toggle
  const handleToggleDevice = async (deviceId: string) => {
    try {
      setDeviceToggleLoading(deviceId)

      // API Call: POST /api/devices/:id/toggle
      // Toggles device state and returns updated device
      const updatedDevice = await devicesAPI.toggleDevice(deviceId)

      // Update the device in local state with server response
      setDevices((prevDevices) => prevDevices.map((device) => (device._id === deviceId ? updatedDevice : device)))
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to toggle device")
      // Clear error after 3 seconds
      setTimeout(() => setError(""), 3000)
    } finally {
      setDeviceToggleLoading("")
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading {category.name} devices...</p>
        </div>
      </div>
    )
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
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-purple-200">{devices.length} devices</p>
          </div>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: getDeviceColor(category.id) }}
        >
          {getDeviceIcon(category.icon)}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/20 backdrop-blur-md border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Overview */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{devices.length}</div>
                <div className="text-sm text-purple-200">Total Devices</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">{devices.filter((d) => d.isOn).length}</div>
                <div className="text-sm text-purple-200">Active Devices</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Devices List */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Devices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-purple-200">No devices found in this category</p>
              </div>
            ) : (
              devices.map((device) => (
                <div
                  key={device._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/10 cursor-pointer hover:bg-white/20"
                  onClick={() => {
                    setSelectedDevice(device)
                    setCurrentView("device-detail")
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        device.isOn ? "bg-emerald-500" : "bg-gray-500"
                      }`}
                    >
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{device.name}</div>
                      <div className="text-xs text-purple-200">{device.room}</div>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleDevice(device._id)
                    }}
                    disabled={deviceToggleLoading === device._id}
                    className={`h-8 w-8 rounded-full ${
                      device.isOn ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    {deviceToggleLoading === device._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Power className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {devices.length > 0 && (
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => {
                  // Turn on all devices in this category
                  devices
                    .filter((d) => !d.isOn)
                    .forEach((device) => {
                      handleToggleDevice(device._id)
                    })
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                disabled={devices.every((d) => d.isOn) || deviceToggleLoading !== ""}
              >
                <Power className="h-4 w-4 mr-2" />
                Turn On All Devices
              </Button>
              <Button
                onClick={() => {
                  // Turn off all devices in this category
                  devices
                    .filter((d) => d.isOn)
                    .forEach((device) => {
                      handleToggleDevice(device._id)
                    })
                }}
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={devices.every((d) => !d.isOn) || deviceToggleLoading !== ""}
              >
                <Power className="h-4 w-4 mr-2" />
                Turn Off All Devices
              </Button>
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
