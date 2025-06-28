"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Power, Trash2, Edit3 } from "lucide-react"
import type { View, Device } from "@/types"
import { getCurrentTime } from "@/lib/utils"
import { getDeviceIcon } from "@/lib/device-icons"

interface DeviceDetailViewProps {
  device: Device
  updateDevice: (deviceId: string, updates: Partial<Device>) => void
  toggleDevice: (deviceId: string) => void
  removeDevice: (deviceId: string) => void
  setCurrentView: (view: View) => void
  handleLogout: () => void
}

export function DeviceDetailView({
  device,
  updateDevice,
  toggleDevice,
  removeDevice,
  setCurrentView,
  handleLogout,
}: DeviceDetailViewProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(device.name)

  const handleBrightnessChange = (value: number[]) => {
    updateDevice(device.id, { brightness: value[0] })
  }

  const handleTemperatureChange = (value: number[]) => {
    updateDevice(device.id, { temperature: value[0] })
  }

  const handleVolumeChange = (value: number[]) => {
    updateDevice(device.id, { volume: value[0] })
  }

  const handleSaveEdit = () => {
    updateDevice(device.id, { name: editName })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${device.name}?`)) {
      removeDevice(device.id)
      setCurrentView("control")
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
            onClick={() => setCurrentView("control")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Device Details</h1>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Device Info Card */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                    device.status === "on" ? "bg-emerald-500" : "bg-gray-500"
                  }`}
                >
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white/20 border border-white/30 rounded px-2 py-1 text-white"
                      />
                      <Button size="sm" onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">{device.name}</h2>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                        className="h-8 w-8 text-purple-200 hover:text-white"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-purple-200">
                    {device.room} • {device.type} • {device.status === "on" ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDelete}
                  className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => toggleDevice(device.id)}
                  className={`h-12 w-12 rounded-full ${
                    device.status === "on" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  <Power className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Device Status */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{device.status === "on" ? "ON" : "OFF"}</div>
                <div className="text-sm text-purple-200">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {device.battery !== undefined ? `${device.battery}%` : "N/A"}
                </div>
                <div className="text-sm text-purple-200">Battery</div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-center text-sm text-purple-200">
              Last updated: {device.lastUpdated ? new Date(device.lastUpdated).toLocaleString() : "Never"}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        {device.status === "on" && (
          <div className="space-y-4">
            {/* Brightness Control */}
            {device.brightness !== undefined && (
              <Card className="bg-white/15 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Brightness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[device.brightness]}
                      onValueChange={handleBrightnessChange}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-white font-medium">{device.brightness}%</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Temperature Control */}
            {device.temperature !== undefined && (
              <Card className="bg-white/15 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[device.temperature]}
                      onValueChange={handleTemperatureChange}
                      min={16}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-white font-medium">{device.temperature}°C</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Volume Control */}
            {device.volume !== undefined && (
              <Card className="bg-white/15 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[device.volume]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-center text-white font-medium">{device.volume}%</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Device Info */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Device Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-purple-200">Type:</span>
              <span className="text-white capitalize">{device.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Room:</span>
              <span className="text-white">{device.room}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Category:</span>
              <span className="text-white capitalize">{device.category}</span>
            </div>
            {device.energyUsage !== undefined && (
              <div className="flex justify-between">
                <span className="text-purple-200">Energy Usage:</span>
                <span className="text-white">{device.energyUsage}W</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="control"
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
    </div>
  )
}
