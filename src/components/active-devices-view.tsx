"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Power, Loader2, AlertCircle } from "lucide-react"
import { devicesAPI } from "@/api"
import { getDeviceIcon } from "@/lib/device-icons"
import type { View } from "@/types"

interface ActiveDevicesViewProps {
  setCurrentView: (view: View) => void
  setSelectedDevice: (device: any) => void
  handleLogout: () => void
}

export function ActiveDevicesView({ setCurrentView, setSelectedDevice, handleLogout }: ActiveDevicesViewProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [devices, setDevices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [deviceToggleLoading, setDeviceToggleLoading] = useState<string>("")

  // Load devices on component mount and filter active ones
  // API Call: GET /api/devices
  useEffect(() => {
    loadActiveDevices()
  }, [])

  const loadActiveDevices = async () => {
    try {
      setIsLoading(true)
      setError("")

      // API Call: GET /api/devices
      // Fetches all devices and filters for active ones
      const allDevices = await devicesAPI.getDevices()
      const activeDevices = allDevices.filter((device: any) => device.isOn)
      setDevices(activeDevices)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to load active devices")
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

      // If device was turned off, remove it from active devices list
      if (!updatedDevice.isOn) {
        setDevices((prevDevices) => prevDevices.filter((device) => device._id !== deviceId))
      } else {
        // Update the device in local state with server response
        setDevices((prevDevices) => prevDevices.map((device) => (device._id === deviceId ? updatedDevice : device)))
      }
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
          <p>Loading active devices...</p>
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
            <h1 className="text-2xl font-bold">Active Devices</h1>
            <p className="text-purple-200">Currently running devices</p>
          </div>
        </div>
        <div className="text-base font-medium">{devices.length} active</div>
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

        {/* Active Devices List - Real data from API */}
        {devices.length === 0 ? (
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardContent className="p-8 text-center">
              <Power className="h-12 w-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Active Devices</h3>
              <p className="text-purple-200 mb-4">All your devices are currently turned off</p>
              <Button onClick={() => setCurrentView("control")} className="bg-white text-purple-700 hover:bg-purple-50">
                View All Devices
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <Card key={device._id} className="bg-white/15 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => {
                        setSelectedDevice(device)
                        setCurrentView("device-detail")
                      }}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{device.name}</h3>
                        <p className="text-sm text-purple-200">
                          {device.room} • {device.type} • {device.status}
                        </p>
                        {/* Show device-specific info */}
                        {device.temperature && (
                          <p className="text-xs text-purple-300">Temperature: {device.temperature}°C</p>
                        )}
                        {device.brightness && (
                          <p className="text-xs text-purple-300">Brightness: {device.brightness}%</p>
                        )}
                        {device.volume && <p className="text-xs text-purple-300">Volume: {device.volume}%</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status indicator */}
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-400">Active</span>
                      </div>

                      {/* Toggle Button */}
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleDevice(device._id)
                        }}
                        disabled={deviceToggleLoading === device._id}
                        className="h-10 w-10 rounded-full bg-red-500 hover:bg-red-600"
                      >
                        {deviceToggleLoading === device._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {devices.length > 0 && (
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Active Devices Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{devices.length}</div>
                  <div className="text-sm text-purple-200">Currently Active</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Array.from(new Set(devices.map((d) => d.room))).length}
                  </div>
                  <div className="text-sm text-purple-200">Rooms in Use</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <Button
                  onClick={() => {
                    // Turn off all devices
                    devices.forEach((device) => handleToggleDevice(device._id))
                  }}
                  className="w-full bg-red-500 hover:bg-red-600"
                  disabled={deviceToggleLoading !== ""}
                >
                  <Power className="h-4 w-4 mr-2" />
                  Turn Off All Devices
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
