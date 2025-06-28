"use client"

import { useState } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Plus, Home, Thermometer, Droplets, Edit, Trash2, Users } from "lucide-react"
import type { View, Room, Device } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface RoomsViewProps {
  rooms: Room[]
  devices: Device[]
  addRoom: (roomData: Omit<Room, "id">) => void
  updateRoom: (roomId: string, updates: Partial<Room>) => void
  removeRoom: (roomId: string) => void
  setCurrentView: (view: View) => void
  setSelectedRoom: (room: Room | null) => void
  handleLogout: () => void
}

export function RoomsView({
  rooms,
  devices,
  addRoom,
  updateRoom,
  removeRoom,
  setCurrentView,
  setSelectedRoom,
  handleLogout,
}: RoomsViewProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [newRoom, setNewRoom] = useState({
    name: "",
    temperature: 22,
    humidity: 45,
  })

  const handleAddRoom = () => {
    if (newRoom.name.trim()) {
      addRoom({
        name: newRoom.name.trim(),
        temperature: newRoom.temperature,
        humidity: newRoom.humidity,
        deviceCount: 0,
      })
      setNewRoom({ name: "", temperature: 22, humidity: 45 })
      setShowAddDialog(false)
    }
  }

  const handleEditRoom = () => {
    if (editingRoom && newRoom.name.trim()) {
      updateRoom(editingRoom.id, {
        name: newRoom.name.trim(),
        temperature: newRoom.temperature,
        humidity: newRoom.humidity,
      })
      setEditingRoom(null)
      setNewRoom({ name: "", temperature: 22, humidity: 45 })
      setShowEditDialog(false)
    }
  }

  const openEditDialog = (room: Room) => {
    setEditingRoom(room)
    setNewRoom({
      name: room.name,
      temperature: room.temperature || 22,
      humidity: room.humidity || 45,
    })
    setShowEditDialog(true)
  }

  const getRoomDeviceCount = (roomName: string) => {
    return devices.filter((device) => device.room === roomName).length
  }

  const getRoomActiveDevices = (roomName: string) => {
    return devices.filter((device) => device.room === roomName && device.status === "on").length
  }

  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.2s ease",
    cursor: "pointer",
  }

  const buttonStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        paddingBottom: "80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setCurrentView("control")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "#a855f7",
              }}
            >
              <Home size={20} style={{ color: "white" }} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>Rooms</h1>
          </div>
        </div>
        <div style={{ fontSize: "16px", fontWeight: "500" }}>{getCurrentTime()}</div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px" }}>
        {/* Overview Card */}
        <div style={{ ...cardStyle, marginBottom: "24px", cursor: "default" }}>
          <div style={{ padding: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", textAlign: "center" }}>
              <div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{rooms.length}</div>
                <div style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Total Rooms</div>
              </div>
              <div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>{devices.length}</div>
                <div style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Total Devices</div>
              </div>
              <div>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: "white" }}>
                  {devices.filter((d) => d.status === "on").length}
                </div>
                <div style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Active Devices</div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Room Button */}
        <button
          onClick={() => setShowAddDialog(true)}
          style={{
            width: "100%",
            height: "56px",
            ...buttonStyle,
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            fontSize: "16px",
            fontWeight: "600",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
            e.currentTarget.style.transform = "translateY(0px)"
          }}
        >
          <Plus size={20} />
          Add New Room
        </button>

        {/* Rooms List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {rooms.length > 0 ? (
            rooms.map((room) => {
              const deviceCount = getRoomDeviceCount(room.name)
              const activeDevices = getRoomActiveDevices(room.name)

              return (
                <div
                  key={room.id}
                  style={cardStyle}
                  onClick={() => {
                    setSelectedRoom(room)
                    setCurrentView("room-detail")
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                    e.currentTarget.style.transform = "translateY(-4px)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)"
                    e.currentTarget.style.transform = "translateY(0px)"
                  }}
                >
                  <div style={{ padding: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: "#a855f7",
                          }}
                        >
                          <Home size={24} style={{ color: "white" }} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: "0 0 4px 0", color: "white" }}>
                            {room.name}
                          </h3>
                          <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", margin: "0" }}>
                            {activeDevices}/{deviceCount} devices active
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditDialog(room)
                          }}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeRoom(room.id)
                          }}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(239, 68, 68, 0.2)",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Room Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "4px",
                          }}
                        >
                          <Users size={16} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                        </div>
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>{deviceCount}</div>
                        <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>Devices</div>
                      </div>

                      {room.temperature && (
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "4px",
                            }}
                          >
                            <Thermometer size={16} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>
                            {room.temperature}°C
                          </div>
                          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>Temperature</div>
                        </div>
                      )}

                      {room.humidity && (
                        <div style={{ textAlign: "center" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: "4px",
                            }}
                          >
                            <Droplets size={16} style={{ color: "rgba(255, 255, 255, 0.7)" }} />
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: "bold", color: "white" }}>{room.humidity}%</div>
                          <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>Humidity</div>
                        </div>
                      )}
                    </div>

                    {/* Active Devices Indicator */}
                    {activeDevices > 0 && (
                      <div
                        style={{
                          marginTop: "16px",
                          paddingTop: "16px",
                          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#22c55e",
                              animation: "pulse 2s infinite",
                            }}
                          />
                          <span style={{ fontSize: "14px", color: "#22c55e" }}>
                            {activeDevices} device{activeDevices !== 1 ? "s" : ""} currently active
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{ textAlign: "center", padding: "48px 24px" }}>
              <Home size={64} style={{ color: "rgba(255, 255, 255, 0.3)", margin: "0 auto 16px auto" }} />
              <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0", color: "white" }}>
                No Rooms Yet
              </h3>
              <p style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", margin: "0 0 24px 0" }}>
                Create your first room to organize your smart home devices
              </p>
              <button
                onClick={() => setShowAddDialog(true)}
                style={{
                  ...buttonStyle,
                  padding: "12px 24px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                <Plus size={16} />
                Add Your First Room
              </button>
            </div>
          )}
        </div>

        {/* Add Room Dialog */}
        {showAddDialog && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowAddDialog(false)}
          >
            <div
              style={{
                backgroundColor: "#7c3aed",
                borderRadius: "12px",
                padding: "24px",
                width: "90%",
                maxWidth: "400px",
                border: "1px solid #6d28d9",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  color: "white",
                  margin: "0 0 16px 0",
                }}
              >
                Add New Room
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Room Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Living Room"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "16px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  min="10"
                  max="35"
                  value={newRoom.temperature}
                  onChange={(e) => setNewRoom({ ...newRoom, temperature: Number.parseInt(e.target.value) || 22 })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "16px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Humidity (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newRoom.humidity}
                  onChange={(e) => setNewRoom({ ...newRoom, humidity: Number.parseInt(e.target.value) || 45 })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "16px",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleAddRoom}
                  style={{
                    flex: 1,
                    height: "44px",
                    backgroundColor: "#22c55e",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Add Room
                </button>
                <button
                  onClick={() => setShowAddDialog(false)}
                  style={{
                    flex: 1,
                    height: "44px",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Room Dialog */}
        {showEditDialog && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowEditDialog(false)}
          >
            <div
              style={{
                backgroundColor: "#7c3aed",
                borderRadius: "12px",
                padding: "24px",
                width: "90%",
                maxWidth: "400px",
                border: "1px solid #6d28d9",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginBottom: "16px",
                  color: "white",
                  margin: "0 0 16px 0",
                }}
              >
                Edit Room
              </h3>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Room Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Living Room"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "16px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  min="10"
                  max="35"
                  value={newRoom.temperature}
                  onChange={(e) => setNewRoom({ ...newRoom, temperature: Number.parseInt(e.target.value) || 22 })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "16px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "rgba(255, 255, 255, 0.8)" }}
                >
                  Humidity (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newRoom.humidity}
                  onChange={(e) => setNewRoom({ ...newRoom, humidity: Number.parseInt(e.target.value) || 45 })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontSize: "16px",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleEditRoom}
                  style={{
                    flex: 1,
                    height: "44px",
                    backgroundColor: "#3b82f6",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Update Room
                </button>
                <button
                  onClick={() => setShowEditDialog(false)}
                  style={{
                    flex: 1,
                    height: "44px",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="control" setCurrentView={setCurrentView} handleLogout={handleLogout} />
    </div>
  )
}
