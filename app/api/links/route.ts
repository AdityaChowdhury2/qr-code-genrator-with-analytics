import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateQRCode } from "@/lib/utils/qr-generator"
import { generateShortCode } from "@/lib/utils/code-generator"
import type { CreateLinkRequest, CreateLinkResponse } from "@/lib/types"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { _count: { select: { links: true } } },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check plan limits
    if (user.plan === "FREE" && user._count.links >= 5) {
      return NextResponse.json(
        {
          error: "Free plan limit reached. Upgrade to Premium for unlimited QR codes.",
        },
        { status: 403 },
      )
    }

    const body: CreateLinkRequest = await request.json()
    const { type, destination, vcard, messageText, appDownload } = body

    // Validate required fields based on type
    if (type === "URL" && !destination) {
      return NextResponse.json({ error: "Destination URL is required" }, { status: 400 })
    }
    if (type === "PDF" && !destination) {
      return NextResponse.json({ error: "PDF URL is required" }, { status: 400 })
    }
    if (type === "VCARD" && (!vcard || !vcard.firstName || !vcard.lastName)) {
      return NextResponse.json({ error: "First name and last name are required for vCard" }, { status: 400 })
    }
    if (type === "MESSAGE" && !messageText) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 })
    }
    if (type === "APP_DOWNLOAD" && !appDownload?.iosUrl && !appDownload?.androidUrl) {
      return NextResponse.json({ error: "At least one app store URL is required" }, { status: 400 })
    }

    // Generate unique short code
    let code: string
    let isUnique = false
    let attempts = 0

    do {
      code = generateShortCode()
      const existing = await prisma.link.findUnique({ where: { code } })
      isUnique = !existing
      attempts++
    } while (!isUnique && attempts < 10)

    if (!isUnique) {
      return NextResponse.json({ error: "Failed to generate unique code" }, { status: 500 })
    }

    // Prepare payload based on type
    let payload: string
    switch (type) {
      case "URL":
      case "PDF":
        payload = destination!
        break
      case "VCARD":
        payload = JSON.stringify(vcard)
        break
      case "MESSAGE":
        payload = messageText!
        break
      case "APP_DOWNLOAD":
        payload = JSON.stringify(appDownload)
        break
      default:
        return NextResponse.json({ error: "Invalid link type" }, { status: 400 })
    }

    // Create link in database with user association
    const link = await prisma.link.create({
      data: {
        code,
        type: type as any,
        payload,
        iosUrl: appDownload?.iosUrl,
        androidUrl: appDownload?.androidUrl,
        userId: user.id,
      },
    })

    // Generate QR code (add watermark for free users)
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/r/${code}`
    let qrSvg = await generateQRCode(redirectUrl)

    // Add watermark for free users
    if (user.plan === "FREE") {
      qrSvg = qrSvg.replace(
        "</svg>",
        '<text x="90%" y="95%" font-family="Arial" font-size="8" fill="rgba(0,0,0,0.3)" text-anchor="end">QR Pro</text></svg>',
      )
    }

    const response: CreateLinkResponse = {
      code,
      qrSvg,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Create link error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
