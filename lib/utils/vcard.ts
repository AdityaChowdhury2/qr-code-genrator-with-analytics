import type { VCardFields } from "../types"

export function generateVCard(fields: VCardFields): string {
  const lines = ["BEGIN:VCARD", "VERSION:3.0"]

  // Full name
  const fullName = `${fields.prefix || ""} ${fields.firstName} ${fields.lastName}`.trim()
  lines.push(`FN:${fullName}`)

  // Structured name
  lines.push(`N:${fields.lastName};${fields.firstName};${fields.prefix || ""};;`)

  // Organization and title
  if (fields.organization) {
    lines.push(`ORG:${fields.organization}`)
  }
  if (fields.title) {
    lines.push(`TITLE:${fields.title}`)
  }

  // Contact information
  if (fields.email) {
    lines.push(`EMAIL:${fields.email}`)
  }
  if (fields.phone) {
    lines.push(`TEL;TYPE=WORK:${fields.phone}`)
  }
  if (fields.mobilePhone) {
    lines.push(`TEL;TYPE=CELL:${fields.mobilePhone}`)
  }
  if (fields.fax) {
    lines.push(`TEL;TYPE=FAX:${fields.fax}`)
  }

  // Address
  if (fields.street || fields.city || fields.region || fields.postcode || fields.country) {
    const address = `;;${fields.street || ""};${fields.city || ""};${fields.region || ""};${fields.postcode || ""};${fields.country || ""}`
    lines.push(`ADR;TYPE=WORK:${address}`)
  }

  // Website
  if (fields.website) {
    lines.push(`URL:${fields.website}`)
  }

  lines.push("END:VCARD")

  return lines.join("\r\n")
}
