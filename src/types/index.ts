import type React from "react";
export type View =
  | "welcome"
  | "login"
  | "register"
  | "dashboard"
  | "devices"
  | "subscription"
  | "rooms"
  | "control"
  | "settings"
  | "profile"
  | "device-detail"
  | "room-detail"
  | "category-detail"
  | "all-devices"
  | "active-devices"
  | "favourites"
  | "payment"
  | "automation"
  | "energy-monitoring"
  | "security-dashboard"
  | "voice-control"
  | "scenes"
  | "heating-cooling"
  | "history"
  | "add-device";

export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  subscription: "Free" | "Premium" | "Pro";
  subscriptionExpiry: string;
  devicesUsed: number;
  maxDevices: number;
  profileImage?: string;
  preferences?: {
    theme: "light" | "dark" | "auto";
    notifications: boolean;
    voiceControl: boolean;
    energyAlerts: boolean;
  };
  lastLogin?: string;
}

export interface Device {
  id: string;
  name: string;
  type:
    | "access"
    | "security"
    | "automation"
    | "climate"
    | "lighting"
    | "humidity"
    | "system"
    | "camera"
    | "speaker"
    | "tv";
  status: "on" | "off";
  room: string;
  value?: number;
  battery?: number;
  category: string;
  brightness?: number;
  volume?: number;
  temperature?: number;
  isPlaying?: boolean;
  currentSong?: string;
  lastUpdated?: string;
  energyUsage?: number;
  schedule?: {
    enabled: boolean;
    time: string;
    action: "turn_on" | "turn_off";
    days: string[];
  };
}

export interface Room {
  id: string;
  name: string;
  deviceCount: number;
  temperature?: number;
  humidity?: number;
  icon?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  deviceCount: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  maxDevices: number;
  features: string[];
  color: string;
  popular: boolean;
}

export interface Automation {
  id: string;
  name: string;
  trigger: "time" | "temperature" | "motion" | "device_state";
  triggerValue: string;
  deviceId: string;
  action: "turn_on" | "turn_off" | "set_brightness" | "set_temperature";
  enabled: boolean;
  createdAt: string;
  conditions?: {
    temperature?: number;
    time?: string;
    deviceState?: string;
  };
}

export interface Scene {
  id: string;
  name: string;
  icon: string;
  devices: {
    deviceId: string;
    action: "turn_on" | "turn_off";
    brightness?: number;
    temperature?: number;
    volume?: number;
  }[];
  createdAt: string;
}

export interface EnergyData {
  deviceId: string;
  timestamp: string;
  usage: number; // kWh
  cost: number; // $
}

export interface SecurityEvent {
  id: string;
  type: "motion" | "door" | "window" | "alarm" | "camera";
  deviceId: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
  description: string;
  resolved: boolean;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  action:
    | "device_added"
    | "device_removed"
    | "device_toggled"
    | "device_updated"
    | "room_added"
    | "room_removed"
    | "room_updated"
    | "scene_activated"
    | "automation_triggered"
    | "user_login"
    | "user_logout"
    | "settings_changed";
  itemId?: string;
  itemName: string;
  itemType: "device" | "room" | "scene" | "automation" | "user" | "system";
  details: string;
  userId: string;
  userName: string;
}
