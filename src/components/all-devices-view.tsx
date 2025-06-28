"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Power, Search, Filter, Plus } from "lucide-react"
import type { View, Device, Category } from "@/types"
import { getCurrentTime } from "@/lib/utils"
import { getDeviceIcon } from "@/lib/device-icons"

interface AllDevicesViewProps {
  devices: Device[]
  categories: Category[]
  toggleDevice: (deviceId: string) => void
  setCurrentView: (view: View) => void
  setSelectedDevice: (device: Device | null) => void
  handleLogout: () => void
}

export function AllDevicesView({
  devices = [],
  categories = [],
  toggleDevice,
  setCurrentView,
  setSelectedDevice,
  handleLogout,
}: AllDevicesViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const filteredDevices = (devices || []).filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.room.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || device.category === filterCategory
    const matchesStatus = filterStatus === "all" || device.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

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
          <h1 className="text-xl font-bold">All Devices ({(devices || []).length})</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView("add-device")}
            className="text-white hover:bg-white/10 bg-emerald-500/20 border border-emerald-500/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
          <div className="text-base font-medium">{getCurrentTime()}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
          <Input
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/15 border-white/20 text-white placeholder:text-purple-300"
          />
        </div>

        <div className="flex gap-3">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="flex-1 bg-white/15 border-white/20 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="flex-1 bg-white/15 border-white/20 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on">Online</SelectItem>
              <SelectItem value="off">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="text-center text-purple-200">
          Showing {filteredDevices.length} of {(devices || []).length} devices
        </div>

        {/* Devices List */}
        <div className="space-y-3">
          {filteredDevices.map((device) => (
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
                        {device.room} • {device.type} • {device.status === "on" ? "Online" : "Offline"}
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
                      onClick={() => toggleDevice(device.id)}
                      className={`h-10 w-10 rounded-full ${
                        device.status === "on" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
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

        {filteredDevices.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Devices Found</h3>
            <p className="text-purple-200">Try adjusting your search or filter criteria</p>
          </div>
        )}
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
