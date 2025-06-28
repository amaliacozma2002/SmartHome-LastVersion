"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CreditCard, Smartphone, Check } from "lucide-react"
import type { View, SubscriptionPlan, UserType } from "@/types"
import { getCurrentTime } from "@/lib/utils"

interface PaymentViewProps {
  selectedPlan: SubscriptionPlan | null
  setCurrentView: (view: View) => void
  updateProfile: (updates: Partial<UserType>) => void
  setSelectedPlan: (plan: SubscriptionPlan | null) => void
}

export function PaymentView({ selectedPlan, setCurrentView, updateProfile, setSelectedPlan }: PaymentViewProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple">("card")
  const [cardForm, setCardForm] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  if (!selectedPlan) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 p-6 text-white">
        <p>No plan selected</p>
      </div>
    )
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    updateProfile({
      subscription: selectedPlan.name as "Free" | "Premium" | "Pro",
      maxDevices: selectedPlan.maxDevices,
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 1 year from now
    })

    setCurrentView("subscription")
    setSelectedPlan(null)
    setIsProcessing(false)
  }

  const handleApplePay = async () => {
    setIsProcessing(true)

    // Simulate Apple Pay processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    updateProfile({
      subscription: selectedPlan.name as "Free" | "Premium" | "Pro",
      maxDevices: selectedPlan.maxDevices,
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })

    setCurrentView("subscription")
    setSelectedPlan(null)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-700 pb-20 text-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-black/10 p-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("subscription")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Payment</h1>
        </div>
        <div className="text-base font-medium">{getCurrentTime()}</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Plan Summary */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Plan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-white">{selectedPlan.name}</h4>
                <p className="text-purple-200 text-sm">Up to {selectedPlan.maxDevices} devices</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">{selectedPlan.price}</span>
                <span className="text-purple-200 text-sm">{selectedPlan.period}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-white/15 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Apple Pay */}
            <Button
              onClick={handleApplePay}
              disabled={isProcessing}
              className="w-full h-12 bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <Smartphone className="h-5 w-5" />
              {isProcessing && paymentMethod === "apple" ? "Processing..." : "Pay with Apple Pay"}
            </Button>

            <div className="text-center text-purple-200">or</div>

            {/* Credit Card Form */}
            <div className="space-y-4">
              <div>
                <Label className="text-purple-200 text-sm">Card Number</Label>
                <Input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardForm.number}
                  onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                  className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-200 text-sm">Expiry Date</Label>
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label className="text-purple-200 text-sm">CVV</Label>
                  <Input
                    type="text"
                    placeholder="123"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <Label className="text-purple-200 text-sm">Cardholder Name</Label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={cardForm.name}
                  onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                  className="bg-white/10 text-white border-white/20 placeholder:text-white/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complete Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full h-12"
          style={{ backgroundColor: selectedPlan.color }}
        >
          <CreditCard className="h-5 w-5 mr-2" />
          {isProcessing ? "Processing Payment..." : `Complete Payment - ${selectedPlan.price}${selectedPlan.period}`}
        </Button>

        {/* Security Notice */}
        <div className="flex items-center gap-2 text-sm text-purple-200 bg-white/10 p-3 rounded-lg">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </div>
  )
}
