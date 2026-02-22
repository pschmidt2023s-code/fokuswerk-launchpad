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
    const { items, customer, shippingAddress, userId } = await req.json();

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe key not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Build line items for Stripe
    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: "eur",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Determine origin for redirect URLs
    const origin = req.headers.get("origin") || "https://fokuswerk.de";

    // Create Stripe Checkout Session
    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mode: "payment",
        "success_url": `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": `${origin}/order/cancel`,
        "customer_email": customer.email,
        ...lineItems.reduce((acc: Record<string, string>, item: any, i: number) => {
          acc[`line_items[${i}][price_data][currency]`] = item.price_data.currency;
          acc[`line_items[${i}][price_data][product_data][name]`] = item.price_data.product_data.name;
          acc[`line_items[${i}][price_data][unit_amount]`] = item.price_data.unit_amount.toString();
          acc[`line_items[${i}][quantity]`] = item.quantity.toString();
          return acc;
        }, {}),
      }),
    });

    const session = await stripeRes.json();
    if (session.error) throw new Error(session.error.message);

    // Save order to DB
    const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
    await fetch(`${supabaseUrl}/rest/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        customer_name: customer.name,
        customer_email: customer.email,
        items,
        subtotal,
        shipping: 0,
        total: subtotal,
        status: "pending",
        payment_method: "stripe",
        stripe_session_id: session.id,
        shipping_address: shippingAddress,
        user_id: userId || null,
      }),
    });

    // Send confirmation email (fire and forget)
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FOKUSWERK <noreply@aldenairperfumes.de>",
          to: [customer.email],
          subject: `Bestellbestätigung — FOKUSWERK`,
          html: `<div style="font-family:'Inter',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
            <h1 style="font-size:14px;letter-spacing:0.3em;font-weight:700;margin-bottom:24px">FOKUSWERK</h1>
            <p>Hallo ${customer.name}, vielen Dank für deine Bestellung!</p>
            <p style="font-size:14px;color:#737373">Du erhältst eine weitere Bestätigung, sobald deine Zahlung eingegangen ist.</p>
            <p style="font-size:13px;color:#737373;margin-top:24px">Kostenloser Versand innerhalb der EU (5–8 Werktage)</p>
          </div>`,
        }),
      }).catch(() => {});
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
