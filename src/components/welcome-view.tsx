"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Shield,
  Zap,
  Smartphone,
  ArrowRight,
  Star,
  Users,
  Clock,
} from "lucide-react";
import type { View } from "@/types";

interface WelcomeViewProps {
  setCurrentView: (view: View) => void;
}

export function WelcomeView({ setCurrentView }: WelcomeViewProps) {
  const features = [
    {
      icon: <Home className="h-8 w-8" />,
      title: "Smart Home Control",
      description: "Control all your smart devices from one central hub",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Advanced Security",
      description: "Monitor and secure your home with intelligent alerts",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Energy Management",
      description: "Optimize energy usage and reduce your bills",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile Ready",
      description: "Access your smart home from anywhere, anytime",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-6 py-16 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-5xl font-bold leading-tight">
              Smart Home
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="mb-8 text-xl text-purple-200">
              Transform your house into an intelligent, connected home with our
              comprehensive automation platform
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={() => setCurrentView("login")}
                className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-8 py-3 text-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentView("register")}
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3 text-lg"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Experience the Future</h2>
            <p className="text-xl text-purple-200">
              Discover what makes our smart home platform special
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/15 backdrop-blur-md border-white/20 hover:bg-white/20 transition-colors"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-purple-200">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Card className="bg-white/15 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-2 md:items-center">
                <div>
                  <h2 className="mb-4 text-3xl font-bold text-white">
                    Welcome to Smart Home
                  </h2>
                  <p className="mb-6 text-lg text-purple-200">
                    Your intelligent home automation solution
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 border-2 border-white" />
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border-2 border-white" />
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-2 border-white" />
                    </div>
                    <div className="text-sm text-purple-200">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">4.9</span>
                        <span>• 10k+ users</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setCurrentView("login")}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 font-semibold"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                {/* <div className="relative">
                  <img
                    src="/placeholder.svg?height=300&width=400&text=Welcome+to+Smart+Home"
                    alt="Welcome to Smart Home"
                    className="rounded-lg shadow-2xl"
                  />
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            Powerful Features
          </h2>
          <p className="mb-12 text-center text-xl text-purple-200">
            Everything you need to create the perfect smart home
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Users className="h-12 w-12 text-yellow-400" />
              </div>
              <div className="mb-2 text-3xl font-bold text-white">10,000+</div>
              <div className="text-purple-200">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Home className="h-12 w-12 text-yellow-400" />
              </div>
              <div className="mb-2 text-3xl font-bold text-white">50+</div>
              <div className="text-purple-200">Device Types</div>
            </div>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <Clock className="h-12 w-12 text-yellow-400" />
              </div>
              <div className="mb-2 text-3xl font-bold text-white">24/7</div>
              <div className="text-purple-200">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-md border-white/20">
            <CardContent className="p-8">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="mb-6 text-lg text-purple-200">
                Join thousands of users who have transformed their homes with
                our platform
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  onClick={() => setCurrentView("register")}
                  className="bg-white text-purple-700 hover:bg-purple-50 font-semibold px-8 py-3"
                >
                  Create Free Account
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setCurrentView("login")}
                  className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
