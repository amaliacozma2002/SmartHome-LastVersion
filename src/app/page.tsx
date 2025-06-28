"use client";

import { useState, useEffect, useCallback } from "react";
import { WelcomeView } from "@/components/welcome-view";
import { LoginView } from "@/components/login-view";
import { RegisterView } from "@/components/register-view";
import { DashboardView } from "@/components/dashboard-view";
import { ControlView } from "@/components/control-view";
import { DeviceDetailView } from "@/components/device-detail-view";
import { AllDevicesView } from "@/components/all-devices-view";
import { ActiveDevicesView } from "@/components/active-devices-view";
import { AddDeviceView } from "@/components/add-device-view";
import { RoomsView } from "@/components/rooms-view";
import { FavouritesView } from "@/components/favourites-view";
import { SettingsView } from "@/components/settings-view";
import { ProfileView } from "@/components/profile-view";
import { SecurityDashboardView } from "@/components/security-dashboard-view";
import { AutomationView } from "@/components/automation-view";
import { EnergyMonitoringView } from "@/components/energy-monitoring-view";
import { ScenesView } from "@/components/scenes-view";
import { HistoryView } from "@/components/history-view";
import { CategoryDetailView } from "@/components/category-detail-view";
import { RoomDetailView } from "@/components/room-detail-view";
import { HeatingCoolingView } from "@/components/heating-cooling-view";
import { VoiceControlView } from "@/components/voice-control-view";
import { SubscriptionView } from "@/components/subscription-view";
import { PaymentView } from "@/components/payment-view";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  initialDevices,
  initialRooms,
  initialCategories,
} from "@/data/initial-data";
import { authAPI, devicesAPI } from "@/api";
import type {
  View,
  Device,
  Room,
  Category,
  UserType,
  HistoryEntry,
  Scene,
  Automation,
  SubscriptionPlan,
} from "@/types";

export default function Home() {
  const [currentView, setCurrentView] = useState<View>("welcome");
  const [currentUser, setCurrentUser] = useLocalStorage<UserType | null>(
    "currentUser",
    null
  );
  const [devices, setDevices] = useLocalStorage<Device[]>(
    "devices",
    initialDevices
  );
  const [rooms, setRooms] = useLocalStorage<Room[]>("rooms", initialRooms);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    "categories",
    initialCategories
  );
  const [favouriteDevices, setFavouriteDevices] = useLocalStorage<string[]>(
    "favouriteDevices",
    []
  );
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Add history state for tracking user activities with sample data
  const initialHistory = [
    {
      id: "1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      userName: "Demo User",
      userId: "demo-user",
      itemType: "device" as const,
      itemName: "Smart Thermostat",
      action: "device_toggled" as const,
      details: "Device turned on",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      userName: "Demo User",
      userId: "demo-user",
      itemType: "device" as const,
      itemName: "Main Lights",
      action: "device_updated" as const,
      details: "Brightness adjusted to 75%",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      userName: "Demo User",
      userId: "demo-user",
      itemType: "user" as const,
      itemName: "Demo User",
      action: "user_login" as const,
      details: "Logged in successfully",
    },
  ];
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    "activityHistory",
    initialHistory
  );

  // Add scenes state
  const [scenes, setScenes] = useLocalStorage<Scene[]>("scenes", []);

  const [automations, setAutomations] = useLocalStorage<Automation[]>(
    "automations",
    []
  );

  // Check authentication on mount
  useEffect(() => {
    if (currentUser) {
      setCurrentView("dashboard");
    }
  }, [currentUser]);

  const toggleDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id === deviceId) {
          const newStatus = device.status === "on" ? "off" : "on";
          // Add history entry
          addHistoryEntry({
            itemType: "device",
            itemName: device.name,
            action: "device_toggled",
            details: `Device turned ${newStatus}`,
          });
          return {
            ...device,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          };
        }
        return device;
      })
    );
  };

  const updateDevice = (deviceId: string, updates: Partial<Device>) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id === deviceId) {
          // Add history entry
          addHistoryEntry({
            itemType: "device",
            itemName: device.name,
            action: "device_updated",
            details: `Device settings updated`,
          });
          return {
            ...device,
            ...updates,
            lastUpdated: new Date().toISOString(),
          };
        }
        return device;
      })
    );
  };

  const removeDevice = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      // Add history entry
      addHistoryEntry({
        itemType: "device",
        itemName: device.name,
        action: "device_removed",
        details: `Device removed from ${device.room}`,
      });
    }
    setDevices((prev) => prev.filter((device) => device.id !== deviceId));
    setFavouriteDevices((prev) => prev.filter((id) => id !== deviceId));
  };

  const addDevice = async (deviceData: Omit<Device, "id">) => {
    try {
      // Call the backend API to create device using the API utility
      const backendDevice = await devicesAPI.createDevice({
        name: deviceData.name,
        type: deviceData.type,
        room: deviceData.room,
        category: deviceData.category,
        isOn: deviceData.status === 'on',
        isFavorite: false,
        status: 'online',
        brightness: deviceData.brightness,
        volume: deviceData.volume,
        temperature: deviceData.temperature,
        battery: deviceData.battery,
        energyUsage: deviceData.energyUsage
      })
      
      // Create the frontend device object
      const newDevice: Device = {
        ...deviceData,
        id: backendDevice._id || `device-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
      };
      
      setDevices((prev) => [...prev, newDevice]);
      addHistoryEntry({
        itemType: "device",
        itemName: newDevice.name,
        action: "device_added",
        details: `Device "${newDevice.name}" added to ${newDevice.room}`,
      });
    } catch (error) {
      console.error('Failed to add device:', error)
      // Still add to local state if API fails
      const newDevice: Device = {
        ...deviceData,
        id: `device-${Date.now()}`,
        lastUpdated: new Date().toISOString(),
      };
      setDevices((prev) => [...prev, newDevice]);
      addHistoryEntry({
        itemType: "device",
        itemName: newDevice.name,
        action: "device_added",
        details: `Device "${newDevice.name}" added to ${newDevice.room}`,
      });
      throw error // Re-throw to let the component handle it
    }
  };

  // Room management functions
  const addRoom = (roomData: Omit<Room, "id">) => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    setRooms((prev) => [...prev, newRoom]);
    addHistoryEntry({
      itemType: "room",
      itemName: newRoom.name,
      action: "room_added",
      details: `Room "${newRoom.name}" added`,
    });
  };

  const removeRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      addHistoryEntry({
        itemType: "room",
        itemName: room.name,
        action: "room_removed",
        details: `Room "${room.name}" removed`,
      });
    }
  };

  const toggleFavorite = (deviceId: string) => {
    setFavouriteDevices((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleLogout = () => {
    if (currentUser) {
      // Add history entry before logout
      addHistoryEntry({
        itemType: "user",
        itemName: currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : "User",
        action: "user_logout",
        details: `Logged out successfully`,
      });
    }
    setCurrentUser(null);
    setCurrentView("welcome");
  };

  const handleLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      if (response.user) {
        setCurrentUser(response.user);
        setCurrentView("dashboard");
        // Add history entry after user is set
        setTimeout(() => {
          addHistoryEntry({
            itemType: "user",
            itemName:
              `${response.user.firstName} ${response.user.lastName}` ||
              response.user.email,
            action: "user_login",
            details: `Logged in successfully`,
          });
        }, 100);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      const response = await authAPI.register(email, password, name);
      if (response.user) {
        setCurrentUser(response.user);
        setCurrentView("dashboard");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const updateProfile = (updates: Partial<UserType>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addHistoryEntry = useCallback(
    (entry: Partial<HistoryEntry>) => {
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userName: currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : "User",
        userId: currentUser?.id || "demo-user",
        itemType: "device",
        itemName: "",
        action: "device_toggled",
        details: "",
        ...entry,
      };
      setHistory((prev) => [newEntry, ...prev]);
    },
    [currentUser?.firstName, currentUser?.lastName, currentUser?.id, setHistory]
  );

  // Scene management functions
  const addScene = (scene: Scene) => {
    setScenes((prev) => [...prev, scene]);
    addHistoryEntry({
      itemType: "scene",
      itemName: scene.name,
      action: "scene_activated",
      details: `Scene "${scene.name}" created with ${scene.devices.length} devices`,
    });
  };

  const deleteScene = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (scene) {
      setScenes((prev) => prev.filter((s) => s.id !== sceneId));
      addHistoryEntry({
        itemType: "scene",
        itemName: scene.name,
        action: "scene_activated",
        details: `Scene "${scene.name}" deleted`,
      });
    }
  };

  const executeScene = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (scene) {
      // Execute the scene by applying device changes
      scene.devices.forEach((sceneDevice) => {
        const device = devices.find((d) => d.id === sceneDevice.deviceId);
        if (device) {
          updateDevice(sceneDevice.deviceId, {
            status: sceneDevice.action === "turn_on" ? "on" : "off",
            ...(sceneDevice.brightness && {
              brightness: sceneDevice.brightness,
            }),
            ...(sceneDevice.temperature && {
              temperature: sceneDevice.temperature,
            }),
            ...(sceneDevice.volume && { volume: sceneDevice.volume }),
          });
        }
      });

      addHistoryEntry({
        itemType: "scene",
        itemName: scene.name,
        action: "scene_activated",
        details: `Scene "${scene.name}" activated affecting ${scene.devices.length} devices`,
      });
    }
  };

  const addAutomation = (automation: Automation) => {
    setAutomations((prev) => [...prev, automation]);
    addHistoryEntry({
      itemType: "automation",
      itemName: automation.name,
      action: "automation_triggered",
      details: `Automation "${automation.name}" created`,
    });
  };

  const deleteAutomation = (automationId: string) => {
    const automation = automations.find((a) => a.id === automationId);
    if (automation) {
      setAutomations((prev) => prev.filter((a) => a.id !== automationId));
      addHistoryEntry({
        itemType: "automation",
        itemName: automation.name,
        action: "automation_triggered",
        details: `Automation "${automation.name}" deleted`,
      });
    }
  };

  const toggleAutomation = (automationId: string) => {
    const automation = automations.find((a) => a.id === automationId);
    if (automation) {
      setAutomations((prev) =>
        prev.map((a) =>
          a.id === automationId ? { ...a, enabled: !a.enabled } : a
        )
      );
      addHistoryEntry({
        itemType: "automation",
        itemName: automation.name,
        action: "automation_triggered",
        details: `Automation "${automation.name}" ${
          automation.enabled ? "disabled" : "enabled"
        }`,
      });
    }
  };

  const updateRoom = useCallback((roomId: string, updates: Partial<Room>) => {
    setRooms((prev) => {
      return prev.map((room) => {
        if (room.id === roomId) {
          const updatedRoom = { ...room, ...updates };
          addHistoryEntry({
            itemType: "room",
            itemName: updatedRoom.name,
            action: "room_updated",
            details: `Room "${updatedRoom.name}" updated`,
          });
          return updatedRoom;
        }
        return room;
      });
    });
  }, []);

  const updateDeviceProperty = useCallback(
    (deviceId: string, property: string, value: number) => {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId ? { ...device, [property]: value } : device
        )
      );
    },
    []
  );

  const renderView = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomeView setCurrentView={setCurrentView} />;

      case "login":
        return (
          <LoginView onLogin={handleLogin} setCurrentView={setCurrentView} />
        );

      case "register":
        return (
          <RegisterView
            setCurrentView={setCurrentView}
            setUser={setCurrentUser}
          />
        );

      case "dashboard":
        return (
          <DashboardView
            currentUser={currentUser!}
            devices={devices}
            rooms={rooms}
            categories={categories}
            toggleDevice={toggleDevice}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "control":
        return (
          <ControlView
            setCurrentView={setCurrentView}
            setSelectedDevice={setSelectedDevice}
            handleLogout={handleLogout}
          />
        );

      case "device-detail":
        return selectedDevice ? (
          <DeviceDetailView
            device={selectedDevice}
            updateDevice={updateDevice}
            toggleDevice={toggleDevice}
            removeDevice={removeDevice}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        ) : (
          <ControlView
            setCurrentView={setCurrentView}
            setSelectedDevice={setSelectedDevice}
            handleLogout={handleLogout}
          />
        );

      case "all-devices":
        return (
          <AllDevicesView
            devices={devices}
            categories={categories}
            toggleDevice={toggleDevice}
            setCurrentView={setCurrentView}
            setSelectedDevice={setSelectedDevice}
            handleLogout={handleLogout}
          />
        );

      case "add-device":
        return (
          <AddDeviceView
            rooms={rooms}
            setCurrentView={setCurrentView}
            onDeviceAdd={addDevice}
          />
        );

      case "active-devices":
        return (
          <ActiveDevicesView
            setCurrentView={setCurrentView}
            setSelectedDevice={setSelectedDevice}
            handleLogout={handleLogout}
          />
        );

      case "rooms":
        return (
          <RoomsView
            rooms={rooms}
            devices={devices}
            addRoom={addRoom}
            updateRoom={updateRoom}
            removeRoom={removeRoom}
            setCurrentView={setCurrentView}
            setSelectedRoom={setSelectedRoom}
            handleLogout={handleLogout}
          />
        );

      case "room-detail":
        return selectedRoom ? (
          <RoomDetailView
            room={selectedRoom}
            devices={devices.filter((d) => d.room === selectedRoom.name)}
            toggleDevice={toggleDevice}
            toggleFavorite={toggleFavorite}
            favouriteDevices={favouriteDevices}
            addDevice={addDevice}
            removeDevice={removeDevice}
            setCurrentView={setCurrentView}
            setSelectedDevice={setSelectedDevice}
          />
        ) : (
          <RoomsView
            rooms={rooms}
            devices={devices}
            addRoom={addRoom}
            updateRoom={updateRoom}
            removeRoom={removeRoom}
            setCurrentView={setCurrentView}
            setSelectedRoom={setSelectedRoom}
            handleLogout={handleLogout}
          />
        );

      case "category-detail":
        return selectedCategory ? (
          <CategoryDetailView
            category={selectedCategory}
            setCurrentView={setCurrentView}
            setSelectedDevice={setSelectedDevice}
            handleLogout={handleLogout}
          />
        ) : (
          <DashboardView
            currentUser={currentUser!}
            devices={devices}
            rooms={rooms}
            categories={categories}
            toggleDevice={toggleDevice}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "favourites":
        return (
          <FavouritesView
            devices={devices.filter((d) => favouriteDevices.includes(d.id))}
            favouriteDevices={favouriteDevices}
            toggleDevice={toggleDevice}
            toggleFavorite={toggleFavorite}
            setCurrentView={setCurrentView}
            setSelectedDevice={setSelectedDevice}
            handleLogout={handleLogout}
          />
        );

      case "settings":
        return (
          <SettingsView
            user={currentUser!}
            updateProfile={updateProfile}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "profile":
        return (
          <ProfileView
            user={currentUser!}
            updateProfile={updateProfile}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "security-dashboard":
        return (
          <SecurityDashboardView
            devices={devices}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "automation":
        return (
          <AutomationView
            devices={devices}
            automations={automations}
            setAutomations={setAutomations}
            addAutomation={addAutomation}
            deleteAutomation={deleteAutomation}
            toggleAutomation={toggleAutomation}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "energy-monitoring":
        return (
          <EnergyMonitoringView
            devices={devices}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "scenes":
        return (
          <ScenesView
            devices={devices}
            scenes={scenes}
            setScenes={setScenes}
            addScene={addScene}
            deleteScene={deleteScene}
            executeScene={executeScene}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "history":
        return (
          <HistoryView
            history={history}
            clearHistory={clearHistory}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "heating-cooling":
        return (
          <HeatingCoolingView
            rooms={rooms}
            devices={devices}
            updateRoom={updateRoom}
            updateDeviceProperty={updateDeviceProperty}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "voice-control":
        return (
          <VoiceControlView
            devices={devices}
            toggleDevice={toggleDevice}
            setCurrentView={setCurrentView}
            handleLogout={handleLogout}
          />
        );

      case "subscription":
        return (
          <SubscriptionView
            currentUser={currentUser!}
            setCurrentView={setCurrentView}
            setSelectedPlan={setSelectedPlan}
          />
        );

      case "payment":
        return (
          <PaymentView
            selectedPlan={selectedPlan}
            setCurrentView={setCurrentView}
            updateProfile={updateProfile}
            setSelectedPlan={setSelectedPlan}
          />
        );

      default:
        return <WelcomeView setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700">
      {renderView()}
    </div>
  );
}
