import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ── Brand ──────────────────────────────────────────── */
const BRAND = "FOKUSWERK";
const SITE = "https://fokuswerk.de";
const FROM = `${BRAND} <noreply@aldenairperfumes.de>`;
const KU = "Gem\u00E4\u00DF \u00A7 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).";
const LOGO_URL = "https://lzyoxywwryzsxhxpjeeu.supabase.co/storage/v1/object/public/brand-assets/logo.png";
const CONTACT_EMAIL = "support@fokuswerk.com";
const COMPANY_ADDR = "FOKUSWERK \u00B7 Patric-Maurice Schmidt \u00B7 BGM.-Scheller-Str 14 \u00B7 96215 Lichtenfels";

/* ── PDF helpers ────────────────────────────────────── */
const GREY = rgb(0.45, 0.45, 0.45);
const BLACK = rgb(0.055, 0.055, 0.055);
const LIGHT = rgb(0.64, 0.64, 0.64);

let _cachedLogoPng: Uint8Array | null = null;
async function fetchLogo(): Promise<Uint8Array | null> {
  if (_cachedLogoPng) return _cachedLogoPng;
  try {
    const res = await fetch(LOGO_URL);
    if (!res.ok) return null;
    _cachedLogoPng = new Uint8Array(await res.arrayBuffer());
    return _cachedLogoPng;
  } catch { return null; }
}

async function drawPdfLogo(doc: any, page: any, fontBold: any, y: number, lm: number, rm: number): Promise<number> {
  const logoBytes = await fetchLogo();
  if (logoBytes) {
    const logoImage = await doc.embedPng(logoBytes);
    const logoHeight = 30;
    const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
    const cx = lm + (rm - lm - logoWidth) / 2;
    page.drawImage(logoImage, { x: cx, y: y - logoHeight, width: logoWidth, height: logoHeight });
    return y - logoHeight - 25;
  }
  // Fallback to text
  const logoText = "F O K U S W E R K";
  const tw = fontBold.widthOfTextAtSize(logoText, 12);
  page.drawText(logoText, { x: lm + (rm - lm - tw) / 2, y: y - 14, size: 12, font: fontBold, color: BLACK });
  return y - 45;
}

async function createInvoicePdf(data: any): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595.28, 841.89]); // A4
  const { height } = page.getSize();
  let y = height - 40;
  const lm = 50; // left margin
  const rm = 545; // right edge

  const date = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const invoiceNr = `RE-${(data.orderId || "000000").slice(0, 8).toUpperCase()}`;

  // Logo
  y = await drawPdfLogo(doc, page, fontBold, y, lm, rm);

  // Address block
  page.drawText("Rechnungsadresse:", { x: lm, y, size: 8, font, color: GREY });
  page.drawText(`Rechnungsnr: ${invoiceNr}`, { x: 370, y, size: 8, font, color: GREY });
  y -= 14;
  page.drawText(data.customerName || "\u2014", { x: lm, y, size: 10, font: fontBold, color: BLACK });
  page.drawText(`Datum: ${date}`, { x: 370, y, size: 8, font, color: GREY });
  y -= 13;
  const addr = data.shippingAddress || {};
  page.drawText(addr.street || "", { x: lm, y, size: 9, font, color: BLACK });
  page.drawText(`Bestellnr: #${(data.orderId || "").slice(0, 8)}`, { x: 370, y, size: 8, font, color: GREY });
  y -= 13;
  page.drawText(`${addr.zip || ""} ${addr.city || ""}`, { x: lm, y, size: 9, font, color: BLACK });
  y -= 13;
  page.drawText(addr.country || "Deutschland", { x: lm, y, size: 9, font, color: BLACK });
  y -= 35;

  // Table header line
  page.drawLine({ start: { x: lm, y }, end: { x: rm, y }, thickness: 1.5, color: BLACK });
  y -= 14;
  page.drawText("ARTIKEL", { x: lm, y, size: 7, font: fontBold, color: GREY });
  page.drawText("MENGE", { x: 370, y, size: 7, font: fontBold, color: GREY });
  page.drawText("BETRAG", { x: 490, y, size: 7, font: fontBold, color: GREY });
  y -= 8;
  page.drawLine({ start: { x: lm, y }, end: { x: rm, y }, thickness: 0.5, color: LIGHT });
  y -= 16;

  // Items
  const items: any[] = data.items || [];
  for (const item of items) {
    const total = (item.price * item.quantity).toFixed(2).replace(".", ",") + " \u20AC";
    page.drawText(item.name || "", { x: lm, y, size: 9, font, color: BLACK });
    page.drawText(String(item.quantity), { x: 385, y, size: 9, font, color: BLACK });
    page.drawText(total, { x: 490, y, size: 9, font, color: BLACK });
    y -= 18;
    page.drawLine({ start: { x: lm, y: y + 6 }, end: { x: rm, y: y + 6 }, thickness: 0.3, color: LIGHT });
  }

  const shipping = Number(data.shipping || 0);
  const subtotal = Number(data.subtotal || data.total || 0);
  const shippingLabel = shipping === 0 ? "Kostenlos" : `${shipping.toFixed(2).replace(".", ",")} \u20AC`;

  y -= 10;
  // Subtotal
  page.drawText("Zwischensumme", { x: 370, y, size: 9, font, color: GREY });
  page.drawText(`${subtotal.toFixed(2).replace(".", ",")} \u20AC`, { x: 490, y, size: 9, font, color: BLACK });
  y -= 16;
  page.drawText("Versand", { x: 370, y, size: 9, font, color: GREY });
  page.drawText(shippingLabel, { x: 490, y, size: 9, font, color: BLACK });
  y -= 16;
  page.drawText("MwSt.", { x: 370, y, size: 9, font, color: GREY });
  page.drawText("0,00 \u20AC", { x: 490, y, size: 9, font, color: BLACK });
  y -= 10;
  page.drawLine({ start: { x: 370, y }, end: { x: rm, y }, thickness: 1.5, color: BLACK });
  y -= 16;
  page.drawText("Gesamtbetrag", { x: 370, y, size: 10, font: fontBold, color: BLACK });
  page.drawText(`${Number(data.total).toFixed(2).replace(".", ",")} \u20AC`, { x: 490, y, size: 10, font: fontBold, color: BLACK });

  y -= 40;
  page.drawText(KU, { x: lm, y, size: 7.5, font: fontBold, color: GREY });
  y -= 14;
  page.drawText(`Zahlungsweise: ${data.paymentMethod === "paypal" ? "PayPal" : "Kreditkarte (Stripe)"}`, { x: lm, y, size: 7.5, font, color: GREY });

  y -= 30;
  page.drawLine({ start: { x: lm, y }, end: { x: rm, y }, thickness: 0.3, color: LIGHT });
  y -= 14;
  page.drawText(`${BRAND} \u00B7 ${CONTACT_EMAIL}`, { x: lm, y, size: 7, font, color: LIGHT });

  return await doc.save();
}

async function createAgbPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage([595.28, 841.89]);
  const { height } = page.getSize();
  let y = height - 40;
  const lm = 50;
  const rm = 545;
  const maxW = 495;

  y = await drawPdfLogo(doc, page, fontBold, y, lm, rm);

  const title = (t: string) => {
    if (y < 80) { page = doc.addPage([595.28, 841.89]); y = height - 50; }
    page.drawText(t, { x: lm, y, size: 10, font: fontBold, color: BLACK }); y -= 18;
  };
  const para = (t: string) => {
    const words = t.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, 9) > maxW) {
        if (y < 50) { page = doc.addPage([595.28, 841.89]); y = height - 50; }
        page.drawText(line, { x: lm, y, size: 9, font, color: BLACK }); y -= 13; line = w;
      } else { line = test; }
    }
    if (line) {
      if (y < 50) { page = doc.addPage([595.28, 841.89]); y = height - 50; }
      page.drawText(line, { x: lm, y, size: 9, font, color: BLACK }); y -= 13;
    }
    y -= 6;
  };

  page.drawText("Allgemeine Gesch\u00E4ftsbedingungen", { x: lm, y, size: 14, font: fontBold, color: BLACK });
  y -= 10;
  page.drawText(COMPANY_ADDR, { x: lm, y, size: 7, font, color: GREY });
  y -= 25;

  title("\u00A7 1 Geltungsbereich");
  para("(1) Diese Allgemeinen Gesch\u00E4ftsbedingungen (nachfolgend \u201EAGB\u201C) gelten f\u00FCr alle Vertr\u00E4ge, die ein Verbraucher oder Unternehmer (nachfolgend \u201EKunde\u201C) mit FOKUSWERK, Patric-Maurice Schmidt, BGM.-Scheller-Str 14, 96215 Lichtenfels (nachfolgend \u201EAnbieter\u201C) \u00FCber den Onlineshop unter fokuswerk.de schlie\u00DFt.");
  para("(2) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdr\u00FCcklich schriftlich zu.");
  para("(3) Verbraucher im Sinne dieser AGB ist jede nat\u00FCrliche Person, die ein Rechtsgesch\u00E4ft zu Zwecken abschlie\u00DFt, die \u00FCberwiegend weder ihrer gewerblichen noch ihrer selbst\u00E4ndigen beruflichen T\u00E4tigkeit zugerechnet werden k\u00F6nnen (\u00A7 13 BGB).");

  title("\u00A7 2 Vertragsschluss");
  para("(1) Die Darstellung der Produkte im Onlineshop stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Bestellung dar.");
  para('(2) Durch Klicken auf \u201EBestellung aufgeben\u201C gibt der Kunde ein verbindliches Angebot zum Kauf der im Warenkorb befindlichen Artikel ab.');
  para("(3) Der Vertrag kommt zustande, wenn der Anbieter das Angebot durch eine Bestellbest\u00E4tigung per E-Mail annimmt oder die Ware ausliefert.");

  title("\u00A7 3 Preise und Zahlung");
  para("(1) Alle angegebenen Preise sind Endpreise und enthalten keine Umsatzsteuer. Gem\u00E4\u00DF \u00A7 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).");
  para("(2) Versandkosten werden vor Abschluss der Bestellung gesondert ausgewiesen. Der Versand innerhalb der EU ist kostenlos.");
  para("(3) Die Zahlung erfolgt wahlweise per Kreditkarte (Stripe), PayPal, Apple Pay oder Google Pay. Die Zahlung wird unmittelbar nach Vertragsschluss f\u00E4llig.");

  title("\u00A7 4 Lieferung und Versand");
  para("(1) Die Lieferung erfolgt an die vom Kunden angegebene Lieferadresse innerhalb der Europ\u00E4ischen Union.");
  para("(2) Die voraussichtliche Lieferzeit betr\u00E4gt 5 bis 8 Werktage ab Vertragsschluss, sofern nicht anders angegeben.");
  para("(3) Sollte die bestellte Ware nicht verf\u00FCgbar sein, ist der Anbieter zu Teillieferungen berechtigt, wenn dies f\u00FCr den Kunden zumutbar ist.");

  title("\u00A7 5 Eigentumsvorbehalt");
  para("Die gelieferte Ware bleibt bis zur vollst\u00E4ndigen Bezahlung des Kaufpreises Eigentum des Anbieters.");

  title("\u00A7 6 M\u00E4ngelhaftung / Gew\u00E4hrleistung");
  para("(1) Es gelten die gesetzlichen M\u00E4ngelanspr\u00FCche. Die Verj\u00E4hrungsfrist f\u00FCr M\u00E4ngelanspr\u00FCche bei neuen Sachen betr\u00E4gt zwei Jahre ab Erhalt der Ware.");
  para("(2) Offensichtliche M\u00E4ngel sind innerhalb von zwei Wochen nach Erhalt der Ware schriftlich anzuzeigen.");

  title("\u00A7 7 Haftung");
  para("(1) Der Anbieter haftet unbeschr\u00E4nkt f\u00FCr Vorsatz und grobe Fahrl\u00E4ssigkeit.");
  para("(2) Bei leichter Fahrl\u00E4ssigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und beschr\u00E4nkt auf den vertragstypischen, vorhersehbaren Schaden.");
  para("(3) Die vorstehenden Haftungsbeschr\u00E4nkungen gelten nicht bei Verletzung von Leben, K\u00F6rper und Gesundheit.");

  title("\u00A7 8 Datenschutz");
  para("Informationen zur Verarbeitung personenbezogener Daten finden sich in der Datenschutzerkl\u00E4rung unter fokuswerk.de/datenschutz.");

  title("\u00A7 9 Streitbeilegung");
  para("Die Europ\u00E4ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr/. Der Anbieter ist weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.");

  title("\u00A7 10 Schlussbestimmungen");
  para("(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.");
  para("(2) Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der \u00FCbrigen Bestimmungen unber\u00FChrt.");

  y -= 20;
  page.drawText("Stand: Februar 2026", { x: lm, y, size: 7, font, color: LIGHT });

  return await doc.save();
}

async function createReturnsPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = doc.addPage([595.28, 841.89]);
  const { height } = page.getSize();
  let y = height - 40;
  const lm = 50;
  const rm = 545;
  const maxW = 495;

  y = await drawPdfLogo(doc, page, fontBold, y, lm, rm);

  const title = (t: string) => {
    if (y < 80) { page = doc.addPage([595.28, 841.89]); y = height - 50; }
    page.drawText(t, { x: lm, y, size: 10, font: fontBold, color: BLACK }); y -= 18;
  };
  const para = (t: string) => {
    const words = t.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, 9) > maxW) {
        if (y < 50) { page = doc.addPage([595.28, 841.89]); y = height - 50; }
        page.drawText(line, { x: lm, y, size: 9, font, color: BLACK }); y -= 13; line = w;
      } else { line = test; }
    }
    if (line) {
      if (y < 50) { page = doc.addPage([595.28, 841.89]); y = height - 50; }
      page.drawText(line, { x: lm, y, size: 9, font, color: BLACK }); y -= 13;
    }
    y -= 6;
  };

  page.drawText("Widerrufsbelehrung", { x: lm, y, size: 14, font: fontBold, color: BLACK });
  y -= 10;
  page.drawText(COMPANY_ADDR, { x: lm, y, size: 7, font, color: GREY });
  y -= 25;

  title("Widerrufsrecht");
  para("Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gr\u00FCnden diesen Vertrag zu widerrufen.");
  para("Die Widerrufsfrist betr\u00E4gt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Bef\u00F6rderer ist, die Waren in Besitz genommen haben bzw. hat.");
  para("Um Ihr Widerrufsrecht auszu\u00FCben, m\u00FCssen Sie uns (FOKUSWERK, Patric-Maurice Schmidt, BGM.-Scheller-Str 14, 96215 Lichtenfels, E-Mail: support@fokuswerk.com) mittels einer eindeutigen Erkl\u00E4rung (z. B. ein mit der Post versandter Brief oder E-Mail) \u00FCber Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.");
  para("Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung \u00FCber die Aus\u00FCbung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.");

  title("Folgen des Widerrufs");
  para("Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschlie\u00DFlich der Lieferkosten (mit Ausnahme der zus\u00E4tzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, g\u00FCnstigste Standardlieferung gew\u00E4hlt haben), unverz\u00FCglich und sp\u00E4testens binnen vierzehn Tagen ab dem Tag zur\u00FCckzuzahlen, an dem die Mitteilung \u00FCber Ihren Widerruf dieses Vertrags bei uns eingegangen ist.");
  para("F\u00FCr diese R\u00FCckzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der urspr\u00FCnglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdr\u00FCcklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser R\u00FCckzahlung Entgelte berechnet.");
  para("Wir k\u00F6nnen die R\u00FCckzahlung verweigern, bis wir die Waren wieder zur\u00FCckerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zur\u00FCckgesandt haben, je nachdem, welches der fr\u00FChere Zeitpunkt ist.");

  title("R\u00FCcksendung");
  para("Sie haben die Waren unverz\u00FCglich und in jedem Fall sp\u00E4testens binnen vierzehn Tagen ab dem Tag, an dem Sie uns \u00FCber den Widerruf dieses Vertrags unterrichten, an uns (FOKUSWERK, BGM.-Scheller-Str 14, 96215 Lichtenfels) zur\u00FCckzusenden oder zu \u00FCbergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.");
  para("Sie tragen die unmittelbaren Kosten der R\u00FCcksendung der Waren.");
  para("Sie m\u00FCssen f\u00FCr einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Pr\u00FCfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zur\u00FCckzuf\u00FChren ist.");

  title("Ausschluss des Widerrufsrechts");
  para("Das Widerrufsrecht besteht nicht bei Vertr\u00E4gen zur Lieferung versiegelter Waren, die aus Gr\u00FCnden des Gesundheitsschutzes oder der Hygiene nicht zur R\u00FCckgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde.");

  y -= 20;
  page.drawText("Stand: Februar 2026", { x: lm, y, size: 7, font, color: LIGHT });

  return await doc.save();
}

/* ── Uint8Array to base64 ───────────────────────────── */
function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/* ── Shared email layout ────────────────────────────── */
const layout = (content: string) => `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <tr><td style="padding:32px 40px 24px;background:#0e0e0e;text-align:center">
          <span style="font-size:13px;letter-spacing:0.4em;font-weight:700;color:#ffffff;text-transform:uppercase">${BRAND}</span>
        </td></tr>
        <tr><td style="background:#ffffff;padding:40px">${content}</td></tr>
        <tr><td style="padding:24px 40px;background:#ffffff;border-top:1px solid #e5e5e5">
          <p style="font-size:11px;color:#a3a3a3;margin:0;line-height:1.6;text-align:center">
            ${BRAND} · ${KU}<br>
            <a href="${SITE}/impressum" style="color:#a3a3a3;text-decoration:underline">Impressum</a> · 
            <a href="${SITE}/datenschutz" style="color:#a3a3a3;text-decoration:underline">Datenschutz</a> · 
            <a href="${SITE}/agb" style="color:#a3a3a3;text-decoration:underline">AGB</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const cta = (label: string, url: string) =>
  `<a href="${url}" style="display:inline-block;margin-top:24px;padding:14px 32px;background:#0e0e0e;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600">${label}</a>`;
const greeting = (name: string) =>
  `<p style="font-size:15px;font-weight:600;color:#0e0e0e;margin:0 0 4px">Hallo ${name},</p>`;
const subtext = (text: string) =>
  `<p style="font-size:13px;color:#737373;margin:0 0 24px;line-height:1.7">${text}</p>`;
const divider = `<hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0">`;

/* ── Main handler ───────────────────────────────────── */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data } = await req.json();
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) throw new Error("Resend API key not configured");

    let subject = "";
    let html = "";
    let attachments: { filename: string; content: string }[] = [];

    if (type === "order_confirmation") {
      subject = `Bestellbestätigung #${(data.orderId || "").slice(0, 8).toUpperCase()} — ${BRAND}`;
      const shipping = Number(data.shipping || 0);
      const shippingLabel = shipping === 0 ? "Kostenlos" : `${shipping.toFixed(2).replace(".", ",")} €`;
      const subtotal = Number(data.subtotal || data.total || 0);

      const itemsHtml = (data.items || [])
        .map((i: any) =>
          `<tr>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#0e0e0e;width:60%">${i.name}</td>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#737373;text-align:center;width:15%;white-space:nowrap">× ${i.quantity}</td>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#0e0e0e;text-align:right;font-weight:500;width:25%;white-space:nowrap">${(i.price * i.quantity).toFixed(2).replace(".", ",")} €</td>
          </tr>`).join("");

      html = layout(`
        ${greeting(data.customerName || "Kunde")}
        ${subtext("Vielen Dank für deine Bestellung. Wir haben alles erhalten und bereiten den Versand vor.")}
        <div style="background:#fafafa;padding:20px;margin-bottom:24px">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 12px;font-weight:600">Bestellübersicht</p>
          <table style="width:100%;border-collapse:collapse;table-layout:fixed">${itemsHtml}</table>
          <table style="width:100%;margin-top:16px;border-collapse:collapse">
            <tr><td style="font-size:13px;color:#737373;padding:6px 0">Zwischensumme</td><td style="font-size:13px;text-align:right;color:#0e0e0e;padding:6px 0">${subtotal.toFixed(2).replace(".", ",")} €</td></tr>
            <tr><td style="font-size:13px;color:#737373;padding:6px 0">Versand</td><td style="font-size:13px;text-align:right;color:#737373;padding:6px 0">${shippingLabel}</td></tr>
            <tr><td colspan="2" style="padding:0"><hr style="border:none;border-top:1px solid #e5e5e5;margin:8px 0"></td></tr>
            <tr><td style="font-size:14px;font-weight:700;color:#0e0e0e;padding:6px 0">Gesamt</td><td style="font-size:14px;font-weight:700;text-align:right;color:#0e0e0e;padding:6px 0">${Number(data.total).toFixed(2).replace(".", ",")} €</td></tr>
          </table>
        </div>
        <p style="font-size:11px;color:#a3a3a3;margin:0">${KU}</p>
        ${divider}
        <p style="font-size:13px;color:#737373;margin:0;line-height:1.7">Kostenloser Versand innerhalb der EU — 5 bis 8 Werktage.<br>Du erhältst eine separate E-Mail mit Tracking-Informationen.</p>
        ${cta("Bestellung ansehen", `${data.siteUrl || SITE}/account`)}
      `);

      // Generate real PDFs
      const [invoiceBytes, agbBytes, returnsBytes] = await Promise.all([
        createInvoicePdf(data),
        createAgbPdf(),
        createReturnsPdf(),
      ]);

      attachments = [
        { filename: `Rechnung-${(data.orderId || "").slice(0, 8).toUpperCase()}.pdf`, content: toBase64(invoiceBytes) },
        { filename: "AGB-FOKUSWERK.pdf", content: toBase64(agbBytes) },
        { filename: "Widerrufsbelehrung-FOKUSWERK.pdf", content: toBase64(returnsBytes) },
      ];
    }

    else if (type === "shipping_confirmation") {
      subject = `Deine Bestellung ist unterwegs — ${BRAND} #${(data.orderId || "").slice(0, 8).toUpperCase()}`;
      const trackingBlock = data.trackingUrl
        ? `${cta("Sendung verfolgen", data.trackingUrl)}${data.trackingNumber ? `<p style="font-size:12px;color:#737373;margin-top:12px">Tracking-Nr: <code style="background:#f5f5f5;padding:2px 8px;font-family:monospace;color:#0e0e0e">${data.trackingNumber}</code></p>` : ""}` : "";

      html = layout(`
        ${greeting(data.customerName || "Kunde")}
        ${subtext("Gute Nachrichten — deine Bestellung ist auf dem Weg zu dir!")}
        <div style="background:#fafafa;padding:20px;margin-bottom:24px">
          <table style="width:100%">
            <tr><td style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#a3a3a3;font-weight:600;padding-bottom:8px">Status</td><td style="font-size:13px;text-align:right;color:#0e0e0e;font-weight:600;padding-bottom:8px">Versendet ✓</td></tr>
            <tr><td style="font-size:13px;color:#737373">Voraussichtliche Lieferung</td><td style="font-size:13px;text-align:right;color:#0e0e0e">5–8 Werktage</td></tr>
          </table>
        </div>
        ${trackingBlock}
        ${divider}
        <p style="font-size:13px;color:#737373;margin:0">Den Status deiner Bestellung kannst du jederzeit in deinem <a href="${data.siteUrl || SITE}/account" style="color:#0e0e0e;text-decoration:underline;font-weight:500">Kundenkonto</a> einsehen.</p>
      `);
    }

    else if (type === "contact_notification") {
      subject = `Neue Kontaktanfrage — ${data.name}`;
      html = layout(`
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 16px;font-weight:600">Kontaktanfrage</p>
        <table style="width:100%;font-size:13px">
          <tr><td style="color:#737373;padding:6px 0;width:80px">Name</td><td style="color:#0e0e0e;font-weight:500;padding:6px 0">${data.name}</td></tr>
          <tr><td style="color:#737373;padding:6px 0">E-Mail</td><td style="padding:6px 0"><a href="mailto:${data.email}" style="color:#0e0e0e;font-weight:500;text-decoration:underline">${data.email}</a></td></tr>
        </table>
        ${divider}
        <div style="background:#fafafa;padding:20px;font-size:13px;color:#0e0e0e;line-height:1.7;white-space:pre-wrap">${data.message}</div>
        ${cta("Direkt antworten", `mailto:${data.email}`)}
      `);
    }

    else if (type === "contact_confirmation") {
      subject = `Wir haben deine Nachricht erhalten — ${BRAND}`;
      html = layout(`
        ${greeting(data.name || "Kunde")}
        ${subtext("Vielen Dank für deine Nachricht. Wir melden uns innerhalb von 24 Stunden bei dir.")}
        <div style="background:#fafafa;padding:20px;margin-bottom:24px">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 8px;font-weight:600">Deine Nachricht</p>
          <p style="font-size:13px;color:#0e0e0e;margin:0;white-space:pre-wrap;line-height:1.7">${data.message}</p>
        </div>
        <p style="font-size:13px;color:#737373;margin:0">Bei dringenden Fragen: <a href="mailto:kontakt@fokuswerk.de" style="color:#0e0e0e;text-decoration:underline">kontakt@fokuswerk.de</a></p>
      `);
    }

    else if (type === "discount_welcome") {
      subject = `Dein 10 % Rabattcode — ${BRAND}`;
      html = layout(`
        <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 16px;font-weight:600;text-align:center">Willkommen bei ${BRAND}</p>
        <p style="font-size:20px;font-weight:700;color:#0e0e0e;text-align:center;margin:0 0 8px">10 % auf deine erste Bestellung</p>
        ${subtext('<span style="display:block;text-align:center">Nutze den folgenden Code an der Kasse:</span>')}
        <div style="background:#0e0e0e;padding:20px;text-align:center;margin:0 0 24px">
          <span style="font-size:28px;font-weight:700;letter-spacing:0.25em;color:#ffffff;font-family:monospace">${data.discountCode}</span>
        </div>
        <p style="font-size:13px;color:#737373;margin:0 0 4px;text-align:center">Einmalig gültig. Nicht mit anderen Aktionen kombinierbar.</p>
        ${cta("Jetzt shoppen", `${data.siteUrl || SITE}`)}
      `);
    }

    else if (type === "abandoned_cart") {
      subject = `Noch nicht fertig? — ${BRAND}`;
      html = layout(`
        ${greeting(data.customerName || "dort")}
        ${subtext("Du hast noch Artikel in deinem Warenkorb. Schließe deine Bestellung ab, bevor sie vergriffen sind.")}
        <div style="background:#fafafa;padding:20px;text-align:center;margin-bottom:24px">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 4px;font-weight:600">Dein Warenkorb wartet</p>
          <p style="font-size:13px;color:#737373;margin:0">Kostenloser Versand · 14 Tage Rückgaberecht</p>
        </div>
        <div style="text-align:center">${cta("Warenkorb öffnen", `${data.siteUrl || SITE}/cart`)}</div>
      `);
    }

    else { throw new Error("Unknown email type"); }

    /* ── Send ────────────────────────────────────────── */
    const emailPayload: any = { from: FROM, to: [to], subject, html };
    if (attachments.length > 0) emailPayload.attachments = attachments;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(result));

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
