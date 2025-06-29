export interface VCardFields {
  prefix?: string
  firstName: string
  lastName: string
  organization?: string
  title?: string
  email?: string
  phone?: string
  mobilePhone?: string
  fax?: string
  street?: string
  city?: string
  region?: string
  postcode?: string
  country?: string
  website?: string
}

export interface AppDownload {
  iosUrl?: string
  androidUrl?: string
}

export interface CreateLinkRequest {
  type: "URL" | "PDF" | "VCARD" | "MESSAGE" | "APP_DOWNLOAD"
  destination?: string
  vcard?: VCardFields
  messageText?: string
  appDownload?: AppDownload
}

export interface CreateLinkResponse {
  code: string
  qrSvg: string
}

export interface ScanStats {
  totalScans: number
  scansByDay: { date: string; count: number }[]
  topLocations: { location: string; count: number }[]
  deviceBreakdown: { device: string; count: number }[]
}

export interface User {
  id: string
  name?: string
  email: string
  password?: string
  role: "USER" | "ADMIN"
  plan: "FREE" | "PREMIUM"
  stripeCustomerId?: string
  subscriptionId?: string
  subscriptionStatus?: string
  createdAt: Date
  updatedAt: Date
}
