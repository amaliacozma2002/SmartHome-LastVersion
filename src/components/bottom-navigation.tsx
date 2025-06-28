"use client";

import { Button } from "@/components/ui/button";
import {
  Home,
  Settings,
  Sliders,
  User,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import type { View } from "@/types";
import { useState } from "react";

interface BottomNavigationProps {
  activeTab: string;
  setCurrentView: (view: View) => void;
  handleLogout: () => void;
}

export function BottomNavigation({
  activeTab,
  setCurrentView,
  handleLogout,
}: BottomNavigationProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home", view: "dashboard" as View },
    { id: "control", icon: Sliders, label: "Control", view: "control" as View },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      view: "settings" as View,
    },
    { id: "profile", icon: User, label: "Profile", view: "profile" as View },
  ];

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* More Menu */}
      {showMoreMenu && (
        <div className="fixed bottom-20 right-4 bg-white/15 backdrop-blur-md rounded-xl p-2 z-50 border border-white/20">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentView("rooms");
                setShowMoreMenu(false);
              }}
              className="justify-start text-white hover:bg-white/10"
            >
              Rooms
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentView("security-dashboard");
                setShowMoreMenu(false);
              }}
              className="justify-start text-white hover:bg-white/10"
            >
              Security
            </Button>
            <hr className="border-white/20 my-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleLogout();
                setShowMoreMenu(false);
              }}
              className="justify-start text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10 z-30">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                activeTab === item.id ? "text-white" : "text-purple-300"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-purple-300"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-xs">More</span>
          </Button>
        </div>
      </div>
    </>
  );
}
