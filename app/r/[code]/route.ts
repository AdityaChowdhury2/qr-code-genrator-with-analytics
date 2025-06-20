import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { detectDevice } from "@/lib/utils/device-detection"
import { getGeoLocation } from "@/lib/utils/geo-location"
import { generateVCard } from "@/lib/utils/vcard"
import type { VCardFields } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params

    // Find link by code
    const link = await prisma.link.findUnique({
      where: { code },
    })

    if (!link) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Link Not Found</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>404 - Link Not Found</h1>
            <p>The requested link could not be found.</p>
          </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html" } },
      )
    }

    // Get client information for analytics
    const userAgent = request.headers.get("user-agent") || ""
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1"

    const { deviceType, os } = detectDevice(userAgent)
    const { city, country } = await getGeoLocation(ipAddress.split(",")[0])

    // Log the scan
    await prisma.scan.create({
      data: {
        linkId: link.id,
        ipAddress,
        userAgent,
        deviceType,
        os,
        city,
        country,
      },
    })

    // Handle different link types
    switch (link.type) {
      case "URL":
        return NextResponse.redirect(link.payload, 301)

      case "PDF":
        return NextResponse.redirect(link.payload, 301)

      case "VCARD": {
        const vcardData: VCardFields = JSON.parse(link.payload)
        const vcardContent = generateVCard(vcardData)

        return new NextResponse(vcardContent, {
          headers: {
            "Content-Type": "text/vcard; charset=utf-8",
            "Content-Disposition": `attachment; filename="${vcardData.firstName}_${vcardData.lastName}.vcf"`,
          },
        })
      }

      case "MESSAGE": {
        const messageHtml = `<!DOCTYPE html>
        <html>
          <head>
            <title>Message</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .message { background: #f5f5f5; padding: 20px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="message">
              <h2>Message</h2>
              <p>${link.payload.replace(/\n/g, "<br>")}</p>
            </div>
            <p><small>Scan your code to view this message</small></p>
          </body>
        </html>`

        return new NextResponse(messageHtml, {
          headers: { "Content-Type": "text/html" },
        })
      }

      case "APP_DOWNLOAD": {
        const appData = JSON.parse(link.payload)

        // Detect user's OS and redirect accordingly
        if (os === "ios" && appData.iosUrl) {
          return NextResponse.redirect(appData.iosUrl, 301)
        } else if (os === "android" && appData.androidUrl) {
          return NextResponse.redirect(appData.androidUrl, 301)
        } else {
          // Show landing page with both options
          const landingHtml = `<!DOCTYPE html>
          <html>
            <head>
              <title>Download App</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { font-family: Arial, sans-serif; max-width: 400px; margin: 50px auto; padding: 20px; text-align: center; }
                .store-button { display: inline-block; margin: 10px; padding: 12px 24px; background: #007AFF; color: white; text-decoration: none; border-radius: 8px; }
                .store-button:hover { background: #0056CC; }
              </style>
            </head>
            <body>
              <h2>Download Our App</h2>
              <p>Choose your platform:</p>
              ${appData.iosUrl ? `<a href="${appData.iosUrl}" class="store-button">Download for iOS</a>` : ""}
              ${appData.androidUrl ? `<a href="${appData.androidUrl}" class="store-button">Download for Android</a>` : ""}
              <p><small>Scan your code to download</small></p>
            </body>
          </html>`

          return new NextResponse(landingHtml, {
            headers: { "Content-Type": "text/html" },
          })
        }
      }

      default:
        return NextResponse.json({ error: "Invalid link type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Redirect error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
