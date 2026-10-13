// FILE: lib/brandedQr.ts
import QRCode from "qrcode";

export interface BrandedQrOptions {
  payloadText: string;
  voucherCode: string;
  guestName: string;
  arrivalDate: string;
  arrivalTime: string;
  departureTime: string;
  zoneOrPlan?: string;
  rateCategory?: string;
}

/**
 * Generates a high-resolution, branded PNG Data URL with:
 * 1. Error-corrected QR matrix (Level 'H' - 30% redundancy)
 * 2. An FNJ Gold & Navy brand medallion embedded in the center of the QR matrix
 * 3. Formal branded header: FNJ COWORKING & PICKLEBALL
 * 4. Crisp reservation Date & Time banner directly integrated onto the pass graphic
 * 5. Official voucher code and reception desk instruction
 */
export async function generateBrandedQrDataUrl(
  options: BrandedQrOptions
): Promise<string> {
  const {
    payloadText,
    voucherCode,
    guestName,
    arrivalDate,
    arrivalTime,
    departureTime,
    zoneOrPlan = "Coworking Space Rental",
    rateCategory,
  } = options;

  if (typeof window === "undefined") {
    return "";
  }

  // 1. Generate QR matrix onto an offscreen canvas with Error Correction 'H'
  const qrCanvas = document.createElement("canvas");
  await QRCode.toCanvas(qrCanvas, payloadText, {
    width: 320,
    margin: 2,
    errorCorrectionLevel: "H", // High redundancy allows up to 30% center overlay without scan loss
    color: {
      dark: "#0A192F",
      light: "#FFFFFF",
    },
  });

  // 2. Create the final ticket badge canvas (Total dimensions: 460 x 620 px for crisp retina display)
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return qrCanvas.toDataURL("image/png");

  const width = 460;
  const height = 620;
  canvas.width = width;
  canvas.height = height;

  // Background - Crisp White
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  // Outer border with subtle corner inset
  ctx.strokeStyle = "#0A192F";
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Inner thin gold pinstripe
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(9, 9, width - 18, height - 18);

  // Top Navy Header Bar
  ctx.fillStyle = "#0A192F";
  ctx.fillRect(10, 10, width - 20, 84);

  // Gold accent strip below header
  ctx.fillStyle = "#D4AF37";
  ctx.fillRect(10, 94, width - 20, 4);

  // Top Header Branding Text
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("★ OFFICIAL ACCESS PASS ★", width / 2, 34);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 19px system-ui, -apple-system, sans-serif";
  ctx.fillText("FNJ COWORKING & PICKLEBALL", width / 2, 59);

  ctx.fillStyle = "#E5E7EB";
  ctx.font = "500 11px system-ui, -apple-system, sans-serif";
  ctx.fillText("2F Biak Realty Corp. • Lakandula Dr., Daraga, Albay", width / 2, 78);

  // 3. Draw the QR matrix centered
  const qrSize = 290;
  const qrX = (width - qrSize) / 2;
  const qrY = 114;
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // 4. DRAW THE FNJ CENTER LOGO EMBLEM ON TOP OF THE QR MATRIX
  const centerSize = 68;
  const centerX = width / 2;
  const centerY = qrY + qrSize / 2;

  // White protective cutout disc to prevent QR dot interference
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerSize / 2 + 5, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#D4AF37";
  ctx.stroke();

  // Navy inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = "#0A192F";
  ctx.fill();

  // FNJ Gold text inside the center badge
  ctx.fillStyle = "#D4AF37";
  ctx.font = "900 20px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("FNJ", centerX, centerY - 2);

  // Small star underneath FNJ monogram
  ctx.font = "8px system-ui, -apple-system, sans-serif";
  ctx.fillText("★ ALBAY ★", centerX, centerY + 14);
  ctx.restore();

  // 5. RESERVATION DETAILS CONTAINER AT BOTTOM OF PASS (DATE & TIME FOCUS)
  const bottomY = 422;
  const boxHeight = 175;

  // Cream/Beige info container
  ctx.fillStyle = "#FAF8F0";
  ctx.fillRect(20, bottomY, width - 40, boxHeight);

  // Thin gold/stone border around details box
  ctx.strokeStyle = "#E6DFCD";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(20, bottomY, width - 40, boxHeight);

  // Top highlight bar inside container: DATE & TIME PROMINENT
  ctx.fillStyle = "#0A192F";
  ctx.fillRect(20, bottomY, width - 40, 32);

  // Date and Time header text
  ctx.fillStyle = "#D4AF37";
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("📅 " + (arrivalDate || "RESERVED DATE"), 32, bottomY + 20);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("⏰ " + (arrivalTime ? `${arrivalTime} – ${departureTime}` : "TIME TBD"), width - 32, bottomY + 20);

  // Detail Lines
  // Line 1: Guest Name & Voucher Code
  ctx.fillStyle = "#0A192F";
  ctx.font = "bold 13px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  const displayName = guestName ? (guestName.length > 22 ? guestName.slice(0, 22) + "…" : guestName) : "Registered Albay Guest";
  ctx.fillText("Guest: " + displayName, 32, bottomY + 56);

  ctx.fillStyle = "#0A192F";
  ctx.font = "900 12px monospace";
  ctx.textAlign = "right";
  ctx.fillText(voucherCode || "FNJ-PASS", width - 32, bottomY + 56);

  // Line 2: Dividing dashed line
  ctx.strokeStyle = "#D1D5DB";
  ctx.beginPath();
  ctx.setLineDash([3, 3]);
  ctx.moveTo(32, bottomY + 68);
  ctx.lineTo(width - 32, bottomY + 68);
  ctx.stroke();
  ctx.setLineDash([]);

  // Line 3: Workspace Plan / Zone
  ctx.fillStyle = "#4B5563";
  ctx.font = "600 11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("Workspace Zone:", 32, bottomY + 88);

  ctx.fillStyle = "#0A192F";
  ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
  const planShort = zoneOrPlan.length > 24 ? zoneOrPlan.slice(0, 24) + "…" : zoneOrPlan;
  ctx.fillText(planShort, 150, bottomY + 88);

  // Line 4: Reservation Schedule Details
  ctx.fillStyle = "#4B5563";
  ctx.font = "600 11px system-ui, -apple-system, sans-serif";
  ctx.fillText("Slot Duration:", 32, bottomY + 110);

  ctx.fillStyle = "#0A192F";
  ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${arrivalTime} to ${departureTime}`, 150, bottomY + 110);

  // Line 5: Rate Tier / Status
  ctx.fillStyle = "#4B5563";
  ctx.font = "600 11px system-ui, -apple-system, sans-serif";
  ctx.fillText("Access Level:", 32, bottomY + 132);

  ctx.fillStyle = "#B8952B";
  ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
  ctx.fillText(rateCategory || "Guaranteed Workspace Seating", 150, bottomY + 132);

  // Bottom Notice
  ctx.fillStyle = "#6B7280";
  ctx.font = "500 10px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Show this QR pass upon arrival at 2F Biak Realty Reception desk", width / 2, bottomY + 158);

  return canvas.toDataURL("image/png");
}
