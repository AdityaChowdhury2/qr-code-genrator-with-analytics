// server/utils/qr.ts
import { JSDOM } from "jsdom";
import * as nodeCanvas from "canvas";
// pull in the CJS build so it doesn’t assume `window` exists
// @ts-ignore: no types for the CommonJS entrypoint
import { QRCodeStyling } from "qr-code-styling/lib/qr-code-styling.common.js";

import fetch from "node-fetch";

export async function generateFancyQr(text: string): Promise<string> {
  // 1) Fetch the SVG logo, inject width/height if missing
  const logoUrl = "https://bahacrm.com/assets/images/logo.svg";
  let logoSvg = await fetch(logoUrl).then((r) => r.text());

  // Quick & dirty injection of width/height (60px each here)
  if (!/width=/.test(logoSvg)) {
    logoSvg = logoSvg.replace("<svg", `<svg width="60" height="60"`);
  }

  // 2) Build a data URI
  const logoDataUri =
    "data:image/svg+xml;base64," + Buffer.from(logoSvg).toString("base64");

  // 3) Now compose your QR with only jsdom (no canvas needed for pure SVG)
  const qr = new QRCodeStyling({
    jsdom: JSDOM,
    type: "svg",
    data: text,
    width: 300,
    height: 300,
    dotsOptions: { color: "#4b5563", type: "classy" },
    cornersSquareOptions: { color: "#111827", type: "extra-rounded" },
    backgroundOptions: { color: "#f9fafb" },
    image: logoDataUri,
    imageOptions: { margin: 5, imageSize: 0.2 },
  });

  // 4) Generate and return the SVG
  const buffer = await qr.getRawData("svg");
  return buffer.toString("utf-8");
}
