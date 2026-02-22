import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    if (type === "order_confirmation") {
      subject = `Bestellbestätigung — FOKUSWERK #${data.orderId?.slice(0, 8) ?? ""}`;
      const itemsHtml = data.items
        .map((i: { name: string; price: number; quantity: number }) =>
          `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name} × ${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${(i.price * i.quantity).toFixed(2).replace(".", ",")} €</td></tr>`
        )
        .join("");

      html = `
        <div style="font-family:'Inter',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
          <h1 style="font-size:14px;letter-spacing:0.3em;font-weight:700;margin-bottom:24px">FOKUSWERK</h1>
          <p style="font-size:15px;margin-bottom:4px">Hallo ${data.customerName},</p>
          <p style="font-size:14px;color:#737373;margin-bottom:24px">Vielen Dank für deine Bestellung. Hier ist deine Bestätigung:</p>
          <table style="width:100%;font-size:14px;border-collapse:collapse">
            ${itemsHtml}
            <tr><td style="padding:12px 0;font-weight:600">Gesamt</td><td style="padding:12px 0;font-weight:600;text-align:right">${Number(data.total).toFixed(2).replace(".", ",")} €</td></tr>
          </table>
          <p style="font-size:13px;color:#737373;margin-top:24px">Versand: Kostenlos innerhalb der EU (5–8 Werktage)</p>
          <p style="font-size:13px;color:#737373;margin-top:16px">Bei Fragen antworte einfach auf diese E-Mail.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
          <p style="font-size:11px;color:#a3a3a3">FOKUSWERK — Kontrolle beginnt auf deinem Schreibtisch.</p>
        </div>
      `;
    } else if (type === "shipping_confirmation") {
      subject = `Deine Bestellung wurde versendet — FOKUSWERK #${data.orderId?.slice(0, 8) ?? ""}`;
      const trackingHtml = data.trackingUrl
        ? `<a href="${data.trackingUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#0e0e0e;color:#fff;text-decoration:none;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500">Sendung verfolgen</a>
           ${data.trackingNumber ? `<p style="font-size:12px;color:#737373;margin-top:8px">Tracking-Nummer: <strong style="color:#0e0e0e;font-family:monospace">${data.trackingNumber}</strong></p>` : ""}`
        : "";

      html = `
        <div style="font-family:'Inter',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
          <h1 style="font-size:14px;letter-spacing:0.3em;font-weight:700;margin-bottom:24px">FOKUSWERK</h1>
          <p style="font-size:15px;margin-bottom:4px">Hallo ${data.customerName},</p>
          <p style="font-size:14px;color:#737373;margin-bottom:8px">Deine Bestellung ist auf dem Weg!</p>
          <p style="font-size:14px;color:#737373;margin-bottom:24px">Die voraussichtliche Lieferzeit beträgt 5–8 Werktage.</p>
          ${trackingHtml}
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
          <p style="font-size:13px;color:#737373">Du kannst den Status deiner Bestellung jederzeit in deinem <a href="${data.siteUrl || "https://fokuswerk.de"}/account" style="color:#0e0e0e;text-decoration:underline">Kundenkonto</a> einsehen.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
          <p style="font-size:11px;color:#a3a3a3">FOKUSWERK — Kontrolle beginnt auf deinem Schreibtisch.</p>
        </div>
      `;
    } else if (type === "contact_notification") {
      subject = `Neue Kontaktanfrage von ${data.name}`;
      html = `
        <div style="font-family:'Inter',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
          <h1 style="font-size:14px;letter-spacing:0.3em;font-weight:700;margin-bottom:24px">FOKUSWERK — Kontaktanfrage</h1>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>E-Mail:</strong> ${data.email}</p>
          <p style="margin-top:16px"><strong>Nachricht:</strong></p>
          <p style="white-space:pre-wrap;background:#f5f5f5;padding:16px;font-size:14px">${data.message}</p>
          <p style="margin-top:16px"><a href="mailto:${data.email}">Direkt antworten</a></p>
        </div>
      `;
    } else if (type === "contact_confirmation") {
      subject = `Wir haben deine Nachricht erhalten — FOKUSWERK`;
      html = `
        <div style="font-family:'Inter',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
          <h1 style="font-size:14px;letter-spacing:0.3em;font-weight:700;margin-bottom:24px">FOKUSWERK</h1>
          <p style="font-size:15px;margin-bottom:4px">Hallo ${data.name},</p>
          <p style="font-size:14px;color:#737373;margin-bottom:16px">Vielen Dank für deine Nachricht. Wir haben sie erhalten und werden uns innerhalb von 24 Stunden bei dir melden.</p>
          <div style="background:#f5f5f5;padding:16px;font-size:13px;color:#737373;margin-bottom:24px">
            <p style="margin:0"><strong style="color:#0e0e0e">Deine Nachricht:</strong></p>
            <p style="margin:8px 0 0;white-space:pre-wrap">${data.message}</p>
          </div>
          <p style="font-size:13px;color:#737373">Bei dringenden Anfragen erreichst du uns unter kontakt@fokuswerk.de</p>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
          <p style="font-size:11px;color:#a3a3a3">FOKUSWERK — Kontrolle beginnt auf deinem Schreibtisch.</p>
        </div>
      `;
    } else if (type === "discount_welcome") {
      subject = "Dein 10 % Rabattcode — FOKUSWERK";
      html = `
        <div style="font-family:'Inter',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
          <h1 style="font-size:14px;letter-spacing:0.3em;font-weight:700;margin-bottom:24px">FOKUSWERK</h1>
          <p style="font-size:15px;margin-bottom:16px">Willkommen bei FOKUSWERK.</p>
          <p style="font-size:14px;color:#737373;margin-bottom:24px">Hier ist dein persönlicher Rabattcode für 10 % auf deine erste Bestellung:</p>
          <div style="background:#0e0e0e;color:#fff;padding:20px;text-align:center;margin-bottom:24px">
            <p style="font-size:24px;font-weight:700;letter-spacing:0.2em;margin:0">${data.discountCode}</p>
          </div>
          <p style="font-size:13px;color:#737373;margin-bottom:8px">Gib den Code im Warenkorb oder an der Kasse ein.</p>
          <p style="font-size:13px;color:#737373">Der Code gilt einmalig und ist nicht mit anderen Aktionen kombinierbar.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
          <p style="font-size:11px;color:#a3a3a3">FOKUSWERK — Kontrolle beginnt auf deinem Schreibtisch.</p>
        </div>
      `;
    } else if (type === "abandoned_cart") {
      subject = "Hast du etwas vergessen? — FOKUSWERK";
      html = `
        <div style="font-family:'Inter',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
          <h1 style="font-size:14px;letter-spacing:0.3em;font-weight:700;margin-bottom:24px">FOKUSWERK</h1>
          <p style="font-size:15px;margin-bottom:4px">Hallo${data.customerName ? ` ${data.customerName}` : ""},</p>
          <p style="font-size:14px;color:#737373;margin-bottom:24px">Dein Warenkorb wartet auf dich. Schließe deine Bestellung jetzt ab.</p>
          <a href="${data.siteUrl || "https://fokuswerk.de"}/cart" style="display:inline-block;padding:14px 32px;background:#0e0e0e;color:#fff;text-decoration:none;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500">Zum Warenkorb</a>
          <hr style="border:none;border-top:1px solid #eee;margin:32px 0" />
          <p style="font-size:11px;color:#a3a3a3">FOKUSWERK — Kontrolle beginnt auf deinem Schreibtisch.</p>
        </div>
      `;
    } else {
      throw new Error("Unknown email type");
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FOKUSWERK <noreply@aldenairperfumes.de>",
        to: [to],
        subject,
        html,
      }),
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
