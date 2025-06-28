"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Plus, Lightbulb, Shield, Thermometer, Camera, Speaker, Tv, Lock, Home, Zap } from "lucide-react"
import type { View, Device, Room } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface AddDeviceViewProps {
  rooms: Room[]
  setCurrentView: (view: View) => void
  onDeviceAdd: (device: Omit<Device, "id">) => Promise<void>
}

interface DeviceFormData {
  name: string
  type: Device["type"]
  room: string
  category: string
  status: "on" | "off"
  brightness?: number
  volume?: number
  temperature?: number
  battery?: number
  energyUsage?: number
  description?: string
}

const deviceTypes = [
  { value: "lighting", label: "Lighting", icon: Lightbulb, category: "lighting" },
  { value: "security", label: "Security", icon: Shield, category: "security" },
  { value: "climate", label: "Climate Control", icon: Thermometer, category: "heating" },
  { value: "camera", label: "Camera", icon: Camera, category: "security" },
  { value: "speaker", label: "Speaker", icon: Speaker, category: "multimedia" },
  { value: "tv", label: "Smart TV", icon: Tv, category: "multimedia" },
  { value: "access", label: "Access Control", icon: Lock, category: "security" },
  { value: "automation", label: "Automation", icon: Home, category: "automation" },
  { value: "system", label: "System", icon: Zap, category: "system" },
]

export function AddDeviceView({ rooms, setCurrentView, onDeviceAdd }: AddDeviceViewProps) {
  const [formData, setFormData] = useState<DeviceFormData>({
    name: "",
    type: "lighting",
    room: "",
    category: "lighting",
    status: "off",
    brightness: 50,
    volume: 30,
    temperature: 22,
    battery: 100,
    energyUsage: 10,
    description: "",
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Device name is required"
    }
    
    if (!formData.room) {
      newErrors.room = "Room selection is required"
    }
    
    if (formData.name.length < 2) {
      newErrors.name = "Device name must be at least 2 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      const deviceData: Omit<Device, "id"> = {
        name: formData.name.trim(),
        type: formData.type,
        room: formData.room,
        category: formData.category,
        status: formData.status,
        lastUpdated: new Date().toISOString(),
        ...(formData.type === "lighting" && { brightness: formData.brightness }),
        ...(["speaker", "tv"].includes(formData.type) && { volume: formData.volume }),
        ...(formData.type === "climate" && { temperature: formData.temperature }),
        ...(formData.battery !== undefined && { battery: formData.battery }),
        ...(formData.energyUsage !== undefined && { energyUsage: formData.energyUsage }),
      }

      await onDeviceAdd(deviceData)
      setCurrentView("all-devices")
    } catch (error) {
      console.error("Failed to add device:", error)
      setErrors({ submit: "Failed to add device. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof DeviceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleTypeChange = (type: Device["type"]) => {
    const selectedType = deviceTypes.find(dt => dt.value === type)
    handleInputChange("type", type)
    handleInputChange("category", selectedType?.category || "lighting")
  }

  const selectedDeviceType = deviceTypes.find(dt => dt.value === formData.type)
  const Icon = selectedDeviceType?.icon || Lightbulb

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 pb-20 text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/10 p-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("all-devices")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Add New Device</h1>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Device Preview Card */}
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  formData.status === "on" ? "bg-emerald-500" : "bg-gray-500"
                }`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                {formData.name || "New Device"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-200">
                {formData.room || "No room selected"} • {selectedDeviceType?.label} • {formData.status}
              </p>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Device Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter device name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="type" className="text-white">Device Type</Label>
                <Select value={formData.type} onValueChange={handleTypeChange}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="room" className="text-white">Room</Label>
                <Select value={formData.room} onValueChange={(value) => handleInputChange("room", value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.name}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.room && <p className="text-red-400 text-sm mt-1">{errors.room}</p>}
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter device description"
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Device Settings */}
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Device Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="status" className="text-white">Initial Status</Label>
                <div className="flex items-center gap-2">
                  <span className="text-purple-200">Off</span>
                  <Switch
                    id="status"
                    checked={formData.status === "on"}
                    onCheckedChange={(checked) => handleInputChange("status", checked ? "on" : "off")}
                  />
                  <span className="text-purple-200">On</span>
                </div>
              </div>

              {/* Conditional settings based on device type */}
              {formData.type === "lighting" && (
                <div>
                  <Label className="text-white">Brightness: {formData.brightness}%</Label>
                  <Slider
                    value={[formData.brightness || 50]}
                    onValueChange={(value) => handleInputChange("brightness", value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              )}

              {["speaker", "tv"].includes(formData.type) && (
                <div>
                  <Label className="text-white">Volume: {formData.volume}%</Label>
                  <Slider
                    value={[formData.volume || 30]}
                    onValueChange={(value) => handleInputChange("volume", value[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>
              )}

              {formData.type === "climate" && (
                <div>
                  <Label className="text-white">Temperature: {formData.temperature}°C</Label>
                  <Slider
                    value={[formData.temperature || 22]}
                    onValueChange={(value) => handleInputChange("temperature", value[0])}
                    max={30}
                    min={10}
                    step={1}
                    className="mt-2"
                  />
                </div>
              )}

              <div>
                <Label className="text-white">Battery Level: {formData.battery}%</Label>
                <Slider
                  value={[formData.battery || 100]}
                  onValueChange={(value) => handleInputChange("battery", value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-white">Energy Usage: {formData.energyUsage}W</Label>
                <Slider
                  value={[formData.energyUsage || 10]}
                  onValueChange={(value) => handleInputChange("energyUsage", value[0])}
                  max={500}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {errors.submit && (
            <Card className="bg-red-500/20 backdrop-blur-md border-red-500/20">
              <CardContent className="p-4">
                <p className="text-red-200">{errors.submit}</p>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentView("all-devices")}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
