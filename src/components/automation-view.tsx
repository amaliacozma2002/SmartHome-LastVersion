"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Plus, Clock, Zap, Trash2 } from "lucide-react"
import type { View, Device, Automation } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface AutomationViewProps {
  devices: Device[]
  automations: Automation[]
  setAutomations?: (automations: Automation[]) => void
  addAutomation?: (automation: Automation) => void
  deleteAutomation?: (automationId: string) => void
  toggleAutomation?: (automationId: string) => void
  setCurrentView: (view: View) => void
  handleLogout: () => void
}

export function AutomationView({
  devices = [],
  automations = [],
  setAutomations,
  addAutomation,
  deleteAutomation,
  toggleAutomation,
  setCurrentView,
  handleLogout,
}: AutomationViewProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    trigger: "time",
    triggerValue: "",
    deviceId: "",
    action: "turn_on",
    enabled: true,
  })

  const handleCreateAutomation = () => {
    if (newAutomation.name && newAutomation.deviceId && newAutomation.triggerValue && addAutomation) {
      const automation: Automation = {
        id: Date.now().toString(),
        name: newAutomation.name,
        trigger: newAutomation.trigger as "time" | "temperature" | "motion",
        triggerValue: newAutomation.triggerValue,
        deviceId: newAutomation.deviceId,
        action: newAutomation.action as "turn_on" | "turn_off" | "set_brightness" | "set_temperature",
        enabled: newAutomation.enabled,
        createdAt: new Date().toISOString(),
      }

      addAutomation(automation)

      setNewAutomation({
        name: "",
        trigger: "time",
        triggerValue: "",
        deviceId: "",
        action: "turn_on",
        enabled: true,
      })
      setShowCreateForm(false)
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
            onClick={() => setCurrentView("dashboard")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Automation</h1>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Create Automation Button */}
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Automation
        </Button>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Create Automation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-purple-200">Automation Name</Label>
                <Input
                  value={newAutomation.name}
                  onChange={(e) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                  placeholder="e.g., Morning Lights"
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              <div>
                <Label className="text-purple-200">Trigger</Label>
                <Select
                  value={newAutomation.trigger}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, trigger: value })}
                >
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Time</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="motion">Motion Detected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-purple-200">
                  {newAutomation.trigger === "time"
                    ? "Time (HH:MM)"
                    : newAutomation.trigger === "temperature"
                      ? "Temperature (°C)"
                      : "Motion Sensor"}
                </Label>
                <Input
                  value={newAutomation.triggerValue}
                  onChange={(e) => setNewAutomation({ ...newAutomation, triggerValue: e.target.value })}
                  placeholder={
                    newAutomation.trigger === "time"
                      ? "07:00"
                      : newAutomation.trigger === "temperature"
                        ? "22"
                        : "Living Room"
                  }
                  className="bg-white/10 text-white border-white/20"
                />
              </div>

              <div>
                <Label className="text-purple-200">Device</Label>
                <Select
                  value={newAutomation.deviceId}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, deviceId: value })}
                >
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue placeholder="Select device" />
                  </SelectTrigger>
                  <SelectContent>
                    {(devices || []).map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-purple-200">Action</Label>
                <Select
                  value={newAutomation.action}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, action: value })}
                >
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="turn_on">Turn On</SelectItem>
                    <SelectItem value="turn_off">Turn Off</SelectItem>
                    <SelectItem value="set_brightness">Set Brightness</SelectItem>
                    <SelectItem value="set_temperature">Set Temperature</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateAutomation} className="flex-1">
                  Create Automation
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Automations List */}
        <div className="space-y-4">
          {(automations || []).map((automation) => {
            const device = (devices || []).find((d) => d.id === automation.deviceId)
            return (
              <Card key={automation.id} className="bg-white/15 backdrop-blur-md border-white/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          automation.enabled ? "bg-emerald-500" : "bg-gray-500"
                        }`}
                      >
                        {automation.trigger === "time" ? <Clock className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{automation.name}</h4>
                        <p className="text-sm text-purple-200">
                          {automation.trigger === "time"
                            ? `At ${automation.triggerValue}`
                            : automation.trigger === "temperature"
                              ? `When temp reaches ${automation.triggerValue}°C`
                              : `When motion detected in ${automation.triggerValue}`}
                          {" → "}
                          {automation.action.replace("_", " ")} {device?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={automation.enabled} onCheckedChange={() => toggleAutomation && toggleAutomation(automation.id)} />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteAutomation && deleteAutomation(automation.id)}
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

        {(automations || []).length === 0 && !showCreateForm && (
          <div className="text-center py-12">
            <Zap className="h-16 w-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Automations Yet</h3>
            <p className="text-purple-200">Create your first automation to make your home smarter!</p>
          </div>
        )}
      </div>

      <BottomNavigation activeTab="control" setCurrentView={setCurrentView} handleLogout={handleLogout} />
    </div>
  )
}
