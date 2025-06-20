import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ScanStats } from "@/lib/types"
import { BarChart3, MapPin, Smartphone, Calendar } from "lucide-react"

async function getStats(code: string): Promise<ScanStats | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/links/${code}/stats`,
      {
        cache: "no-store",
      },
    )

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching stats:", error)
    return null
  }
}

export default async function StatsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const stats = await getStats(code)

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="text-center py-8">
            <h1 className="text-2xl font-bold mb-2">Stats Not Found</h1>
            <p className="text-muted-foreground">The requested link statistics could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">QR Code Analytics</h1>
        <p className="text-muted-foreground">Statistics for code: {code}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topLocations[0]?.location || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{stats.topLocations[0]?.count || 0} scans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Device</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{stats.deviceBreakdown[0]?.device || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{stats.deviceBreakdown[0]?.count || 0} scans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.scansByDay.slice(-7).reduce((sum, day) => sum + day.count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Scans by Day</CardTitle>
            <CardDescription>Daily scan activity over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.scansByDay.slice(-10).map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm">{new Date(day.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="bg-primary h-2 rounded"
                      style={{
                        width: `${Math.max(20, (day.count / Math.max(...stats.scansByDay.map((d) => d.count))) * 100)}px`,
                      }}
                    />
                    <span className="text-sm font-medium w-8 text-right">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
            <CardDescription>Geographic distribution of scans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topLocations.slice(0, 8).map((location) => (
                <div key={location.location} className="flex items-center justify-between">
                  <span className="text-sm">{location.location}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="bg-primary h-2 rounded"
                      style={{
                        width: `${Math.max(20, (location.count / stats.totalScans) * 100)}px`,
                      }}
                    />
                    <span className="text-sm font-medium w-8 text-right">{location.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>Breakdown by device category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.deviceBreakdown.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{device.device}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="bg-primary h-2 rounded"
                      style={{
                        width: `${Math.max(20, (device.count / stats.totalScans) * 100)}px`,
                      }}
                    />
                    <span className="text-sm font-medium w-8 text-right">{device.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
