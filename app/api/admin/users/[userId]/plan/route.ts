import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params
    const { plan } = await request.json()
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!["FREE", "PREMIUM"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { plan },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update user plan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
