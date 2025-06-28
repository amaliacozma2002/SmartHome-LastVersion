"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"
import { authAPI } from "@/api"
import type { View, UserType } from "@/types"

interface RegisterViewProps {
  setCurrentView: (view: View) => void
  setUser: (user: UserType | null) => void
}

export function RegisterView({ setCurrentView, setUser }: RegisterViewProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!agreeToTerms) {
      setErrors({ general: "Please agree to the terms and conditions" })
      return
    }

    if (password !== confirmPassword) {
      setErrors({ general: "Passwords do not match" })
      return
    }

    if (!name || !email || !password) {
      setErrors({ general: "Please fill in all fields" })
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.register(email, password, name)
      if (response.user) {
        setUser(response.user)
        setCurrentView("dashboard")
      }
    } catch (error) {
      console.error("Registration failed:", error)
      setErrors({ 
        general: error instanceof Error ? error.message : "Registration failed. Please try again." 
      })
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Sign Up</CardTitle>
            <CardDescription className="text-purple-200">
              Create your account to get started with your smart home dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="flex items-center gap-2 rounded-md bg-red-500/20 p-3 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <p className="text-sm">{errors.general}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-0 top-0 h-full px-3 text-purple-300 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 text-white bg-white/10 border-white/20 rounded focus:ring-white focus:ring-2"
                />
                <Label htmlFor="terms" className="text-sm text-white">
                  I agree to the terms and conditions
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !agreeToTerms}
                className="w-full bg-white text-purple-700 hover:bg-purple-50 disabled:bg-white/50 disabled:text-purple-700/50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-purple-200">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setCurrentView("login")}
                    className="text-white underline hover:no-underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
