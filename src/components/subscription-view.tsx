"use client"

import { useState } from "react"
import { ArrowLeft, Check, Crown, Zap, Shield, Star, CreditCard } from "lucide-react"
import type { View, UserType, SubscriptionPlan } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface SubscriptionViewProps {
  currentUser: UserType | null
  setCurrentView: (view: View) => void
  setSelectedPlan: (plan: SubscriptionPlan | null) => void
}

export function SubscriptionView({ currentUser, setCurrentView, setSelectedPlan }: SubscriptionViewProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  if (!currentUser) return null

  // Provide safe defaults for user properties
  const safeUser = {
    ...currentUser,
    subscription: currentUser.subscription || "Free",
    devicesUsed: currentUser.devicesUsed || 0,
    maxDevices: currentUser.maxDevices || 5,
    email: currentUser.email || "user@example.com",
    subscriptionExpiry: currentUser.subscriptionExpiry || "N/A"
  }

  const plans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      period: "/month",
      maxDevices: 5,
      color: "#6b7280",
      features: ["Up to 5 devices", "Basic automation", "Mobile app access", "Email support", "Basic analytics"],
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: "$9.99",
      period: "/month",
      maxDevices: 25,
      color: "#3b82f6",
      features: [
        "Up to 25 devices",
        "Advanced automation",
        "Voice control",
        "Priority support",
        "Advanced analytics",
        "Scene management",
        "Energy monitoring",
      ],
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$19.99",
      period: "/month",
      maxDevices: 100,
      color: "#f59e0b",
      features: [
        "Unlimited devices",
        "AI-powered automation",
        "24/7 phone support",
        "Custom integrations",
        "Advanced security",
        "Multi-home support",
        "API access",
        "White-label options",
      ],
      popular: false,
    },
  ]

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    // Don't allow selecting the same plan
    if (safeUser.subscription.toLowerCase() === plan.id) {
      return
    }
    
    setSelectedPlanId(plan.id)
    setSelectedPlan(plan)
    setCurrentView("payment")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        paddingBottom: "80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => setCurrentView("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "#f59e0b",
              }}
            >
              <Crown size={20} />
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>Subscription</h1>
          </div>
        </div>
        <div style={{ fontSize: "16px", fontWeight: "500" }}>{getCurrentTime()}</div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Current Plan */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
            Current Plan
          </h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h4 style={{ fontSize: "24px", fontWeight: "bold", margin: "0", color: "#22c55e" }}>{safeUser.subscription}</h4>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", margin: "0" }}>
                {safeUser.devicesUsed}/{safeUser.maxDevices} devices used
              </p>
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: "#22c55e",
                fontSize: "12px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Check size={14} />
              Active
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Expires on</span>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>{safeUser.subscriptionExpiry}</span>
          </div>
        </div>

        {/* Plans */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
            Choose Your Plan
          </h3>
          <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", marginBottom: "16px", margin: "0 0 16px 0" }}>
            You are currently on the <strong style={{ color: "#22c55e" }}>{safeUser.subscription}</strong> plan.
            {safeUser.subscription === "Free" && " Upgrade to unlock more features and devices."}
            {safeUser.subscription === "Premium" && " Upgrade to Pro for unlimited devices and advanced features."}
            {safeUser.subscription === "Pro" && " You have our top-tier plan with unlimited devices!"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {plans.map((plan) => {
              const isCurrentPlan = safeUser.subscription.toLowerCase() === plan.id
              return (
              <div
                key={plan.id}
                style={{
                  backgroundColor: isCurrentPlan ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 255, 255, 0.15)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: isCurrentPlan 
                    ? "2px solid #22c55e" 
                    : plan.popular 
                      ? "2px solid #f59e0b" 
                      : "1px solid rgba(255, 255, 255, 0.2)",
                  padding: "24px",
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!isCurrentPlan) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"
                    e.currentTarget.style.transform = "translateY(-4px)"
                  }
                }}
                onMouseOut={(e) => {
                  if (!isCurrentPlan) {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)"
                    e.currentTarget.style.transform = "translateY(0px)"
                  }
                }}
              >
                {/* Popular Badge */}
                {plan.popular && !isCurrentPlan && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#f59e0b",
                      color: "white",
                      padding: "4px 16px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Star size={12} />
                    Most Popular
                  </div>
                )}
                
                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#22c55e",
                      color: "white",
                      padding: "4px 16px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Check size={12} />
                    Current Plan
                  </div>
                )}

                {/* Plan Header */}
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: plan.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px auto",
                    }}
                  >
                    {plan.id === "free" ? (
                      <Zap size={24} />
                    ) : plan.id === "premium" ? (
                      <Shield size={24} />
                    ) : (
                      <Crown size={24} />
                    )}
                  </div>
                  <h4 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 8px 0" }}>{plan.name}</h4>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px" }}>
                    <span style={{ fontSize: "32px", fontWeight: "bold" }}>{plan.price}</span>
                    <span style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.7)" }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", margin: "8px 0 0 0" }}>
                    Up to {plan.maxDevices === 100 ? "unlimited" : plan.maxDevices} devices
                  </p>
                </div>

                {/* Features */}
                <div style={{ marginBottom: "24px" }}>
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <Check size={16} style={{ color: "#22c55e" }} />
                      <span style={{ fontSize: "14px" }}>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrentPlan}
                  style={{
                    width: "100%",
                    height: "48px",
                    backgroundColor:
                      isCurrentPlan
                        ? "rgba(255, 255, 255, 0.2)"
                        : plan.popular
                          ? "#f59e0b"
                          : "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: isCurrentPlan ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                    opacity: isCurrentPlan ? 0.6 : 1,
                  }}
                  onMouseOver={(e) => {
                    if (!isCurrentPlan) {
                      e.currentTarget.style.backgroundColor = plan.popular ? "#d97706" : "rgba(255, 255, 255, 0.3)"
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isCurrentPlan) {
                      e.currentTarget.style.backgroundColor = plan.popular ? "#f59e0b" : "rgba(255, 255, 255, 0.2)"
                    }
                  }}
                >
                  {isCurrentPlan ? (
                    <>
                      <Check size={20} />
                      Current Plan
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      {plan.id === "free" ? "Downgrade" : "Upgrade"}
                    </>
                  )}
                </button>
              </div>
              )
            })}
          </div>
        </div>

        {/* Billing Information */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
            Billing Information
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Next billing date</span>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>{safeUser.subscriptionExpiry}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Payment method</span>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>•••• •••• •••• 4242</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>Billing email</span>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>{safeUser.email}</span>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "24px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
            Why Upgrade?
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px auto",
                }}
              >
                <Zap size={20} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>More Devices</h4>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", margin: "0" }}>
                Connect up to 100 smart devices
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px auto",
                }}
              >
                <Shield size={20} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>Advanced Security</h4>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", margin: "0" }}>
                Enhanced protection and monitoring
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#f59e0b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px auto",
                }}
              >
                <Crown size={20} />
              </div>
              <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 8px 0" }}>Priority Support</h4>
              <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)", margin: "0" }}>
                24/7 dedicated customer support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
