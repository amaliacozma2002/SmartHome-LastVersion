import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this line to re-export getDeviceIcon from device-icons.tsx
// This will help with backward compatibility for components still importing from utils
export { getDeviceIcon, getDeviceColor } from "./device-icons"

// Add getCurrentTime function
export function getCurrentTime(): string {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  // Format as HH:MM AM/PM
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
  const period = hours >= 12 ? "PM" : "AM"

  return `${formattedHours}:${formattedMinutes} ${period}`
}
