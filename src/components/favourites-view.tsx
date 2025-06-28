"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Power, Star, Heart } from "lucide-react"
import type { View, Device } from "@/types"
import { getCurrentTime, getDeviceIcon } from "@/lib/utils"

interface FavouritesViewProps {
  devices: Device[]
  favouriteDevices: string[]
  toggleDevice: (deviceId: string) => void
  toggleFavorite: (deviceId: string) => void
  setCurrentView: (view: View) => void
  setSelectedDevice: (device: Device | null) => void
  handleLogout: () => void
}

export function FavouritesView({
  devices = [],
  favouriteDevices = [],
  toggleDevice,
  toggleFavorite,
  setCurrentView,
  setSelectedDevice,
  handleLogout,
}: FavouritesViewProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  const favoriteDevicesList = (devices || []).filter((device) => 
    (favouriteDevices || []).includes(device.id)
  )

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Favourites ({favoriteDevicesList.length})</h1>
          </div>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      {/* Content */}
      <div className="p-6">
        {favoriteDevicesList.length > 0 ? (
          <div className="space-y-4">
            {favoriteDevicesList.map((device) => (
              <Card
                key={device.id}
                className="bg-white/15 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-200"
              >
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
                          {device.room} • {device.status === "on" ? "Online" : "Offline"}
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
                        className="h-10 w-10 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/20"
                      >
                        <Star className="h-5 w-5" fill="currentColor" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => toggleDevice(device.id)}
                        className={`h-12 w-12 rounded-full ${
                          device.status === "on" ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                      >
                        <Power className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/20 mx-auto mb-6">
              <Heart className="h-10 w-10 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Favourite Devices</h3>
            <p className="text-purple-200 mb-6">
              Add devices to your favourites by tapping the star icon on any device for quick access.
            </p>
            <Button
              onClick={() => setCurrentView("dashboard")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              Browse Devices
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab="favourites"
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
    </div>
  )
}
