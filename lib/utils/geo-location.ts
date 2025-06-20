export async function getGeoLocation(ip: string): Promise<{
  city?: string
  country?: string
}> {
  try {
    // Using a free IP geolocation service
    // In production, you might want to use ipstack or similar
    const response = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await response.json()

    if (data.status === "success") {
      return {
        city: data.city,
        country: data.country,
      }
    }
  } catch (error) {
    console.error("Geo location error:", error)
  }

  return {}
}
