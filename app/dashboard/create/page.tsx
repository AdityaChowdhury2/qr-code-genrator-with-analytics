"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useCreateLinkMutation } from "@/lib/store/api/linksApi"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CreateLinkRequest, CreateLinkResponse, VCardFields, AppDownload } from "@/lib/types"
import { QrCode, Link, FileText, MessageSquare, Smartphone, Crown } from "lucide-react"

export default function CreateQRPage() {
  const { data: session } = useSession()
  const [createLink, { isLoading }] = useCreateLinkMutation()
  const [linkType, setLinkType] = useState<"URL" | "PDF" | "VCARD" | "MESSAGE" | "APP_DOWNLOAD">("URL")
  const [result, setResult] = useState<CreateLinkResponse | null>(null)

  const userPlan = session?.user?.plan || "FREE"

  // Form states
  const [destination, setDestination] = useState("")
  const [messageText, setMessageText] = useState("")
  const [vcard, setVcard] = useState<VCardFields>({
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    email: "",
    phone: "",
    mobilePhone: "",
    website: "",
  })
  const [appDownload, setAppDownload] = useState<AppDownload>({
    iosUrl: "",
    androidUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const requestData: CreateLinkRequest = {
        type: linkType,
        destination: linkType === "URL" || linkType === "PDF" ? destination : undefined,
        vcard: linkType === "VCARD" ? vcard : undefined,
        messageText: linkType === "MESSAGE" ? messageText : undefined,
        appDownload: linkType === "APP_DOWNLOAD" ? appDownload : undefined,
      }

      const response = await createLink(requestData).unwrap()
      setResult(response)
    } catch (error: any) {
      alert(error.data?.error || "Failed to create QR code")
    }
  }

  const resetForm = () => {
    setResult(null)
    setDestination("")
    setMessageText("")
    setVcard({
      firstName: "",
      lastName: "",
      organization: "",
      title: "",
      email: "",
      phone: "",
      mobilePhone: "",
      website: "",
    })
    setAppDownload({
      iosUrl: "",
      androidUrl: "",
    })
  }

  if (result) {
    const shortUrl = `${window.location.origin}/r/${result.code}`

    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <QrCode className="h-6 w-6" />
                QR Code Generated!
              </CardTitle>
              <CardDescription>Your QR code is ready to use</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="inline-block p-4 bg-white border rounded-lg relative">
                  <div dangerouslySetInnerHTML={{ __html: result.qrSvg }} />
                  {userPlan === "FREE" && (
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                      QR Pro
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short URL</Label>
                <div className="flex gap-2">
                  <Input value={shortUrl} readOnly />
                  <Button onClick={() => navigator.clipboard.writeText(shortUrl)} variant="outline">
                    Copy
                  </Button>
                </div>
              </div>

              {userPlan === "FREE" && (
                <Alert>
                  <Crown className="h-4 w-4" />
                  <AlertDescription>
                    Upgrade to Premium to remove watermarks and access detailed analytics.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={resetForm} className="flex-1">
                  Create Another
                </Button>
                {userPlan === "PREMIUM" && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/dashboard/qr-codes`, "_blank")}
                    className="flex-1"
                  >
                    View All QR Codes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create QR Code</h1>
          <p className="text-gray-600">Generate QR codes for various content types</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-6 w-6" />
              QR Code Generator
            </CardTitle>
            <CardDescription>Choose your content type and fill in the details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={linkType} onValueChange={(value: any) => setLinkType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="URL">
                      <div className="flex items-center gap-2">
                        <Link className="h-4 w-4" />
                        Website URL
                      </div>
                    </SelectItem>
                    <SelectItem value="PDF">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF Document
                      </div>
                    </SelectItem>
                    <SelectItem value="VCARD">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        Contact Card
                      </div>
                    </SelectItem>
                    <SelectItem value="MESSAGE">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Text Message
                      </div>
                    </SelectItem>
                    <SelectItem value="APP_DOWNLOAD">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        App Download
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {linkType === "URL" && (
                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              )}

              {linkType === "PDF" && (
                <div className="space-y-2">
                  <Label htmlFor="pdf">PDF URL</Label>
                  <Input
                    id="pdf"
                    type="url"
                    placeholder="https://example.com/document.pdf"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              )}

              {linkType === "MESSAGE" && (
                <div className="space-y-2">
                  <Label htmlFor="message">Message Text</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message here..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    required
                    rows={4}
                  />
                </div>
              )}

              {linkType === "VCARD" && (
                <div className="space-y-4">
                  <Label>Contact Information</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={vcard.firstName}
                        onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={vcard.lastName}
                        onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={vcard.organization}
                        onChange={(e) => setVcard({ ...vcard, organization: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={vcard.title}
                        onChange={(e) => setVcard({ ...vcard, title: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={vcard.email}
                        onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={vcard.phone}
                        onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={vcard.website}
                      onChange={(e) => setVcard({ ...vcard, website: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {linkType === "APP_DOWNLOAD" && (
                <div className="space-y-4">
                  <Label>App Store URLs</Label>
                  <div>
                    <Label htmlFor="iosUrl">iOS App Store URL</Label>
                    <Input
                      id="iosUrl"
                      type="url"
                      placeholder="https://apps.apple.com/app/..."
                      value={appDownload.iosUrl}
                      onChange={(e) => setAppDownload({ ...appDownload, iosUrl: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="androidUrl">Google Play Store URL</Label>
                    <Input
                      id="androidUrl"
                      type="url"
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      value={appDownload.androidUrl}
                      onChange={(e) => setAppDownload({ ...appDownload, androidUrl: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Generating..." : "Generate QR Code"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
