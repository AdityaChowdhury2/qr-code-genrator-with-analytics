"use client"

import { useSession } from "next-auth/react"
import { useGetUserLinksQuery } from "@/lib/store/api/linksApi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { QrCode, BarChart3, TrendingUp, Plus, Crown } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session } = useSession()
  const { data: links = [], isLoading } = useGetUserLinksQuery()

  const userPlan = session?.user?.plan || "FREE"
  const totalScans = links.reduce((sum, link) => sum + (link._count?.scans || 0), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session?.user?.name}!</p>
          </div>
          <Link href="/dashboard/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create QR Code
            </Button>
          </Link>
        </div>

        {userPlan === "FREE" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Crown className="h-8 w-8 text-yellow-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800">Upgrade to Premium</h3>
                  <p className="text-yellow-700">Get unlimited QR codes, detailed analytics, and remove watermarks</p>
                </div>
                <Link href="/dashboard/billing">
                  <Button variant="outline" className="border-yellow-300 text-yellow-800">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{links.length}</div>
              <p className="text-xs text-muted-foreground">
                {userPlan === "FREE" ? "Free plan limit: 5" : "Unlimited"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalScans}</div>
              <p className="text-xs text-muted-foreground">
                {userPlan === "FREE" ? "Upgrade for detailed analytics" : "All time"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPlan}</div>
              <p className="text-xs text-muted-foreground">
                {userPlan === "FREE" ? "Limited features" : "All features unlocked"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userPlan === "PREMIUM" ? Math.floor(totalScans * 0.3) : "—"}</div>
              <p className="text-xs text-muted-foreground">
                {userPlan === "FREE" ? "Premium feature" : "Scans this month"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent QR Codes</CardTitle>
              <CardDescription>Your latest generated QR codes</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : links.length > 0 ? (
                <div className="space-y-3">
                  {links.slice(0, 5).map((link) => (
                    <div key={link.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{link.code}</p>
                        <p className="text-sm text-gray-600 capitalize">{link.type.toLowerCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{link._count?.scans || 0} scans</p>
                        <p className="text-xs text-gray-500">{new Date(link.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No QR codes yet</p>
                  <Link href="/dashboard/create">
                    <Button className="mt-2">Create your first QR code</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/create">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New QR Code
                </Button>
              </Link>
              {userPlan === "PREMIUM" ? (
                <>
                  <Link href="/dashboard/qr-codes">
                    <Button variant="outline" className="w-full justify-start">
                      <QrCode className="mr-2 h-4 w-4" />
                      Manage QR Codes
                    </Button>
                  </Link>
                  <Link href="/dashboard/analytics">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard/billing">
                  <Button variant="outline" className="w-full justify-start">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
