"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { BottomNavigation } from "@/components/bottom-navigation";
import {
  ArrowLeft,
  Thermometer,
  Snowflake,
  Flame,
  Wind,
  Plus,
  Minus,
  Home,
} from "lucide-react";
import type { View, Room, Device } from "@/types";
import { getCurrentTime } from "@/lib/utils";

interface HeatingCoolingViewProps {
  rooms: Room[];
  devices: Device[];
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  updateDeviceProperty: (
    deviceId: string,
    property: string,
    value: number
  ) => void;
  setCurrentView: (view: View) => void;
  handleLogout: () => void;
}

export function HeatingCoolingView({
  rooms = [],
  devices = [],
  updateRoom,
  updateDeviceProperty,
  setCurrentView,
  handleLogout,
}: HeatingCoolingViewProps) {
  const [globalMode, setGlobalMode] = useState<"heating" | "cooling" | "auto">(
    "auto"
  );
  const [globalTarget, setGlobalTarget] = useState(22);

  // Debug: Log the rooms data when component mounts or rooms change
  console.log("HeatingCoolingView - Rooms data:", {
    roomsLength: (rooms || []).length,
    rooms: (rooms || []).map((room) => ({
      id: room.id,
      name: room.name,
      temperature: room.temperature,
    })),
    roomsRaw: rooms,
  });

  // Get climate devices for each room
  const getClimateDevices = (roomName: string) => {
    return (devices || []).filter(
      (device) => device.room === roomName && device.type === "climate"
    );
  };

  // Get average temperature for all rooms
  const getAverageTemp = () => {
    const roomsWithTemp = (rooms || []).filter((room) => room.temperature);
    if (roomsWithTemp.length === 0) return 20;
    return Math.round(
      roomsWithTemp.reduce((sum, room) => sum + (room.temperature || 20), 0) /
        roomsWithTemp.length
    );
  };

  const applyGlobalTemperature = () => {
    console.log(
      "applyGlobalTemperature called - setting all rooms to",
      globalTarget,
      "°C"
    );
    if ((rooms || []).length === 0) {
      alert("No rooms available to update");
      return;
    }

    let successCount = 0;
    (rooms || []).forEach((room) => {
      try {
        updateRoomTemperature(room.id, globalTarget);
        successCount++;
      } catch (error) {
        console.error(`Failed to update room ${room.name}:`, error);
      }
    });

    console.log(
      `Successfully updated ${successCount} out of ${rooms.length} rooms to ${globalTarget}°C`
    );
  };

  const updateRoomTemperature = (roomId: string, temperature: number) => {
    console.log("🌡️ updateRoomTemperature called:", {
      roomId,
      temperature,
      roomIdType: typeof roomId,
    });
    console.log(
      "🌡️ Available room IDs:",
      (rooms || []).map((r) => ({
        id: r.id,
        idType: typeof r.id,
        name: r.name,
      }))
    );

    // Ensure functions are available (should always be true now)
    if (!updateRoom || !updateDeviceProperty) {
      console.error("🌡️ Missing required functions:", {
        updateRoom: !!updateRoom,
        updateDeviceProperty: !!updateDeviceProperty,
      });
      alert(
        "Temperature update functions are missing. Please check the parent component implementation."
      );
      return;
    }

    console.log(
      "🌡️ Updating room temperature for roomId:",
      roomId,
      "to:",
      temperature
    );

    // Update room temperature
    try {
      console.log("🌡️ Calling updateRoom with:", {
        roomId,
        updates: { temperature },
      });
      updateRoom(roomId, { temperature });
      console.log("🌡️ Room temperature updated successfully");
    } catch (error) {
      console.error("🌡️ Error updating room temperature:", error);
      return;
    }

    // Update climate devices in the room
    const room = (rooms || []).find((r) => r.id === roomId);
    console.log("🌡️ Room lookup result:", {
      searchingFor: roomId,
      found: !!room,
      roomData: room
        ? { id: room.id, name: room.name, temperature: room.temperature }
        : null,
    });

    if (room) {
      console.log(
        "🌡️ Found room:",
        room.name,
        "current temp:",
        room.temperature
      );
      const climateDevices = getClimateDevices(room.name);
      console.log(
        "🌡️ Climate devices in room:",
        climateDevices.length,
        climateDevices.map((d) => ({ id: d.id, name: d.name }))
      );

      climateDevices.forEach((device, index) => {
        try {
          console.log(
            `🌡️ Updating device ${index + 1}/${climateDevices.length}:`,
            device.id,
            "to:",
            temperature
          );
          updateDeviceProperty(device.id, "temperature", temperature);
          console.log(`🌡️ Device ${device.name} updated successfully`);
        } catch (error) {
          console.error(`🌡️ Error updating device ${device.id}:`, error);
        }
      });
    } else {
      console.error("🌡️ Room not found with id:", roomId);
      console.error(
        "🌡️ Available rooms for comparison:",
        (rooms || []).map((r) => ({
          id: r.id,
          idType: typeof r.id,
          name: r.name,
          matchesSearchId: r.id === roomId,
          strictEquals: r.id === roomId,
          looseEquals: r.id == roomId,
        }))
      );
    }
  };

  const getTemperatureStatus = (room: Room) => {
    const climateDevices = getClimateDevices(room.name);
    const activeDevices = climateDevices.filter((d) => d.status === "on");

    if (activeDevices.length === 0)
      return { status: "off", color: "text-gray-400" };

    const roomTemp = room.temperature || 20;
    if (roomTemp < 18) return { status: "cold", color: "text-blue-400" };
    if (roomTemp > 24) return { status: "hot", color: "text-red-400" };
    return { status: "comfortable", color: "text-green-400" };
  };

  const coolAllRooms = () => {
    console.log("🧊 coolAllRooms called");
    console.log(
      "Available rooms:",
      (rooms || []).map((r) => ({
        id: r.id,
        name: r.name,
        currentTemp: r.temperature,
      }))
    );

    if ((rooms || []).length === 0) {
      alert("No rooms available to cool");
      return;
    }

    let successCount = 0;
    (rooms || []).forEach((room, index) => {
      console.log(`🧊 Processing room ${index + 1}/${rooms.length}:`, {
        id: room.id,
        name: room.name,
      });
      try {
        updateRoomTemperature(room.id, 18);
        successCount++;
        console.log(`🧊 Successfully queued cooling for room: ${room.name}`);
      } catch (error) {
        console.error(`🧊 Failed to cool room ${room.name}:`, error);
      }
    });

    console.log(
      `🧊 Cooling operation completed: ${successCount}/${rooms.length} rooms processed`
    );
  };

  const heatAllRooms = () => {
    console.log("🔥 heatAllRooms called");
    console.log(
      "Available rooms:",
      (rooms || []).map((r) => ({
        id: r.id,
        name: r.name,
        currentTemp: r.temperature,
      }))
    );

    if ((rooms || []).length === 0) {
      alert("No rooms available to heat");
      return;
    }

    let successCount = 0;
    (rooms || []).forEach((room, index) => {
      console.log(`🔥 Processing room ${index + 1}/${rooms.length}:`, {
        id: room.id,
        name: room.name,
      });
      try {
        updateRoomTemperature(room.id, 24);
        successCount++;
        console.log(`🔥 Successfully queued heating for room: ${room.name}`);
      } catch (error) {
        console.error(`🔥 Failed to heat room ${room.name}:`, error);
      }
    });

    console.log(
      `🔥 Heating operation completed: ${successCount}/${rooms.length} rooms processed`
    );
  };

  const averageTemp = getAverageTemp();

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
              <Thermometer className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Heating & Cooling</h1>
          </div>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Global Controls */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Global Climate Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Status */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">
                  {averageTemp}°C
                </div>
                <div className="text-sm text-purple-200">Average</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {(rooms || []).length}
                </div>
                <div className="text-sm text-purple-200">Rooms</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {
                    (devices || []).filter(
                      (d) => d.type === "climate" && d.status === "on"
                    ).length
                  }
                </div>
                <div className="text-sm text-purple-200">Active</div>
              </div>
            </div>

            {/* Mode Selection */}
            <div>
              <div className="text-sm text-purple-200 mb-3">Climate Mode</div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={globalMode === "heating" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGlobalMode("heating")}
                  className={`flex items-center gap-2 ${
                    globalMode === "heating"
                      ? "bg-red-500 text-white"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  <Flame className="h-4 w-4" />
                  Heat
                </Button>
                <Button
                  variant={globalMode === "cooling" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGlobalMode("cooling")}
                  className={`flex items-center gap-2 ${
                    globalMode === "cooling"
                      ? "bg-blue-500 text-white"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  <Snowflake className="h-4 w-4" />
                  Cool
                </Button>
                <Button
                  variant={globalMode === "auto" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGlobalMode("auto")}
                  className={`flex items-center gap-2 ${
                    globalMode === "auto"
                      ? "bg-green-500 text-white"
                      : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  <Wind className="h-4 w-4" />
                  Auto
                </Button>
              </div>
            </div>

            {/* Global Temperature Control */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-purple-200">Set All Rooms</span>
                <span className="text-lg font-bold text-white">
                  {globalTarget}°C
                </span>
              </div>
              <Slider
                value={[globalTarget]}
                onValueChange={(value) => setGlobalTarget(value[0])}
                max={30}
                min={10}
                step={1}
                className="w-full mb-3"
              />
              <div className="flex justify-between text-xs text-purple-200 mb-4">
                <span>10°C</span>
                <span>30°C</span>
              </div>
              <Button
                onClick={applyGlobalTemperature}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Apply to All Rooms
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Individual Room Controls */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Room Temperature Control
          </h3>
          {(rooms || []).length > 0 ? (
            <div className="space-y-4">
              {(rooms || []).map((room) => {
                const climateDevices = getClimateDevices(room.name);
                const activeClimateDevices = climateDevices.filter(
                  (d) => d.status === "on"
                );
                const tempStatus = getTemperatureStatus(room);
                const roomTemp = room.temperature || 20;

                return (
                  <Card
                    key={room.id}
                    className="bg-white/15 backdrop-blur-md border-white/20"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500">
                            <Home className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white">
                              {room.name}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-purple-200">
                                {climateDevices.length} climate device
                                {climateDevices.length !== 1 ? "s" : ""}
                              </span>
                              <Badge
                                className={`text-xs ${
                                  tempStatus.status === "comfortable"
                                    ? "bg-green-500"
                                    : tempStatus.status === "cold"
                                    ? "bg-blue-500"
                                    : tempStatus.status === "hot"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                                } text-white`}
                              >
                                {tempStatus.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            {room.temperature || 20}°C
                          </div>
                          <div className="text-sm text-purple-200">
                            {activeClimateDevices.length}/
                            {climateDevices.length} active
                          </div>
                        </div>
                      </div>

                      {/* Temperature Control */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              const currentTemp = room.temperature || 20;
                              updateRoomTemperature(
                                room.id,
                                Math.max(10, currentTemp - 1)
                              );
                            }}
                            className="h-10 w-10 border-white/20 text-white hover:bg-white/10"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <div className="flex-1 mx-4">
                            <Slider
                              value={[room.temperature || 20]}
                              onValueChange={(value) => {
                                updateRoomTemperature(room.id, value[0]);
                              }}
                              max={30}
                              min={10}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              const currentTemp = room.temperature || 20;
                              updateRoomTemperature(
                                room.id,
                                Math.min(30, currentTemp + 1)
                              );
                            }}
                            className="h-10 w-10 border-white/20 text-white hover:bg-white/10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex justify-between text-xs text-purple-200">
                          <span>10°C</span>
                          <span>30°C</span>
                        </div>

                        {/* Climate Devices in Room */}
                        {climateDevices.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-white/20">
                            <div className="text-sm text-purple-200 mb-2">
                              Climate Devices:
                            </div>
                            {climateDevices.map((device) => (
                              <div
                                key={device.id}
                                className="flex items-center justify-between p-2 rounded bg-white/10"
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      device.status === "on"
                                        ? "bg-green-400"
                                        : "bg-gray-400"
                                    }`}
                                  />
                                  <span className="text-sm text-white">
                                    {device.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-purple-200">
                                    {device.temperature}°C
                                  </span>
                                  <Switch checked={device.status === "on"} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {climateDevices.length === 0 && (
                          <div className="text-center py-4 text-purple-200 text-sm">
                            No climate devices in this room
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Thermometer className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Rooms Found
              </h3>
              <p className="text-purple-200 mb-4">
                Add rooms to start controlling temperature
              </p>
              <Button
                onClick={() => setCurrentView("rooms")}
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Rooms
              </Button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          {/* Debug button - remove this after fixing */}
          {/* <Button
            onClick={() => {
              console.log('🔍 DEBUG - Current state:')
              console.log('🔍 Rooms:', rooms)
              console.log('🔍 Devices:', devices)
              console.log('🔍 UpdateRoom function:', updateRoom)
              console.log('🔍 UpdateDeviceProperty function:', updateDeviceProperty)
            }}
            className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            🔍 Debug - Check Console
          </Button> */}

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={coolAllRooms}
              className="h-16 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Snowflake className="h-6 w-6 mr-2" />
              Cool All (18°C)
            </Button>
            <Button
              onClick={heatAllRooms}
              className="h-16 bg-red-500 hover:bg-red-600 text-white"
            >
              <Flame className="h-6 w-6 mr-2" />
              Heat All (24°C)
            </Button>
          </div>
        </div>
      </div>

      <BottomNavigation
        activeTab="control"
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
    </div>
  );
}
