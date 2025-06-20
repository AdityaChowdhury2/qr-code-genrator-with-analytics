export function detectDevice(userAgent: string): {
  deviceType: string
  os: string
} {
  const ua = userAgent.toLowerCase()

  let deviceType = "desktop"
  let os = "unknown"

  // Device detection
  if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
    deviceType = "mobile"
  } else if (/tablet|ipad/i.test(ua)) {
    deviceType = "tablet"
  }

  // OS detection
  if (/windows/i.test(ua)) {
    os = "windows"
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macos"
  } else if (/linux/i.test(ua)) {
    os = "linux"
  } else if (/android/i.test(ua)) {
    os = "android"
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "ios"
  }

  return { deviceType, os }
}
