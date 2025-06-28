"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ArrowLeft, Zap, TrendingDown, Leaf } from "lucide-react";
import type { View, Device } from "@/types";
import { getCurrentTime } from "@/lib/utils";

interface EnergyMonitoringViewProps {
  devices: Device[];
  setCurrentView: (view: View) => void;
  handleLogout: () => void;
}

export function EnergyMonitoringView({
  devices = [],
  setCurrentView,
  handleLogout,
}: EnergyMonitoringViewProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month"
  >("day");

  const energyData = useMemo(() => {
    const baseMultiplier =
      selectedPeriod === "day" ? 1 : selectedPeriod === "week" ? 7 : 30;
    const activeDevices = devices.filter((device) => device.status === "on");

    return {
      totalUsage: parseFloat((45.2 * baseMultiplier).toFixed(1)), // kWh
      cost: parseFloat((12.34 * baseMultiplier).toFixed(2)), // $
      savings: parseFloat((8.5 + Math.random() * 3).toFixed(1)), // % compared to last period
      carbonFootprint: parseFloat((18.7 * baseMultiplier).toFixed(1)), // kg CO2
      peakHour:
        selectedPeriod === "day"
          ? "18:00"
          : selectedPeriod === "week"
          ? "Wed 18:00"
          : "Week 3",
      efficiency: Math.floor(85 + Math.random() * 10), // %
    };
  }, [selectedPeriod, devices]);

  const deviceEnergyUsage = useMemo(() => {
    const baseMultiplier =
      selectedPeriod === "day" ? 1 : selectedPeriod === "week" ? 7 : 30;
    return devices.map((device) => ({
      ...device,
      energyUsage: parseFloat((Math.random() * 10 * baseMultiplier).toFixed(1)),
      cost: parseFloat((Math.random() * 3 * baseMultiplier).toFixed(2)),
      efficiency: Math.floor(70 + Math.random() * 30),
    }));
  }, [devices, selectedPeriod]);

  const chartData = useMemo(() => {
    const dataPoints =
      selectedPeriod === "day" ? 24 : selectedPeriod === "week" ? 7 : 30;
    const maxUsage =
      selectedPeriod === "day" ? 6 : selectedPeriod === "week" ? 42 : 180;

    return Array.from({ length: dataPoints }, (_, i) => ({
      period: i,
      usage: parseFloat(
        (Math.random() * maxUsage * 0.8 + maxUsage * 0.2).toFixed(1)
      ),
      label:
        selectedPeriod === "day"
          ? i.toString().padStart(2, "0")
          : selectedPeriod === "week"
          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]
          : `${i + 1}`,
    }));
  }, [selectedPeriod]);

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
          <h1 className="text-xl font-bold">Energy Monitoring</h1>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Period Selector */}
        <Tabs
          value={selectedPeriod}
          onValueChange={(value) =>
            setSelectedPeriod(value as "day" | "week" | "month")
          }
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger
              value="day"
              className="text-white data-[state=active]:bg-white/20"
            >
              Today
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="text-white data-[state=active]:bg-white/20"
            >
              This Week
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="text-white data-[state=active]:bg-white/20"
            >
              This Month
            </TabsTrigger>
          </TabsList>

          {/* Content for each tab */}
          <TabsContent value="day" className="space-y-6">
            {renderEnergyContent()}
          </TabsContent>

          <TabsContent value="week" className="space-y-6">
            {renderEnergyContent()}
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            {renderEnergyContent()}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation
        activeTab="control"
        setCurrentView={setCurrentView}
        handleLogout={handleLogout}
      />
    </div>
  );

  function renderEnergyContent() {
    return (
      <>
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/15 backdrop-blur-md border-white/20 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {energyData.totalUsage}
              </div>
              <div className="text-sm text-purple-200">kWh Used</div>
              <div className="text-xs text-purple-300 mt-1">
                {selectedPeriod === "day"
                  ? "Today"
                  : selectedPeriod === "week"
                  ? "This Week"
                  : "This Month"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-md border-white/20 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                ${energyData.cost}
              </div>
              <div className="text-sm text-purple-200">Total Cost</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingDown className="h-4 w-4 text-green-400" />
                <span className="text-xs text-green-400">
                  {energyData.savings}% saved
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-md border-white/20 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <Leaf className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {energyData.carbonFootprint}
              </div>
              <div className="text-sm text-purple-200">kg CO₂</div>
              <div className="text-xs text-purple-300 mt-1">
                Carbon footprint
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/15 backdrop-blur-md border-white/20 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">
                {energyData.efficiency}%
              </div>
              <div className="text-sm text-purple-200">Efficiency</div>
              <div className="text-xs text-purple-300 mt-1">
                Peak: {energyData.peakHour}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Chart */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedPeriod === "day"
                ? "Hourly Usage"
                : selectedPeriod === "week"
                ? "Daily Usage"
                : "Weekly Usage"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-32 gap-1">
              {chartData.map((data, index) => {
                const maxValue = Math.max(...chartData.map((d) => d.usage));
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t transition-all duration-300"
                      style={{ height: `${(data.usage / maxValue) * 100}%` }}
                    />
                    <div className="text-xs text-purple-200 mt-1">
                      {data.label}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center text-xs text-purple-300 mt-2">
              {selectedPeriod === "day"
                ? "Hours (24h format)"
                : selectedPeriod === "week"
                ? "Days of the week"
                : "Weeks of the month"}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Device Energy Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deviceEnergyUsage
              .filter((device) => device.status === "on")
              .sort((a, b) => b.energyUsage - a.energyUsage)
              .slice(0, 5)
              .map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                    <span className="text-white">{device.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {device.energyUsage.toFixed(1)} kWh
                    </div>
                    <div className="text-xs text-purple-200">
                      ${device.cost.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            {deviceEnergyUsage.filter((d) => d.status === "on").length ===
              0 && (
              <div className="text-center text-purple-200 py-4">
                No active devices found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Energy Tips */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Energy Saving Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-purple-200">
              • Your peak usage is at {energyData.peakHour}. Consider shifting
              some activities to off-peak hours.
            </div>
            <div className="text-sm text-purple-200">
              • You're using {energyData.savings}% less energy than last{" "}
              {selectedPeriod}. Great job!
            </div>
            <div className="text-sm text-purple-200">
              •{" "}
              {selectedPeriod === "day"
                ? "Your efficiency is highest in the morning hours."
                : selectedPeriod === "week"
                ? "Weekends show lower energy consumption patterns."
                : "Monthly trends suggest room for improvement in heating/cooling efficiency."}
            </div>
            <div className="text-sm text-purple-200">
              •{" "}
              {deviceEnergyUsage.filter((d) => d.status === "on").length > 5
                ? "Consider turning off unused devices to save energy."
                : "Good job keeping energy usage optimized!"}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }
}
