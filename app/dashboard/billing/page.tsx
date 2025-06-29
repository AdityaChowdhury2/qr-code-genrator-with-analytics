"use client"

import { useSession } from "next-auth/react"
import { useCreateCheckoutSessionMutation } from "@/lib/store/api/authApi"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Check, Zap, BarChart3, QrCode, Shield } from "lucide-react"

const features = {
  free: ["5 QR codes per month", "Basic QR code types", "Standard support", "QR codes with watermark"],
  premium: [
    "Unlimited QR codes",
    "All QR code types",
    "Detailed analytics",
    "No watermarks",
    "Priority support",
    "Custom domains",
    "Bulk generation",
    "Advanced customization",
  ],
}

export default function BillingPage() {
  const { data: session } = useSession()
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation()

  const userPlan = session?.user?.plan || "FREE"

  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckoutSession().unwrap()
      window.location.href = url
    } catch (error) {
      alert("Failed to create checkout session")
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Billing & Plans</h1>
          <p className="text-gray-600">Choose the plan that works best for you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <Card className={userPlan === "FREE" ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Free Plan
                </CardTitle>
                {userPlan === "FREE" && <Badge>Current Plan</Badge>}
              </div>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="text-3xl font-bold">
                $0<span className="text-lg font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {features.free.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {userPlan === "FREE" ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  Downgrade (Contact Support)
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className={userPlan === "PREMIUM" ? "border-primary" : "border-yellow-200"}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Premium Plan
                </CardTitle>
                {userPlan === "PREMIUM" ? (
                  <Badge>Current Plan</Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Most Popular
                  </Badge>
                )}
              </div>
              <CardDescription>For professionals and businesses</CardDescription>
              <div className="text-3xl font-bold">
                $9.99<span className="text-lg font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {features.premium.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {userPlan === "PREMIUM" ? (
                <Button disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button onClick={handleUpgrade} disabled={isLoading} className="w-full">
                  {isLoading ? "Processing..." : "Upgrade to Premium"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
            <CardDescription>See what's included in each plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-sm text-gray-600">
                  Track scans, locations, devices, and time patterns with detailed insights
                </p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">No Watermarks</h3>
                <p className="text-sm text-gray-600">Clean, professional QR codes without any branding or watermarks</p>
              </div>
              <div className="text-center">
                <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold mb-2">Unlimited Generation</h3>
                <p className="text-sm text-gray-600">Create as many QR codes as you need without any monthly limits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {userPlan === "PREMIUM" && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>Manage your Premium subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Premium Plan</p>
                  <p className="text-sm text-gray-600">Billed monthly • Next billing: Jan 15, 2024</p>
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
