"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Plus, Play, Edit, Trash2, Home, Moon, Sun, Coffee, Check } from "lucide-react"
import type { View, Device, Scene } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface ScenesViewProps {
  devices: Device[]
  scenes: Scene[]
  setScenes?: (scenes: Scene[]) => void
  addScene?: (scene: Scene) => void
  deleteScene?: (sceneId: string) => void
  executeScene?: (sceneId: string) => void
  setCurrentView: (view: View) => void
  handleLogout: () => void
}

export function ScenesView({
  devices = [],
  scenes = [],
  setScenes,
  addScene,
  deleteScene,
  executeScene,
  setCurrentView,
  handleLogout,
}: ScenesViewProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activatedScenes, setActivatedScenes] = useState<Set<string>>(new Set())
  const [lastActivatedDevices, setLastActivatedDevices] = useState<Record<string, string[]>>({})
  const [newScene, setNewScene] = useState({
    name: "",
    icon: "home",
    selectedDevices: [] as string[],
  })

  const sceneIcons = [
    { id: "home", icon: Home, label: "Home" },
    { id: "moon", icon: Moon, label: "Night" },
    { id: "sun", icon: Sun, label: "Morning" },
    { id: "coffee", icon: Coffee, label: "Work" },
  ]

  const predefinedScenes = [
    {
      id: "good-morning",
      name: "Good Morning",
      icon: "sun",
      description: "Turn on lights, start coffee maker, set comfortable temperature",
      deviceIds: ["4", "9", "15"], // Main Lights, Kitchen Lights, Office Lights
    },
    {
      id: "movie-night",
      name: "Movie Night",
      icon: "home",
      description: "Dim lights, turn on TV and sound system",
      deviceIds: ["4", "12", "5"], // Main Lights, Smart TV, Sound System
    },
    {
      id: "bedtime",
      name: "Bedtime",
      icon: "moon",
      description: "Turn off all lights, lock doors, set night temperature",
      deviceIds: ["4", "6", "9", "15", "1", "3"], // All lights, Access Control, Thermostat
    },
    {
      id: "away-mode",
      name: "Away Mode",
      icon: "home",
      description: "Turn off non-essential devices, activate security",
      deviceIds: ["2", "11", "1"], // Security System, Security Camera, Access Control
    },
  ]

  const handleCreateScene = () => {
    if (newScene.name && newScene.selectedDevices.length > 0 && addScene) {
      const scene: Scene = {
        id: Date.now().toString(),
        name: newScene.name,
        icon: newScene.icon,
        devices: newScene.selectedDevices.map((deviceId) => ({
          deviceId,
          action: "turn_on",
        })),
        createdAt: new Date().toISOString(),
      }

      addScene(scene)

      setNewScene({ name: "", icon: "home", selectedDevices: [] })
      setShowCreateDialog(false)
    }
  }

  const handleActivatePredefinedScene = (sceneId: string, deviceIds: string[]) => {
    // Mark scene as activated
    setActivatedScenes((prev) => new Set([...Array.from(prev), sceneId]))

    // Track which devices were affected
    const affectedDevices = deviceIds
      .map((id) => {
        const device = (devices || []).find((d) => d.id === id)
        return device ? device.name : ""
      })
      .filter(Boolean)

    setLastActivatedDevices((prev) => ({
      ...prev,
      [sceneId]: affectedDevices,
    }))

    // Execute the scene (simulate device changes)
    if (executeScene) {
      deviceIds.forEach((deviceId) => {
        executeScene(deviceId)
      })
    }

    // Reset activation status after 3 seconds
    setTimeout(() => {
      setActivatedScenes((prev) => {
        const newSet = new Set(prev)
        newSet.delete(sceneId)
        return newSet
      })
    }, 3000)
  }

  const getSceneIcon = (iconId: string) => {
    const iconData = sceneIcons.find((icon) => icon.id === iconId)
    return iconData ? iconData.icon : Home
  }

  const getDeviceDescription = (sceneId: string) => {
    const scene = predefinedScenes.find((s) => s.id === sceneId)
    if (!scene) return ""

    if (activatedScenes.has(sceneId) && lastActivatedDevices[sceneId]) {
      return `Activated: ${lastActivatedDevices[sceneId].join(", ")}`
    }

    return scene.description
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
          <h1 className="text-xl font-bold">Scenes</h1>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Create Scene Button */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20">
              <Plus className="h-5 w-5 mr-2" />
              Create New Scene
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-purple-900 border-purple-700 text-white max-w-md">
            <DialogHeader>
              <DialogTitle>Create Scene</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-purple-200">Scene Name</Label>
                <Input
                  value={newScene.name}
                  onChange={(e) => setNewScene({ ...newScene, name: e.target.value })}
                  placeholder="e.g., Movie Night"
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              <div>
                <Label className="text-purple-200">Icon</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {sceneIcons.map((iconData) => {
                    const IconComponent = iconData.icon
                    return (
                      <Button
                        key={iconData.id}
                        variant={newScene.icon === iconData.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewScene({ ...newScene, icon: iconData.id })}
                        className="h-12 flex flex-col gap-1"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-xs">{iconData.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label className="text-purple-200">Select Devices</Label>
                <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                  {(devices || []).map((device) => (
                    <div key={device.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={device.id}
                        checked={newScene.selectedDevices.includes(device.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewScene({
                              ...newScene,
                              selectedDevices: [...newScene.selectedDevices, device.id],
                            })
                          } else {
                            setNewScene({
                              ...newScene,
                              selectedDevices: newScene.selectedDevices.filter((id) => id !== device.id),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={device.id} className="text-sm text-white">
                        {device.name} ({device.room})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateScene} className="flex-1">
                  Create Scene
                </Button>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Predefined Scenes */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Scenes</h3>
          <div className="grid grid-cols-2 gap-4">
            {predefinedScenes.map((scene) => {
              const IconComponent = getSceneIcon(scene.icon)
              const isActivated = activatedScenes.has(scene.id)

              return (
                <Card key={scene.id} className="bg-white/15 backdrop-blur-md border-white/20">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl mx-auto mb-3 ${
                        isActivated ? "bg-green-500" : "bg-purple-500"
                      }`}
                    >
                      {isActivated ? (
                        <Check className="h-6 w-6 text-white" />
                      ) : (
                        <IconComponent className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <h4 className="font-semibold text-white mb-2">{scene.name}</h4>
                    <p className="text-xs text-purple-200 mb-3 min-h-[2.5rem]">{getDeviceDescription(scene.id)}</p>
                    <Button
                      size="sm"
                      className={`w-full ${
                        isActivated ? "bg-green-500 hover:bg-green-600" : "bg-white hover:bg-gray-100 text-purple-700"
                      }`}
                      onClick={() => handleActivatePredefinedScene(scene.id, scene.deviceIds)}
                      disabled={isActivated}
                    >
                      {isActivated ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Activated
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Activate
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Custom Scenes */}
        {(scenes || []).length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">My Scenes</h3>
            <div className="space-y-3">
              {(scenes || []).map((scene) => {
                const IconComponent = getSceneIcon(scene.icon)
                return (
                  <Card key={scene.id} className="bg-white/15 backdrop-blur-md border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500">
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{scene.name}</h4>
                            <p className="text-sm text-purple-200">{scene.devices.length} devices</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            onClick={() => executeScene && executeScene(scene.id)}
                            className="h-8 w-8 bg-green-500 hover:bg-green-600"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-purple-200">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteScene && deleteScene(scene.id)}
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNavigation activeTab="control" setCurrentView={setCurrentView} handleLogout={handleLogout} />
    </div>
  )
}
