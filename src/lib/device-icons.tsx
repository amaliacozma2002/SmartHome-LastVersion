import { Lightbulb, Thermometer, Shield, Volume2, Camera, Lock, Tv, Speaker, Fan, Zap, Home, Wifi } from "lucide-react"

export function getDeviceIcon(type: string) {
  switch (type.toLowerCase()) {
    case "lighting":
    case "light":
    case "bulb":
    case "lamp":
      return <Lightbulb className="h-5 w-5" />
    case "climate":
    case "thermostat":
    case "heater":
    case "ac":
    case "air conditioner":
      return <Thermometer className="h-5 w-5" />
    case "camera":
    case "security camera":
      return <Camera className="h-5 w-5" />
    case "access":
    case "lock":
    case "door lock":
    case "smart lock":
      return <Lock className="h-5 w-5" />
    case "tv":
    case "television":
    case "smart tv":
      return <Tv className="h-5 w-5" />
    case "speaker":
    case "smart speaker":
      return <Speaker className="h-5 w-5" />
    case "fan":
    case "ceiling fan":
      return <Fan className="h-5 w-5" />
    case "system":
    case "outlet":
    case "smart outlet":
    case "plug":
      return <Zap className="h-5 w-5" />
    case "automation":
    case "hub":
    case "smart hub":
      return <Home className="h-5 w-5" />
    case "router":
    case "wifi":
      return <Wifi className="h-5 w-5" />
    case "security":
    case "alarm":
      return <Shield className="h-5 w-5" />
    case "music":
    case "audio":
      return <Volume2 className="h-5 w-5" />
    default:
      return <Home className="h-5 w-5" />
  }
}

export function getDeviceColor(type: string, status = "off") {
  const baseColors = {
    lighting: status === "on" ? "bg-yellow-500" : "bg-gray-500",
    light: status === "on" ? "bg-yellow-500" : "bg-gray-500",
    climate: status === "on" ? "bg-red-500" : "bg-gray-500",
    thermostat: status === "on" ? "bg-red-500" : "bg-gray-500",
    camera: status === "on" ? "bg-blue-500" : "bg-gray-500",
    access: status === "on" ? "bg-green-500" : "bg-gray-500",
    lock: status === "on" ? "bg-green-500" : "bg-gray-500",
    tv: status === "on" ? "bg-purple-500" : "bg-gray-500",
    speaker: status === "on" ? "bg-indigo-500" : "bg-gray-500",
    fan: status === "on" ? "bg-cyan-500" : "bg-gray-500",
    system: status === "on" ? "bg-orange-500" : "bg-gray-500",
    outlet: status === "on" ? "bg-orange-500" : "bg-gray-500",
    automation: status === "on" ? "bg-emerald-500" : "bg-gray-500",
    hub: status === "on" ? "bg-emerald-500" : "bg-gray-500",
    router: status === "on" ? "bg-blue-600" : "bg-gray-500",
    security: status === "on" ? "bg-red-600" : "bg-gray-500",
    music: status === "on" ? "bg-pink-500" : "bg-gray-500",
  }

  return (
    baseColors[type.toLowerCase() as keyof typeof baseColors] || (status === "on" ? "bg-emerald-500" : "bg-gray-500")
  )
}
