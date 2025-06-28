"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Clock, Filter, Trash2, Download, Calendar, Search } from "lucide-react"
import type { View, HistoryEntry } from "@/types"
import { getCurrentTime } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface HistoryViewProps {
  history: HistoryEntry[]
  clearHistory?: () => void
  setCurrentView: (view: View) => void
  handleLogout: () => void
}

export function HistoryView({ history = [], clearHistory, setCurrentView, handleLogout }: HistoryViewProps) {
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")

  // Filter history entries based on selected filters and search query
  const filteredHistory = (history || []).filter((entry) => {
    // Filter by type
    if (filter !== "all" && entry.itemType !== filter) {
      return false
    }

    // Filter by date
    if (dateFilter !== "all") {
      const entryDate = new Date(entry.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (dateFilter === "today") {
        if (entryDate.toDateString() !== today.toDateString()) {
          return false
        }
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        if (entryDate < weekAgo) {
          return false
        }
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        if (entryDate < monthAgo) {
          return false
        }
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        entry.itemName.toLowerCase().includes(query) ||
        entry.details.toLowerCase().includes(query) ||
        entry.userName.toLowerCase().includes(query) ||
        getActionLabel(entry.action).toLowerCase().includes(query)
      )
    }

    return true
  })

  // Sort history entries by timestamp (newest first)
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }

    // Otherwise, show full date
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Helper function to get action label
  const getActionLabel = (action: string) => {
    switch (action) {
      case "device_added":
        return "Device Added"
      case "device_removed":
        return "Device Removed"
      case "device_toggled":
        return "Device Toggled"
      case "device_updated":
        return "Device Updated"
      case "room_added":
        return "Room Added"
      case "room_removed":
        return "Room Removed"
      case "room_updated":
        return "Room Updated"
      case "scene_activated":
        return "Scene Activated"
      case "automation_triggered":
        return "Automation Triggered"
      case "user_login":
        return "User Login"
      case "user_logout":
        return "User Logout"
      case "settings_changed":
        return "Settings Changed"
      default:
        return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }
  }

  // Helper function to get badge color based on action
  const getActionColor = (action: string) => {
    if (action.includes("added") || action.includes("login")) return "bg-green-500"
    if (action.includes("removed") || action.includes("logout")) return "bg-red-500"
    if (action.includes("toggled") || action.includes("updated")) return "bg-blue-500"
    if (action.includes("activated") || action.includes("triggered")) return "bg-purple-500"
    return "bg-gray-500"
  }

  // Helper function to get icon based on item type
  const getItemTypeIcon = (itemType: string) => {
    switch (itemType) {
      case "device":
        return "📱"
      case "room":
        return "🏠"
      case "scene":
        return "🎬"
      case "automation":
        return "⚙️"
      case "user":
        return "👤"
      case "system":
        return "🖥️"
      default:
        return "📄"
    }
  }

  // Function to export history as JSON
  const exportHistory = () => {
    const dataStr = JSON.stringify(history || [], null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `smart-home-history-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  // Group history entries by date
  const groupedHistory: Record<string, HistoryEntry[]> = {}
  sortedHistory.forEach((entry) => {
    const date = new Date(entry.timestamp).toDateString()
    if (!groupedHistory[date]) {
      groupedHistory[date] = []
    }
    groupedHistory[date].push(entry)
  })

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 pb-20 text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/10 p-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("settings")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Activity History</h1>
          </div>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Filters and Search */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-purple-200" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-purple-200 mb-1 block">Filter by Type</label>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="device">Devices</SelectItem>
                    <SelectItem value="room">Rooms</SelectItem>
                    <SelectItem value="scene">Scenes</SelectItem>
                    <SelectItem value="automation">Automations</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs text-purple-200 mb-1 block">Filter by Date</label>
                <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as any)}>
                  <SelectTrigger className="bg-white/10 text-white border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={() => {
                  setFilter("all")
                  setDateFilter("all")
                  setSearchQuery("")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>

              <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear History
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-purple-900 border-purple-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Clear History</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-purple-200">
                      Are you sure you want to clear all history? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (clearHistory) {
                            clearHistory()
                          }
                          setShowClearDialog(false)
                        }}
                        className="flex-1"
                      >
                        Yes, Clear History
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowClearDialog(false)}
                        className="flex-1 border-white/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={exportHistory}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        {Object.keys(groupedHistory).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedHistory).map(([date, entries]) => (
              <div key={date} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-200" />
                  <h3 className="text-sm font-medium text-purple-200">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                {entries.map((entry) => (
                  <Card key={entry.id} className="bg-white/15 backdrop-blur-md border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getItemTypeIcon(entry.itemType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <Badge className={`${getActionColor(entry.action)} text-white`}>
                              {getActionLabel(entry.action)}
                            </Badge>
                            <span className="text-xs text-purple-200">{formatTimestamp(entry.timestamp)}</span>
                          </div>
                          <h4 className="text-base font-semibold text-white">{entry.itemName}</h4>
                          <p className="text-sm text-purple-200">{entry.details}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-purple-300">By {entry.userName}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No History Found</h3>
            <p className="text-purple-200">
              {searchQuery || filter !== "all" || dateFilter !== "all"
                ? "No activities match your current filters. Try adjusting your search or filters."
                : "Your activity history will appear here as you use the app."}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="settings" setCurrentView={setCurrentView} handleLogout={handleLogout} />
    </div>
  )
}
