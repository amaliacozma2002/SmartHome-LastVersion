"use client"

import { useState } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Mic, MicOff, Volume2, Settings } from "lucide-react"
import type { View, Device } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface VoiceControlViewProps {
  devices?: Device[]
  toggleDevice?: (deviceId: string) => void
  setCurrentView: (view: View) => void
  handleLogout: () => void
}

export function VoiceControlView({ 
  devices = [], 
  toggleDevice = () => {}, 
  setCurrentView, 
  handleLogout 
}: VoiceControlViewProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [lastCommand, setLastCommand] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])

  // Mock voice commands
  const voiceCommands = [
    "Turn on living room lights",
    "Set bedroom temperature to 22 degrees",
    "Turn off all lights",
    "Activate movie night scene",
    "Show security cameras",
    "Lock all doors",
    "Turn on kitchen lights",
    "Set thermostat to 20 degrees",
  ]

  const recentCommands = [
    { command: "Turn on living room lights", time: "2 minutes ago", status: "success" },
    { command: "Set temperature to 22°C", time: "5 minutes ago", status: "success" },
    { command: "Turn off bedroom lights", time: "10 minutes ago", status: "success" },
    { command: "Lock front door", time: "15 minutes ago", status: "failed" },
  ]

  const handleStartListening = () => {
    setIsListening(true)
    setTranscript("Listening...")

    // Simulate voice recognition
    setTimeout(() => {
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)]
      setTranscript(randomCommand)
      setLastCommand(randomCommand)
      setCommandHistory((prev) => [randomCommand, ...prev.slice(0, 4)])

      // Simulate command execution
      setTimeout(() => {
        setIsListening(false)
        setTranscript("")
      }, 2000)
    }, 2000)
  }

  const handleStopListening = () => {
    setIsListening(false)
    setTranscript("")
  }

  const executeVoiceCommand = (command: string) => {
    setLastCommand(command)
    setCommandHistory((prev) => [command, ...prev.slice(0, 4)])

    // Safety check: ensure devices array exists
    if (!devices || !Array.isArray(devices)) {
      console.warn("Devices array is not available")
      return
    }

    // Simple command parsing simulation
    if (command.toLowerCase().includes("turn on") && command.toLowerCase().includes("lights")) {
      const lightDevices = devices.filter((d) => d.type === "lighting" && d.status === "off")
      if (lightDevices.length > 0) {
        toggleDevice(lightDevices[0].id)
      }
    } else if (command.toLowerCase().includes("turn off") && command.toLowerCase().includes("lights")) {
      const lightDevices = devices.filter((d) => d.type === "lighting" && d.status === "on")
      if (lightDevices.length > 0) {
        toggleDevice(lightDevices[0].id)
      }
    }
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
            onClick={() => setCurrentView("dashboard")}
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
                backgroundColor: "#3b82f6",
              }}
            >
              <Mic size={20} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>Voice Control</h1>
          </div>
        </div>
        <div style={{ fontSize: "16px", fontWeight: "500" }}>{getCurrentTime()}</div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Voice Control Interface */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "32px",
            textAlign: "center",
          }}
        >
          {/* Microphone Button */}
          <div style={{ marginBottom: "24px" }}>
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: isListening ? "#ef4444" : "#3b82f6",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                transition: "all 0.3s ease",
                boxShadow: isListening ? "0 0 30px rgba(239, 68, 68, 0.5)" : "0 0 20px rgba(59, 130, 246, 0.3)",
                animation: isListening ? "pulse 1.5s infinite" : "none",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              {isListening ? <MicOff size={48} /> : <Mic size={48} />}
            </button>
          </div>

          {/* Status */}
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0" }}>
              {isListening ? "Listening..." : "Tap to speak"}
            </h3>
            <p style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)", margin: "0" }}>
              {isListening ? "Say your command now" : 'Say "Hey Smart Home" or tap the microphone'}
            </p>
          </div>

          {/* Transcript */}
          {transcript && (
            <div
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "16px",
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: "500", margin: "0" }}>"{transcript}"</p>
            </div>
          )}

          {/* Last Command */}
          {lastCommand && !isListening && (
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.2)",
                borderRadius: "8px",
                padding: "16px",
                marginTop: "16px",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <p style={{ fontSize: "14px", color: "#86efac", margin: "0 0 4px 0" }}>Last Command Executed:</p>
              <p style={{ fontSize: "16px", fontWeight: "500", margin: "0" }}>"{lastCommand}"</p>
            </div>
          )}
        </div>

        {/* Quick Commands */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
            Quick Commands
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {voiceCommands.slice(0, 6).map((command, index) => (
              <button
                key={index}
                onClick={() => executeVoiceCommand(command)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "16px",
                  color: "white",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Volume2 size={16} style={{ color: "#3b82f6" }} />
                  <span>"{command}"</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Commands */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
            Recent Commands
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {commandHistory.length > 0
              ? commandHistory.map((command, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>"{command}"</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>Just now</span>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#34d399",
                        }}
                      />
                    </div>
                  </div>
                ))
              : recentCommands.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>"{item.command}"</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>{item.time}</span>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: item.status === "success" ? "#34d399" : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Voice Settings */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "20px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
            Voice Settings
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px" }}>Wake Word</span>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>"Hey Smart Home"</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px" }}>Language</span>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>English (US)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px" }}>Voice Feedback</span>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Enabled</span>
            </div>
          </div>
          <button
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
            }}
          >
            <Settings size={16} />
            Voice Settings
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="control" setCurrentView={setCurrentView} handleLogout={handleLogout} />

      {/* Add pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.7);
          }
          100% {
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
          }
        }
      `}</style>
    </div>
  )
}
