"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import type { View } from "@/types"

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<boolean>
  setCurrentView: (view: View) => void
}

export function LoginView({ onLogin, setCurrentView }: LoginViewProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    if (!loginForm.email || !loginForm.password) {
      setErrors({
        general: "Please enter both email and password",
      })
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = await onLogin(loginForm.email, loginForm.password)

    if (!success) {
      setErrors({
        general: "Invalid email or password. Please try again.",
      })
    }

    setIsLoading(false)
  }

  const fillDemoCredentials = async () => {
    setLoginForm({
      email: "demo@smarthome.com",
      password: "Demo123!",
    })

    setIsLoading(true)
    setErrors({})

    // Use the same delay pattern as handleLogin
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = onLogin("demo@smarthome.com", "Demo123!")

    if (!success) {
      setErrors({
        general: "Invalid email or password. Please try again.",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("welcome")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-purple-200">
              Enter your credentials to access your smart home dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {errors.general && (
                <div className="flex items-center gap-2 rounded-md bg-red-500/20 p-3 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{errors.general}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-0 top-0 h-full px-3 text-purple-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-white text-purple-700 hover:bg-purple-50">
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-purple-200">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentView("register")}
                    disabled={isLoading}
                    className="text-white underline hover:no-underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>

            {/* Demo Account Section */}
            <div className="mt-6 rounded-lg bg-white/5 p-4">
              <h4 className="mb-2 text-sm font-semibold text-white">Demo Account</h4>
              <p className="mb-3 text-xs text-purple-200">Try the app with these credentials:</p>
              <div className="mb-3 space-y-1 text-xs text-purple-200">
                <div>Email: demo@smarthome.com</div>
                <div>Password: Demo123!</div>
              </div>
              <Button
                type="button"
                onClick={fillDemoCredentials}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Use Demo Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
