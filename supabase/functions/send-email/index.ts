import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/* ── Brand constants ────────────────────────────────── */
const BRAND = "FOKUSWERK";
const SITE = "https://fokuswerk.de";
const FROM = `${BRAND} <noreply@aldenairperfumes.de>`;
const KLEINUNTERNEHMER = "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).";

/* ── Shared layout ──────────────────────────────────── */
const layout = (content: string) => `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:'Inter','Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <!-- Header -->
        <tr><td style="padding:32px 40px 24px;background:#0e0e0e;text-align:center">
          <span style="font-size:13px;letter-spacing:0.4em;font-weight:700;color:#ffffff;text-transform:uppercase">${BRAND}</span>
        </td></tr>
        <!-- Body -->
        <tr><td style="background:#ffffff;padding:40px">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 40px;background:#ffffff;border-top:1px solid #e5e5e5">
          <p style="font-size:11px;color:#a3a3a3;margin:0;line-height:1.6;text-align:center">
            ${BRAND} · ${KLEINUNTERNEHMER}<br>
            <a href="${SITE}/impressum" style="color:#a3a3a3;text-decoration:underline">Impressum</a> · 
            <a href="${SITE}/datenschutz" style="color:#a3a3a3;text-decoration:underline">Datenschutz</a> · 
            <a href="${SITE}/agb" style="color:#a3a3a3;text-decoration:underline">AGB</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

/* ── CTA button ─────────────────────────────────────── */
const cta = (label: string, url: string) =>
  `<a href="${url}" style="display:inline-block;margin-top:24px;padding:14px 32px;background:#0e0e0e;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600">${label}</a>`;

/* ── Greeting ───────────────────────────────────────── */
const greeting = (name: string) =>
  `<p style="font-size:15px;font-weight:600;color:#0e0e0e;margin:0 0 4px">Hallo ${name},</p>`;

const subtext = (text: string) =>
  `<p style="font-size:13px;color:#737373;margin:0 0 24px;line-height:1.7">${text}</p>`;

/* ── Divider ────────────────────────────────────────── */
const divider = `<hr style="border:none;border-top:1px solid #e5e5e5;margin:28px 0">`;

/* ── Generate Invoice HTML for PDF ──────────────────── */
function generateInvoiceHtml(data: any): string {
  const date = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const invoiceNr = `RE-${(data.orderId || "000000").slice(0, 8).toUpperCase()}`;
  const itemRows = (data.items || [])
    .map((i: any) =>
      `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px">${i.name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;text-align:center">${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px;text-align:right">${(i.price * i.quantity).toFixed(2).replace(".", ",")} €</td>
      </tr>`)
    .join("");

  return `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><style>
  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0e0e0e;margin:40px;font-size:13px;line-height:1.6}
  h1{font-size:13px;letter-spacing:0.3em;font-weight:700;text-transform:uppercase;margin-bottom:32px}
  table{width:100%;border-collapse:collapse}
  .meta{font-size:12px;color:#737373}
  .total-row td{padding:12px 0;font-weight:700;font-size:14px}
  .note{font-size:11px;color:#737373;margin-top:32px}
</style></head>
<body>
  <h1>${BRAND}</h1>
  <table style="margin-bottom:32px">
    <tr><td style="vertical-align:top;width:50%">
      <p class="meta">Rechnungsadresse:</p>
      <p><strong>${data.customerName || "—"}</strong><br>
      ${data.shippingAddress?.street || ""}<br>
      ${data.shippingAddress?.zip || ""} ${data.shippingAddress?.city || ""}<br>
      ${data.shippingAddress?.country || "Deutschland"}</p>
    </td>
    <td style="vertical-align:top;text-align:right">
      <p class="meta">Rechnungsnr: <strong style="color:#0e0e0e">${invoiceNr}</strong></p>
      <p class="meta">Datum: ${date}</p>
      <p class="meta">Bestellnr: #${(data.orderId || "").slice(0, 8)}</p>
    </td></tr>
  </table>

  <table>
    <thead>
      <tr style="border-bottom:2px solid #0e0e0e">
        <th style="text-align:left;padding:8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Artikel</th>
        <th style="text-align:center;padding:8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Menge</th>
        <th style="text-align:right;padding:8px 0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em">Betrag</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>

  <table style="margin-top:16px">
    <tr><td style="padding:4px 0;font-size:13px;color:#737373">Zwischensumme</td><td style="padding:4px 0;font-size:13px;text-align:right">${Number(data.total).toFixed(2).replace(".", ",")} €</td></tr>
    <tr><td style="padding:4px 0;font-size:13px;color:#737373">Versand</td><td style="padding:4px 0;font-size:13px;text-align:right">Kostenlos</td></tr>
    <tr><td style="padding:4px 0;font-size:13px;color:#737373">MwSt.</td><td style="padding:4px 0;font-size:13px;text-align:right">0,00 €</td></tr>
    <tr class="total-row" style="border-top:2px solid #0e0e0e"><td style="padding:12px 0;font-weight:700;font-size:14px">Gesamtbetrag</td><td style="padding:12px 0;font-weight:700;font-size:14px;text-align:right">${Number(data.total).toFixed(2).replace(".", ",")} €</td></tr>
  </table>

  <p class="note"><strong>${KLEINUNTERNEHMER}</strong></p>
  <p class="note">Zahlungsweise: ${data.paymentMethod === "paypal" ? "PayPal" : "Stripe (Kreditkarte)"}</p>

  ${divider}

  <p class="note">
    ${BRAND}<br>
    Bei Fragen: kontakt@fokuswerk.de
  </p>
</body>
</html>`;
}

/* ── AGB text ───────────────────────────────────────── */
function generateAgbHtml(): string {
  return `
<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><style>body{font-family:'Helvetica Neue',Arial,sans-serif;color:#0e0e0e;margin:40px;font-size:12px;line-height:1.7} h1{font-size:13px;letter-spacing:0.3em;font-weight:700;text-transform:uppercase;margin-bottom:24px} h2{font-size:12px;font-weight:600;margin-top:20px}</style></head>
<body>
  <h1>${BRAND} — Allgemeine Geschäftsbedingungen</h1>
  <h2>1. Geltungsbereich</h2>
  <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über unseren Onlineshop.</p>
  <h2>2. Vertragsschluss</h2>
  <p>Durch Klicken auf „Bestellung aufgeben" gibst du ein verbindliches Angebot zum Kauf der Artikel in deinem Warenkorb ab. Die Bestellbestätigung per E-Mail stellt die Annahme des Vertrags dar.</p>
  <h2>3. Preise & Zahlung</h2>
  <p>Alle Preise sind Endpreise. ${KLEINUNTERNEHMER}</p>
  <p>Akzeptierte Zahlungsmittel: Kreditkarte (Stripe), PayPal, Apple Pay, Google Pay.</p>
  <h2>4. Lieferung</h2>
  <p>Kostenloser Versand innerhalb der EU. Die Lieferzeit beträgt 5–8 Werktage.</p>
  <h2>5. Eigentumsvorbehalt</h2>
  <p>Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
  <h2>6. Schlussbestimmungen</h2>
  <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin.</p>
  <p style="margin-top:24px;font-size:11px;color:#a3a3a3">Stand: Februar 2026 — Platzhalter, durch rechtskonforme AGB ersetzen.</p>
</body></html>`;
}

/* ── Widerrufsbelehrung text ────────────────────────── */
function generateReturnsHtml(): string {
  return `
<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8"><style>body{font-family:'Helvetica Neue',Arial,sans-serif;color:#0e0e0e;margin:40px;font-size:12px;line-height:1.7} h1{font-size:13px;letter-spacing:0.3em;font-weight:700;text-transform:uppercase;margin-bottom:24px} h2{font-size:12px;font-weight:600;margin-top:20px}</style></head>
<body>
  <h1>${BRAND} — Widerrufsbelehrung & Rückerstattungsrichtlinien</h1>
  <h2>Widerrufsrecht</h2>
  <p>Du hast das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem du oder ein von dir benannter Dritter die Ware in Besitz genommen hat.</p>
  <p>Um dein Widerrufsrecht auszuüben, musst du uns (kontakt@fokuswerk.de) mittels einer eindeutigen Erklärung über deinen Entschluss informieren.</p>
  <h2>Folgen des Widerrufs</h2>
  <p>Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen 14 Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf bei uns eingegangen ist.</p>
  <p>Die Rückzahlung erfolgt über dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast.</p>
  <h2>Rücksendung</h2>
  <p>Du hast die Waren unverzüglich und spätestens binnen 14 Tagen ab dem Tag, an dem du uns über den Widerruf unterrichtest, an uns zurückzusenden. Die Kosten der Rücksendung trägst du.</p>
  <p style="margin-top:24px;font-size:11px;color:#a3a3a3">Stand: Februar 2026 — Platzhalter, durch rechtskonforme Texte ersetzen.</p>
</body></html>`;
}

/* ── HTML to "PDF" via base64 ───────────────────────── */
// Resend supports HTML attachments. We send the documents as .html files
// which can be opened in any browser and printed to PDF.
// For true PDF generation, a service like Puppeteer/wkhtmltopdf would be needed.

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

    /* ═══════════════════════════════════════════════════
       1. ORDER CONFIRMATION
       ═══════════════════════════════════════════════════ */
    if (type === "order_confirmation") {
      subject = `Bestellbestätigung #${(data.orderId || "").slice(0, 8).toUpperCase()} — ${BRAND}`;

      const itemsHtml = (data.items || [])
        .map((i: any) =>
          `<tr>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#0e0e0e">${i.name}</td>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#737373;text-align:center">×${i.quantity}</td>
            <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#0e0e0e;text-align:right;font-weight:500">${(i.price * i.quantity).toFixed(2).replace(".", ",")} €</td>
          </tr>`)
        .join("");

      html = layout(`
        ${greeting(data.customerName || "Kunde")}
        ${subtext("Vielen Dank für deine Bestellung. Wir haben alles erhalten und bereiten den Versand vor.")}
        
        <div style="background:#fafafa;padding:20px;margin-bottom:24px">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 12px;font-weight:600">Bestellübersicht</p>
          <table style="width:100%;border-collapse:collapse">
            ${itemsHtml}
          </table>
          <table style="width:100%;margin-top:12px">
            <tr><td style="font-size:13px;color:#737373;padding:4px 0">Versand</td><td style="font-size:13px;text-align:right;color:#737373;padding:4px 0">Kostenlos</td></tr>
            <tr style="border-top:1px solid #e5e5e5"><td style="font-size:14px;font-weight:700;color:#0e0e0e;padding:12px 0">Gesamt</td><td style="font-size:14px;font-weight:700;text-align:right;color:#0e0e0e;padding:12px 0">${Number(data.total).toFixed(2).replace(".", ",")} €</td></tr>
          </table>
        </div>

        <p style="font-size:11px;color:#a3a3a3;margin:0">${KLEINUNTERNEHMER}</p>
        ${divider}
        <p style="font-size:13px;color:#737373;margin:0;line-height:1.7">Kostenloser Versand innerhalb der EU — 5 bis 8 Werktage.<br>Du erhältst eine separate E-Mail mit Tracking-Informationen.</p>
        ${cta("Bestellung ansehen", `${data.siteUrl || SITE}/account`)}
      `);

      // Attachments
      const encoder = new TextEncoder();
      attachments = [
        {
          filename: `Rechnung-${(data.orderId || "").slice(0, 8).toUpperCase()}.html`,
          content: btoa(String.fromCharCode(...encoder.encode(generateInvoiceHtml(data)))),
        },
        {
          filename: "AGB-FOKUSWERK.html",
          content: btoa(String.fromCharCode(...encoder.encode(generateAgbHtml()))),
        },
        {
          filename: "Widerrufsbelehrung-FOKUSWERK.html",
          content: btoa(String.fromCharCode(...encoder.encode(generateReturnsHtml()))),
        },
      ];
    }

    /* ═══════════════════════════════════════════════════
       2. SHIPPING CONFIRMATION
       ═══════════════════════════════════════════════════ */
    else if (type === "shipping_confirmation") {
      subject = `Deine Bestellung ist unterwegs — ${BRAND} #${(data.orderId || "").slice(0, 8).toUpperCase()}`;

      const trackingBlock = data.trackingUrl
        ? `${cta("Sendung verfolgen", data.trackingUrl)}
           ${data.trackingNumber ? `<p style="font-size:12px;color:#737373;margin-top:12px">Tracking-Nr: <code style="background:#f5f5f5;padding:2px 8px;font-family:monospace;color:#0e0e0e">${data.trackingNumber}</code></p>` : ""}`
        : "";

      html = layout(`
        ${greeting(data.customerName || "Kunde")}
        ${subtext("Gute Nachrichten — deine Bestellung ist auf dem Weg zu dir!")}
        
        <div style="background:#fafafa;padding:20px;margin-bottom:24px">
          <table style="width:100%">
            <tr>
              <td style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#a3a3a3;font-weight:600;padding-bottom:8px">Status</td>
              <td style="font-size:13px;text-align:right;color:#0e0e0e;font-weight:600;padding-bottom:8px">Versendet ✓</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#737373">Voraussichtliche Lieferung</td>
              <td style="font-size:13px;text-align:right;color:#0e0e0e">5–8 Werktage</td>
            </tr>
          </table>
        </div>

        ${trackingBlock}
        ${divider}
        <p style="font-size:13px;color:#737373;margin:0">Den Status deiner Bestellung kannst du jederzeit in deinem <a href="${data.siteUrl || SITE}/account" style="color:#0e0e0e;text-decoration:underline;font-weight:500">Kundenkonto</a> einsehen.</p>
      `);
    }

    /* ═══════════════════════════════════════════════════
       3. CONTACT NOTIFICATION (Admin)
       ═══════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════
       4. CONTACT CONFIRMATION (Customer)
       ═══════════════════════════════════════════════════ */
    else if (type === "contact_confirmation") {
      subject = `Wir haben deine Nachricht erhalten — ${BRAND}`;
      html = layout(`
        ${greeting(data.name || "Kunde")}
        ${subtext("Vielen Dank für deine Nachricht. Wir melden uns innerhalb von 24 Stunden bei dir.")}
        
        <div style="background:#fafafa;padding:20px;margin-bottom:24px">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 8px;font-weight:600">Deine Nachricht</p>
          <p style="font-size:13px;color:#0e0e0e;margin:0;white-space:pre-wrap;line-height:1.7">${data.message}</p>
        </div>

        <p style="font-size:13px;color:#737373;margin:0">Bei dringenden Fragen erreichst du uns unter <a href="mailto:kontakt@fokuswerk.de" style="color:#0e0e0e;text-decoration:underline">kontakt@fokuswerk.de</a></p>
      `);
    }

    /* ═══════════════════════════════════════════════════
       5. DISCOUNT WELCOME
       ═══════════════════════════════════════════════════ */
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

    /* ═══════════════════════════════════════════════════
       6. ABANDONED CART
       ═══════════════════════════════════════════════════ */
    else if (type === "abandoned_cart") {
      subject = `Noch nicht fertig? — ${BRAND}`;
      html = layout(`
        ${greeting(data.customerName || "dort")}
        ${subtext("Du hast noch Artikel in deinem Warenkorb. Schließe deine Bestellung ab, bevor sie vergriffen sind.")}
        
        <div style="background:#fafafa;padding:20px;text-align:center;margin-bottom:24px">
          <p style="font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:#a3a3a3;margin:0 0 4px;font-weight:600">Dein Warenkorb wartet</p>
          <p style="font-size:13px;color:#737373;margin:0">Kostenloser Versand · 14 Tage Rückgaberecht</p>
        </div>

        <div style="text-align:center">
          ${cta("Warenkorb öffnen", `${data.siteUrl || SITE}/cart`)}
        </div>
      `);
    }

    else {
      throw new Error("Unknown email type");
    }

    /* ── Send via Resend ────────────────────────────── */
    const emailPayload: any = {
      from: FROM,
      to: [to],
      subject,
      html,
    };

    if (attachments.length > 0) {
      emailPayload.attachments = attachments;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
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
