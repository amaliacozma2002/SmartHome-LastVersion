"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Search, Power, Star, Loader2, AlertCircle } from "lucide-react";
import { devicesAPI } from "@/api";
import { getDeviceIcon } from "@/lib/device-icons";
import type { View } from "@/types";

interface ControlViewProps {
  setCurrentView: (view: View) => void;
  setSelectedDevice: (device: any) => void;
  handleLogout: () => void;
}

export function ControlView({
  setCurrentView,
  setSelectedDevice,
  handleLogout,
}: ControlViewProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("All");
  const [deviceToggleLoading, setDeviceToggleLoading] = useState<string>("");

  // Load devices on component mount
  // API Call: GET /api/devices
  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setIsLoading(true);
      setError("");

      console.log("📡 Loading devices from API...");

      // API Call: GET /api/devices
      // Fetches all smart devices from backend
      const devicesData = await devicesAPI.getDevices();

      console.log("📡 Devices loaded successfully:", {
        count: devicesData?.length || 0,
        devices:
          devicesData?.map((d: any) => ({
            id: d._id,
            idType: typeof d._id,
            name: d.name,
            isOn: d.isOn,
            status: d.status,
            room: d.room,
            type: d.type,
          })) || [],
      });

      setDevices(devicesData);
    } catch (error) {
      console.error("📡 Failed to load devices:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load devices"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced toggle device function with better error handling
  const handleToggleDevice = async (deviceId: string) => {
    try {
      console.log("🔄 Toggle device called:", {
        deviceId,
        deviceIdType: typeof deviceId,
      });

      // Find the device being toggled for debugging
      const deviceToToggle = devices.find((d) => d._id === deviceId);
      console.log("🔄 Device to toggle:", {
        found: !!deviceToToggle,
        device: deviceToToggle
          ? {
              id: deviceToToggle._id,
              name: deviceToToggle.name,
              currentState: deviceToToggle.isOn,
              status: deviceToToggle.status,
            }
          : null,
      });

      if (!deviceToToggle) {
        throw new Error(`Device with ID ${deviceId} not found in local state`);
      }

      setDeviceToggleLoading(deviceId);

      // Check authentication before making the call
      const authToken = localStorage.getItem("authToken");
      console.log("🔄 Auth token present:", !!authToken);

      // API Call: POST /api/devices/:id/toggle
      console.log("🔄 Calling devicesAPI.toggleDevice with ID:", deviceId);
      console.log(
        "🔄 API Base URL:",
        process.env.REACT_APP_API_URL || "http://localhost:5000"
      );

      let updatedDevice;
      try {
        updatedDevice = await devicesAPI.toggleDevice(deviceId);
      } catch (apiError) {
        console.error("🔄 API call failed:", apiError);

        // Fallback: Optimistic update if API fails
        console.log("🔄 Attempting optimistic update as fallback...");
        updatedDevice = {
          ...deviceToToggle,
          isOn: !deviceToToggle.isOn,
          status: !deviceToToggle.isOn ? "on" : "off",
        };

        setError(
          `API call failed, applied optimistic update. Error: ${
            apiError instanceof Error ? apiError.message : "Unknown error"
          }`
        );
        setTimeout(() => setError(""), 5000);
      }

      console.log("🔄 Update result:", {
        success: !!updatedDevice,
        updatedDevice: updatedDevice
          ? {
              id: updatedDevice._id,
              name: updatedDevice.name,
              newState: updatedDevice.isOn,
              status: updatedDevice.status,
            }
          : null,
      });

      // Validate response
      if (!updatedDevice || (!updatedDevice._id && !updatedDevice.id)) {
        throw new Error(`Invalid response: ${JSON.stringify(updatedDevice)}`);
      }

      // Ensure the ID matches for state update
      const responseId = updatedDevice._id || updatedDevice.id;
      if (responseId !== deviceId) {
        console.warn("🔄 Response ID mismatch:", {
          expected: deviceId,
          received: responseId,
        });
      }

      // Update the device in local state with server response
      setDevices((prevDevices) => {
        const updated = prevDevices.map((device) => {
          if (device._id === deviceId) {
            console.log("🔄 Updating device in state:", {
              oldState: device.isOn,
              newState: updatedDevice.isOn,
              deviceName: device.name,
            });
            return { ...device, ...updatedDevice, _id: device._id }; // Preserve original ID
          }
          return device;
        });

        // Verify the update worked
        const updatedInState = updated.find((d) => d._id === deviceId);
        console.log("🔄 State update result:", {
          deviceFound: !!updatedInState,
          finalState: updatedInState?.isOn,
          expectedState: updatedDevice.isOn,
          stateMatches: updatedInState?.isOn === updatedDevice.isOn,
        });

        return updated;
      });

      console.log("🔄 Device toggle completed successfully");
    } catch (error) {
      console.error("🔄 Toggle device error:", error);
      console.error("🔄 Error details:", {
        deviceId,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        errorStack: error instanceof Error ? error.stack : undefined,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
      });

      setError(
        `Failed to toggle device: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Clear error after 5 seconds
      setTimeout(() => setError(""), 5000);
    } finally {
      setDeviceToggleLoading("");
      console.log("🔄 Toggle operation completed (loading state cleared)");
    }
  };

  // Filter devices based on search term and selected room
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = selectedRoom === "All" || device.room === selectedRoom;
    return matchesSearch && matchesRoom;
  });

  // Get unique rooms for filter
  const rooms = [
    "All",
    ...Array.from(new Set(devices.map((device) => device.room))),
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 pb-20 text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/10 p-4 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold">Device Control</h1>
          <p className="text-purple-200">Manage all your smart devices</p>
        </div>
        <div className="text-base font-medium">{devices.length} devices</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search and Filter */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardContent className="p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-300" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
              />
            </div>

            {/* Room Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {rooms.map((room) => (
                <Button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  variant={selectedRoom === room ? "default" : "outline"}
                  size="sm"
                  className={`whitespace-nowrap ${
                    selectedRoom === room
                      ? "bg-white text-purple-700"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  {room}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Debug Section - Remove after fixing */}
        {/* <Card className="bg-yellow-500/20 backdrop-blur-md border-yellow-500/30">
          <CardContent className="p-4 space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <Button
                onClick={() => {
                  console.log("🔍 DEBUG - Control View State:");
                  console.log("🔍 Devices:", devices);
                  console.log("🔍 DevicesAPI:", devicesAPI);
                  console.log("🔍 Device toggle loading:", deviceToggleLoading);
                  console.log("🔍 Current error:", error);
                  console.log("🔍 Filtered devices:", filteredDevices);
                  console.log(
                    "🔍 Auth token:",
                    !!localStorage.getItem("authToken")
                  );
                  console.log(
                    "🔍 API Base URL:",
                    process.env.REACT_APP_API_URL || "http://localhost:5000"
                  );

                  // Test if we can access devicesAPI methods
                  console.log(
                    "🔍 Available API methods:",
                    Object.keys(devicesAPI)
                  );
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
              >
                🔍 Debug - Check Console & API
              </Button>

              <Button
                onClick={async () => {
                  console.log("🧪 Testing API connectivity...");
                  try {
                    const devices = await devicesAPI.getDevices();
                    console.log(
                      "🧪 API connectivity test successful:",
                      devices
                    );
                    alert(`API working! Found ${devices?.length || 0} devices`);
                  } catch (error) {
                    console.error("🧪 API connectivity test failed:", error);
                    alert(
                      `API test failed: ${
                        error instanceof Error ? error.message : "Unknown error"
                      }`
                    );
                  }
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              >
                🧪 Test API Connection
              </Button>

              <Button
                onClick={async () => {
                  console.log("🔄 Manual device reload requested...");
                  await loadDevices();
                  console.log("🔄 Device reload completed");
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                🔄 Reload Devices
              </Button>
            </div>
          </CardContent>
        </Card> */}

        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/20 backdrop-blur-md border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-200">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Devices List - Real data from API */}
        <div className="space-y-3">
          {filteredDevices.length === 0 ? (
            <Card className="bg-white/15 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <p className="text-purple-200">
                  No devices found matching your criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDevices.map((device) => (
              <Card
                key={device._id}
                className="bg-white/15 backdrop-blur-md border-white/20"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => {
                        setSelectedDevice(device);
                        setCurrentView("device-detail");
                      }}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          device.isOn ? "bg-emerald-500" : "bg-gray-500"
                        }`}
                      >
                        {getDeviceIcon(device.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {device.name}
                        </h3>
                        <p className="text-sm text-purple-200">
                          {device.room} • {device.type} • {device.status}
                        </p>
                        {/* Show device-specific info */}
                        {device.temperature && (
                          <p className="text-xs text-purple-300">
                            Temperature: {device.temperature}°C
                          </p>
                        )}
                        {device.brightness && (
                          <p className="text-xs text-purple-300">
                            Brightness: {device.brightness}%
                          </p>
                        )}
                        {device.volume && (
                          <p className="text-xs text-purple-300">
                            Volume: {device.volume}%
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Favorite indicator */}
                      {device.isFavorite && (
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      )}

                      {/* Toggle Button */}
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleDevice(device._id);
                        }}
                        disabled={deviceToggleLoading === device._id}
                        className={`h-10 w-10 rounded-full ${
                          device.isOn
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                      >
                        {deviceToggleLoading === device._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-white">
                  {devices.length}
                </div>
                <div className="text-xs text-purple-200">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-400">
                  {devices.filter((d) => d.isOn).length}
                </div>
                <div className="text-xs text-purple-200">Active</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-400">
                  {devices.filter((d) => !d.isOn).length}
                </div>
                <div className="text-xs text-purple-200">Inactive</div>
              </div>
            </div>
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
  );
}
