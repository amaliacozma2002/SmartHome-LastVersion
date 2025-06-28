// API configuration and functions for smart home backend
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

// Get JWT token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

// Set JWT token in localStorage
const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

// Remove JWT token from localStorage
const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken")
  }
}

// Create headers with authentication
const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  const token = getAuthToken()
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

// Generic API request function with error handling
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        ...createHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Authentication API
export const authAPI = {
  // API Call: POST /api/auth/login
  // Authenticates user and returns JWT token + user info
  login: async (email: string, password: string) => {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    // Store the JWT token
    if (response.token) {
      setAuthToken(response.token)
    }

    return response
  },

  // API Call: POST /api/auth/register
  // Registers new user and returns JWT token + user info
  register: async (email: string, password: string, name: string) => {
    const response = await apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })

    // Store the JWT token
    if (response.token) {
      setAuthToken(response.token)
    }

    return response
  },

  // Logout user by removing token
  logout: () => {
    removeAuthToken()
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!getAuthToken()
  },

  // API Call: POST /api/auth/change-password
  // Changes user password (requires authentication)
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiRequest("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    })

    return response
  },

  // API Call: DELETE /api/auth/delete-account
  // Deletes user account (requires authentication)
  deleteAccount: async () => {
    const response = await apiRequest("/api/auth/delete-account", {
      method: "DELETE",
    })

    // Remove token after account deletion
    removeAuthToken()

    return response
  },
}

// Dashboard API
export const dashboardAPI = {
  // API Call: GET /api/dashboard
  // Returns all dashboard data (user, categories, devices, subscription, scenes)
  getDashboardData: async () => {
    return await apiRequest("/api/dashboard")
  },
}

// Devices API
export const devicesAPI = {
  // API Call: GET /api/devices
  // Returns list of all smart devices
  getDevices: async () => {
    return await apiRequest("/api/devices")
  },

  // API Call: GET /api/devices/:id
  // Returns specific device details
  getDevice: async (deviceId: string) => {
    return await apiRequest(`/api/devices/${deviceId}`)
  },

  // API Call: POST /api/devices/:id/toggle
  // Toggles device on/off state and returns updated device
  toggleDevice: async (deviceId: string) => {
    return await apiRequest(`/api/devices/${deviceId}/toggle`, {
      method: "POST",
    })
  },

  // API Call: PATCH /api/devices/:id
  // Updates device properties like brightness, temperature, volume
  updateDevice: async (deviceId: string, updates: any) => {
    return await apiRequest(`/api/devices/${deviceId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  },

  // API Call: POST /api/devices
  // Creates a new device
  createDevice: async (deviceData: any) => {
    return await apiRequest("/api/devices", {
      method: "POST",
      body: JSON.stringify(deviceData),
    })
  },

  // API Call: DELETE /api/devices/:id
  // Deletes a device
  deleteDevice: async (deviceId: string) => {
    return await apiRequest(`/api/devices/${deviceId}`, {
      method: "DELETE",
    })
  },
}

// Rooms API
export const roomsAPI = {
  // API Call: GET /api/rooms
  getRooms: async () => {
    return await apiRequest("/api/rooms")
  },

  // API Call: GET /api/rooms/:id/devices
  getRoomDevices: async (roomId: string) => {
    return await apiRequest(`/api/rooms/${roomId}/devices`)
  },
}

// Automations API
export const automationsAPI = {
  // API Call: GET /api/automations
  getAutomations: async () => {
    return await apiRequest("/api/automations")
  },

  // API Call: POST /api/automations
  createAutomation: async (automationData: any) => {
    return await apiRequest("/api/automations", {
      method: "POST",
      body: JSON.stringify(automationData),
    })
  },

  // API Call: PATCH /api/automations/:id
  updateAutomation: async (automationId: string, updates: any) => {
    return await apiRequest(`/api/automations/${automationId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    })
  },

  // API Call: DELETE /api/automations/:id
  deleteAutomation: async (automationId: string) => {
    return await apiRequest(`/api/automations/${automationId}`, {
      method: "DELETE",
    })
  },
}

// Scenes API
export const scenesAPI = {
  // API Call: GET /api/scenes
  getScenes: async () => {
    return await apiRequest("/api/scenes")
  },

  // API Call: POST /api/scenes/:id/activate
  activateScene: async (sceneId: string) => {
    return await apiRequest(`/api/scenes/${sceneId}/activate`, {
      method: "POST",
    })
  },

  // API Call: POST /api/scenes
  createScene: async (sceneData: any) => {
    return await apiRequest("/api/scenes", {
      method: "POST",
      body: JSON.stringify(sceneData),
    })
  },
}

// Energy API
export const energyAPI = {
  // API Call: GET /api/energy/usage
  getEnergyUsage: async (period = "day") => {
    return await apiRequest(`/api/energy/usage?period=${period}`)
  },

  // API Call: GET /api/energy/costs
  getEnergyCosts: async (period = "month") => {
    return await apiRequest(`/api/energy/costs?period=${period}`)
  },
}

// Security API
export const securityAPI = {
  // API Call: GET /api/security/status
  getSecurityStatus: async () => {
    return await apiRequest("/api/security/status")
  },

  // API Call: POST /api/security/arm
  armSecurity: async () => {
    return await apiRequest("/api/security/arm", {
      method: "POST",
    })
  },

  // API Call: POST /api/security/disarm
  disarmSecurity: async () => {
    return await apiRequest("/api/security/disarm", {
      method: "POST",
    })
  },
}

// Export auth token utilities for use in components
export { getAuthToken, setAuthToken, removeAuthToken }
