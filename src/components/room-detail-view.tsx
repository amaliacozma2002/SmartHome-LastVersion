"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Power, Star, Thermometer, Droplets, Home, Plus, Trash2 } from "lucide-react"
import type { View, Room, Device } from "@/types"
import { getCurrentTime, getDeviceIcon } from "@/lib/utils"

interface RoomDetailViewProps {
  room: Room | null
  devices: Device[]
  toggleDevice: (deviceId: string) => void
  toggleFavorite: (deviceId: string) => void
  favouriteDevices: string[]
  addDevice: (device: Omit<Device, "id">) => void
  removeDevice: (deviceId: string) => void
  setCurrentView: (view: View) => void
  setSelectedDevice: (device: Device | null) => void
}

export function RoomDetailView({
  room,
  devices = [],
  toggleDevice,
  toggleFavorite,
  favouriteDevices = [],
  addDevice,
  removeDevice,
  setCurrentView,
  setSelectedDevice,
}: RoomDetailViewProps) {
  const [showAddDeviceDialog, setShowAddDeviceDialog] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: "",
    type: "lighting" as Device["type"],
    category: "lighting",
    status: "off" as "on" | "off",
    brightness: 50,
    temperature: 20,
    volume: 50,
  })

  if (!room) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 p-6 text-white">
        <p>Room not found</p>
      </div>
    )
  }

  const roomDevices = devices.filter((device) => device.room === room.name)
  const activeDevices = roomDevices.filter((device) => device.status === "on")

  const deviceTypes = [
    { value: "lighting", label: "Light", category: "lighting" },
    { value: "climate", label: "Climate Control", category: "heating" },
    { value: "security", label: "Security", category: "security" },
    { value: "camera", label: "Camera", category: "security" },
    { value: "access", label: "Access Control", category: "security" },
    { value: "speaker", label: "Speaker", category: "music" },
    { value: "tv", label: "TV", category: "multimedia" },
    { value: "automation", label: "Automation", category: "shading" },
    { value: "humidity", label: "Humidity Sensor", category: "heating" },
  ]

  const handleAddDevice = () => {
    if (newDevice.name.trim()) {
      const deviceType = deviceTypes.find((dt) => dt.value === newDevice.type)
      const deviceToAdd: Omit<Device, "id"> = {
        name: newDevice.name.trim(),
        type: newDevice.type,
        status: newDevice.status,
        room: room.name,
        category: deviceType?.category || "lighting",
      }

      // Add type-specific properties
      if (newDevice.type === "lighting") {
        deviceToAdd.brightness = newDevice.brightness
      } else if (newDevice.type === "climate") {
        deviceToAdd.temperature = newDevice.temperature
      } else if (newDevice.type === "speaker" || newDevice.type === "tv") {
        deviceToAdd.volume = newDevice.volume
      }

      addDevice(deviceToAdd)
      setNewDevice({
        name: "",
        type: "lighting",
        category: "lighting",
        status: "off",
        brightness: 50,
        temperature: 20,
        volume: 50,
      })
      setShowAddDeviceDialog(false)
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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
              <Home className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">{room.name}</h1>
          </div>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Room Overview */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{activeDevices.length}</div>
                <div className="text-sm text-purple-200">Active Devices</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{roomDevices.length}</div>
                <div className="text-sm text-purple-200">Total Devices</div>
              </div>
            </div>

            {room.temperature && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-purple-200" />
                  <span className="text-purple-200">Temperature</span>
                </div>
                <span className="text-white font-semibold">{room.temperature}°C</span>
              </div>
            )}

            {room.humidity && (
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-purple-200" />
                  <span className="text-purple-200">Humidity</span>
                </div>
                <span className="text-white font-semibold">{room.humidity}%</span>
              </div>
            )}

            {/* Device Management Button */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <Dialog open={showAddDeviceDialog} onOpenChange={setShowAddDeviceDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Device to {room.name}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-purple-900 border-purple-700 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Device to {room.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-purple-200">Device Name</Label>
                      <Input
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                        placeholder="e.g., Ceiling Light"
                        className="bg-white/10 text-white border-white/20"
                      />
                    </div>

                    <div>
                      <Label className="text-purple-200">Device Type</Label>
                      <Select
                        value={newDevice.type}
                        onValueChange={(value) => {
                          const deviceType = deviceTypes.find((dt) => dt.value === value)
                          setNewDevice({
                            ...newDevice,
                            type: value as Device["type"],
                            category: deviceType?.category || "lighting",
                          })
                        }}
                      >
                        <SelectTrigger className="bg-white/10 text-white border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {deviceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-purple-200">Initial Status</Label>
                      <Select
                        value={newDevice.status}
                        onValueChange={(value) => setNewDevice({ ...newDevice, status: value as "on" | "off" })}
                      >
                        <SelectTrigger className="bg-white/10 text-white border-white/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="off">Off</SelectItem>
                          <SelectItem value="on">On</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Type-specific settings */}
                    {newDevice.type === "lighting" && (
                      <div>
                        <Label className="text-purple-200">Initial Brightness (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newDevice.brightness}
                          onChange={(e) =>
                            setNewDevice({ ...newDevice, brightness: Number.parseInt(e.target.value) || 50 })
                          }
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                    )}

                    {newDevice.type === "climate" && (
                      <div>
                        <Label className="text-purple-200">Initial Temperature (°C)</Label>
                        <Input
                          type="number"
                          min="10"
                          max="30"
                          value={newDevice.temperature}
                          onChange={(e) =>
                            setNewDevice({ ...newDevice, temperature: Number.parseInt(e.target.value) || 20 })
                          }
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                    )}

                    {(newDevice.type === "speaker" || newDevice.type === "tv") && (
                      <div>
                        <Label className="text-purple-200">Initial Volume (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newDevice.volume}
                          onChange={(e) =>
                            setNewDevice({ ...newDevice, volume: Number.parseInt(e.target.value) || 50 })
                          }
                          className="bg-white/10 text-white border-white/20"
                        />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button onClick={handleAddDevice} className="flex-1 bg-green-500 hover:bg-green-600">
                        Add Device
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddDeviceDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Devices in Room */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Devices in {room.name}</h3>
          {roomDevices.length > 0 ? (
            <div className="space-y-3">
              {roomDevices.map((device) => (
                <Card key={device.id} className="bg-white/15 backdrop-blur-md border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-4 flex-1 cursor-pointer"
                        onClick={() => {
                          setSelectedDevice(device)
                          setCurrentView("device-detail")
                        }}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                            device.status === "on" ? "bg-emerald-500" : "bg-gray-500"
                          }`}
                        >
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-white">{device.name}</h4>
                          <p className="text-sm text-purple-200">
                            {device.type} • {device.status === "on" ? "Online" : "Offline"}
                            {device.brightness !== undefined && ` • ${device.brightness}% brightness`}
                            {device.temperature !== undefined && ` • ${device.temperature}°C`}
                            {device.volume !== undefined && ` • Volume ${device.volume}%`}
                            {device.battery !== undefined && ` • Battery: ${device.battery}%`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFavorite(device.id)}
                          className={`h-8 w-8 ${
                            favouriteDevices.includes(device.id) ? "text-yellow-400" : "text-purple-200"
                          }`}
                        >
                          <Star
                            className="h-4 w-4"
                            fill={favouriteDevices.includes(device.id) ? "currentColor" : "none"}
                          />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeDevice(device.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => toggleDevice(device.id)}
                          className={`h-10 w-10 rounded-full ${
                            device.status === "on"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-emerald-500 hover:bg-emerald-600"
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Home className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Devices in {room.name}</h3>
              <p className="text-purple-200 mb-4">Add your first device to this room</p>
              <Button
                onClick={() => setShowAddDeviceDialog(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
