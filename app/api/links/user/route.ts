import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const links = await prisma.link.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { scans: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error("Get user links error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
