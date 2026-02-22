import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getPayPalAccessToken() {
  const clientId = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const secret = Deno.env.get("PAYPAL_SECRET")!;
  const base = "https://api-m.paypal.com";

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${secret}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return { token: data.access_token, base };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, items, customer, shippingAddress, orderId } = await req.json();
    const { token, base } = await getPayPalAccessToken();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (action === "create") {
      // Create PayPal order
      const total = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);

      const res = await fetch(`${base}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [{
            amount: {
              currency_code: "EUR",
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: "EUR", value: total.toFixed(2) },
              },
            },
            items: items.map((i: { name: string; price: number; quantity: number }) => ({
              name: i.name,
              unit_amount: { currency_code: "EUR", value: i.price.toFixed(2) },
              quantity: i.quantity.toString(),
            })),
          }],
        }),
      });

      const order = await res.json();
      if (order.error) throw new Error(JSON.stringify(order.error));

      // Save order to DB
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
          subtotal: total,
          shipping: 0,
          total,
          status: "pending",
          payment_method: "paypal",
          paypal_order_id: order.id,
          shipping_address: shippingAddress,
        }),
      });

      return new Response(JSON.stringify({ id: order.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "capture") {
      // Capture payment
      const res = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const capture = await res.json();
      if (capture.error) throw new Error(JSON.stringify(capture.error));

      // Update order status
      await fetch(`${supabaseUrl}/rest/v1/orders?paypal_order_id=eq.${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ status: "paid" }),
      });

      return new Response(JSON.stringify({ status: capture.status }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
