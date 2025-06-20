import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { ScanStats } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params

    // Verify link exists
    const link = await prisma.link.findUnique({
      where: { code },
      include: {
        scans: {
          orderBy: { timestamp: "desc" },
        },
      },
    })

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    const scans = link.scans

    // Calculate stats
    const totalScans = scans.length

    // Scans by day (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentScans = scans.filter((scan) => scan.timestamp >= thirtyDaysAgo)
    const scansByDay = new Map<string, number>()

    recentScans.forEach((scan) => {
      const date = scan.timestamp.toISOString().split("T")[0]
      scansByDay.set(date, (scansByDay.get(date) || 0) + 1)
    })

    const scansByDayArray = Array.from(scansByDay.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Top locations
    const locationCounts = new Map<string, number>()
    scans.forEach((scan) => {
      if (scan.city && scan.country) {
        const location = `${scan.city}, ${scan.country}`
        locationCounts.set(location, (locationCounts.get(location) || 0) + 1)
      }
    })

    const topLocations = Array.from(locationCounts.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Device breakdown
    const deviceCounts = new Map<string, number>()
    scans.forEach((scan) => {
      if (scan.deviceType) {
        deviceCounts.set(scan.deviceType, (deviceCounts.get(scan.deviceType) || 0) + 1)
      }
    })

    const deviceBreakdown = Array.from(deviceCounts.entries())
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count)

    const stats: ScanStats = {
      totalScans,
      scansByDay: scansByDayArray,
      topLocations,
      deviceBreakdown,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
