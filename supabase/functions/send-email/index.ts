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
const KU = "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).";

/* ── PDF helpers ────────────────────────────────────── */
const GREY = rgb(0.45, 0.45, 0.45);
const BLACK = rgb(0.055, 0.055, 0.055);
const LIGHT = rgb(0.64, 0.64, 0.64);

async function createInvoicePdf(data: any): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595.28, 841.89]); // A4
  const { height } = page.getSize();
  let y = height - 50;
  const lm = 50; // left margin
  const rm = 545; // right edge

  const date = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const invoiceNr = `RE-${(data.orderId || "000000").slice(0, 8).toUpperCase()}`;

  // Header
  page.drawText(BRAND, { x: lm, y, size: 14, font: fontBold, color: BLACK });
  y -= 40;

  // Address block
  page.drawText("Rechnungsadresse:", { x: lm, y, size: 8, font, color: GREY });
  page.drawText(`Rechnungsnr: ${invoiceNr}`, { x: 370, y, size: 8, font, color: GREY });
  y -= 14;
  page.drawText(data.customerName || "—", { x: lm, y, size: 10, font: fontBold, color: BLACK });
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
    const total = (item.price * item.quantity).toFixed(2).replace(".", ",") + " €";
    page.drawText(item.name || "", { x: lm, y, size: 9, font, color: BLACK });
    page.drawText(String(item.quantity), { x: 385, y, size: 9, font, color: BLACK });
    page.drawText(total, { x: 490, y, size: 9, font, color: BLACK });
    y -= 18;
    page.drawLine({ start: { x: lm, y: y + 6 }, end: { x: rm, y: y + 6 }, thickness: 0.3, color: LIGHT });
  }

  y -= 10;
  // Subtotal
  page.drawText("Zwischensumme", { x: 370, y, size: 9, font, color: GREY });
  page.drawText(`${Number(data.total).toFixed(2).replace(".", ",")} €`, { x: 490, y, size: 9, font, color: BLACK });
  y -= 16;
  page.drawText("Versand", { x: 370, y, size: 9, font, color: GREY });
  page.drawText("Kostenlos", { x: 490, y, size: 9, font, color: BLACK });
  y -= 16;
  page.drawText("MwSt.", { x: 370, y, size: 9, font, color: GREY });
  page.drawText("0,00 €", { x: 490, y, size: 9, font, color: BLACK });
  y -= 10;
  page.drawLine({ start: { x: 370, y }, end: { x: rm, y }, thickness: 1.5, color: BLACK });
  y -= 16;
  page.drawText("Gesamtbetrag", { x: 370, y, size: 10, font: fontBold, color: BLACK });
  page.drawText(`${Number(data.total).toFixed(2).replace(".", ",")} €`, { x: 490, y, size: 10, font: fontBold, color: BLACK });

  y -= 40;
  page.drawText(KU, { x: lm, y, size: 7.5, font: fontBold, color: GREY });
  y -= 14;
  page.drawText(`Zahlungsweise: ${data.paymentMethod === "paypal" ? "PayPal" : "Kreditkarte (Stripe)"}`, { x: lm, y, size: 7.5, font, color: GREY });

  y -= 30;
  page.drawLine({ start: { x: lm, y }, end: { x: rm, y }, thickness: 0.3, color: LIGHT });
  y -= 14;
  page.drawText(`${BRAND} · kontakt@fokuswerk.de`, { x: lm, y, size: 7, font, color: LIGHT });

  return await doc.save();
}

async function createAgbPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595.28, 841.89]);
  const { height } = page.getSize();
  let y = height - 50;
  const lm = 50;
  const maxW = 495;

  const title = (t: string) => { page.drawText(t, { x: lm, y, size: 10, font: fontBold, color: BLACK }); y -= 18; };
  const para = (t: string) => {
    const words = t.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, 9) > maxW) {
        page.drawText(line, { x: lm, y, size: 9, font, color: BLACK }); y -= 13; line = w;
      } else { line = test; }
    }
    if (line) { page.drawText(line, { x: lm, y, size: 9, font, color: BLACK }); y -= 13; }
    y -= 6;
  };

  page.drawText(`${BRAND} — Allgemeine Geschäftsbedingungen`, { x: lm, y, size: 12, font: fontBold, color: BLACK });
  y -= 30;

  title("1. Geltungsbereich");
  para("Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über unseren Onlineshop.");

  title("2. Vertragsschluss");
  para('Durch Klicken auf \u201EBestellung aufgeben\u201C gibst du ein verbindliches Angebot zum Kauf der Artikel in deinem Warenkorb ab. Die Bestellbestätigung per E-Mail stellt die Annahme des Vertrags dar.');

  title("3. Preise & Zahlung");
  para(`Alle Preise sind Endpreise. ${KU}`);
  para("Akzeptierte Zahlungsmittel: Kreditkarte (Stripe), PayPal, Apple Pay, Google Pay.");

  title("4. Lieferung");
  para("Kostenloser Versand innerhalb der EU. Die Lieferzeit beträgt 5–8 Werktage.");

  title("5. Eigentumsvorbehalt");
  para("Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.");

  title("6. Schlussbestimmungen");
  para("Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin.");

  y -= 20;
  page.drawText("Stand: Februar 2026 — Platzhalter, durch rechtskonforme AGB ersetzen.", { x: lm, y, size: 7, font, color: LIGHT });

  return await doc.save();
}

async function createReturnsPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595.28, 841.89]);
  const { height } = page.getSize();
  let y = height - 50;
  const lm = 50;
  const maxW = 495;

  const title = (t: string) => { page.drawText(t, { x: lm, y, size: 10, font: fontBold, color: BLACK }); y -= 18; };
  const para = (t: string) => {
    const words = t.split(" ");
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, 9) > maxW) {
        page.drawText(line, { x: lm, y, size: 9, font, color: BLACK }); y -= 13; line = w;
      } else { line = test; }
    }
    if (line) { page.drawText(line, { x: lm, y, size: 9, font, color: BLACK }); y -= 13; }
    y -= 6;
  };

  page.drawText(`${BRAND} — Widerrufsbelehrung & Rückerstattungsrichtlinien`, { x: lm, y, size: 11, font: fontBold, color: BLACK });
  y -= 30;

  title("Widerrufsrecht");
  para("Du hast das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem du oder ein von dir benannter Dritter die Ware in Besitz genommen hat.");
  para("Um dein Widerrufsrecht auszuüben, musst du uns (kontakt@fokuswerk.de) mittels einer eindeutigen Erklärung über deinen Entschluss informieren.");

  title("Folgen des Widerrufs");
  para("Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen 14 Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf bei uns eingegangen ist.");
  para("Die Rückzahlung erfolgt über dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast.");

  title("Rücksendung");
  para("Du hast die Waren unverzüglich und spätestens binnen 14 Tagen ab dem Tag, an dem du uns über den Widerruf unterrichtest, an uns zurückzusenden. Die Kosten der Rücksendung trägst du.");

  y -= 20;
  page.drawText("Stand: Februar 2026 — Platzhalter, durch rechtskonforme Texte ersetzen.", { x: lm, y, size: 7, font, color: LIGHT });

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
      const itemsHtml = (data.items || [])
        .map((i: any) =>
          `<tr>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#0e0e0e">${i.name}</td>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#737373;text-align:center">×${i.quantity}</td>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#0e0e0e;text-align:right;font-weight:500">${(i.price * i.quantity).toFixed(2).replace(".", ",")} €</td>
          </tr>`).join("");

      html = layout(`
        ${greeting(data.customerName || "Kunde")}
        ${subtext("Vielen Dank für deine Bestellung. Wir haben alles erhalten und bereiten den Versand vor.")}
        <div style="background:#fafafa;padding:20px;margin-bottom:24px">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 12px;font-weight:600">Bestellübersicht</p>
          <table style="width:100%;border-collapse:collapse">${itemsHtml}</table>
          <table style="width:100%;margin-top:12px">
            <tr><td style="font-size:13px;color:#737373;padding:4px 0">Versand</td><td style="font-size:13px;text-align:right;color:#737373;padding:4px 0">Kostenlos</td></tr>
            <tr style="border-top:1px solid #e5e5e5"><td style="font-size:14px;font-weight:700;color:#0e0e0e;padding:12px 0">Gesamt</td><td style="font-size:14px;font-weight:700;text-align:right;color:#0e0e0e;padding:12px 0">${Number(data.total).toFixed(2).replace(".", ",")} €</td></tr>
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
