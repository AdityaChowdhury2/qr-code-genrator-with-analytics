import QRCode from "qrcode"

export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrSvg = await QRCode.toString(text, {
      type: "svg",
      width: 256,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
    return qrSvg
  } catch (error) {
    console.error("QR Code generation error:", error)
    throw new Error("Failed to generate QR code")
  }
}
