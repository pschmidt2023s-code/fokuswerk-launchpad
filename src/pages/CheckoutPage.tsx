import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, User, Tag, X, AlertCircle } from "lucide-react";

const EU_COUNTRIES = [
  "Deutschland", "Österreich", "Schweiz", "Frankreich", "Italien", "Spanien",
  "Niederlande", "Belgien", "Polen", "Tschechien", "Dänemark", "Schweden",
  "Finnland", "Norwegen", "Portugal", "Irland", "Luxemburg", "Griechenland",
];

const validateAddress = (form: { address: string; zip: string; city: string; country: string }) => {
  const errors: string[] = [];
  if (!form.address.trim() || form.address.trim().length < 5) errors.push("Bitte gib eine vollständige Adresse ein (Straße + Hausnummer).");
  if (!/^\d{4,5}$/.test(form.zip.trim())) errors.push("PLZ muss 4-5 Ziffern enthalten.");
  if (!form.city.trim() || form.city.trim().length < 2) errors.push("Bitte gib einen gültigen Ort ein.");
  if (!EU_COUNTRIES.includes(form.country)) errors.push("Versand nur innerhalb der EU möglich.");
  // Check street has number
  if (form.address.trim() && !/\d/.test(form.address)) errors.push("Bitte Hausnummer angeben.");
  return errors;
};

const CheckoutPage = () => {
  const { items, subtotal, shippingCost, total, discount, discountCode, applyDiscount, removeDiscount } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState<"stripe" | "paypal" | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [addressErrors, setAddressErrors] = useState<string[]>([]);
  const abandonedSaved = useRef(false);
  const [form, setForm] = useState(() => {
    const saved = sessionStorage.getItem("checkout_form");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return { firstName: "", lastName: "", email: "", address: "", zip: "", city: "", country: "Deutschland" };
  });

  // Persist form to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("checkout_form", JSON.stringify(form));
  }, [form]);

  // Pre-fill from profile if logged in
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        firstName: profile.first_name || f.firstName,
        lastName: profile.last_name || f.lastName,
        email: user?.email || f.email,
        address: profile.address || f.address,
        zip: profile.zip || f.zip,
        city: profile.city || f.city,
        country: profile.country || f.country,
      }));
    } else if (user) {
      setForm((f) => ({ ...f, email: user.email || f.email }));
    }
  }, [profile, user]);

  // Abandoned cart: save when user fills email and leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (form.email && items.length > 0 && !abandonedSaved.current) {
        abandonedSaved.current = true;
        const cartItems = items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity }));
        navigator.sendBeacon(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/abandoned_carts`,
          new Blob([JSON.stringify({
            email: form.email,
            customer_name: `${form.firstName} ${form.lastName}`.trim() || null,
            items: cartItems,
            total,
          })], { type: "application/json" })
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.email, form.firstName, form.lastName, items, total]);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setAddressErrors([]);
  };

  const isFormFilled = form.firstName && form.lastName && form.email && form.address && form.zip && form.city;

  const handleApplyCoupon = () => {
    setCouponError("");
    if (applyDiscount(couponInput.trim())) {
      toast({ title: "Rabattcode angewendet", description: "10 % Rabatt auf deine Bestellung." });
      setCouponInput("");
    } else {
      setCouponError("Ungültiger Rabattcode.");
    }
  };

  const validateAndPay = (handler: () => Promise<void>) => {
    const errors = validateAddress(form);
    if (errors.length > 0) {
      setAddressErrors(errors);
      return;
    }
    setAddressErrors([]);
    handler();
  };

  const cartItems = items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity }));
  const customer = { name: `${form.firstName} ${form.lastName}`, email: form.email };
  const shippingAddress = { address: form.address, zip: form.zip, city: form.city, country: form.country };

  const handleStripe = async () => {
    setLoading("stripe");
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { items: cartItems, customer, shippingAddress, userId: user?.id ?? null, discountCode: discountCode ?? undefined },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      toast({ title: "Fehler", description: "Stripe-Zahlung konnte nicht gestartet werden.", variant: "destructive" });
    }
    setLoading(null);
  };

  const handlePayPal = async () => {
    setLoading("paypal");
    try {
      const { data: createData, error: createErr } = await supabase.functions.invoke("paypal-checkout", {
        body: { action: "create", items: cartItems, customer, shippingAddress, userId: user?.id ?? null, discountCode: discountCode ?? undefined },
      });
      if (createErr) throw createErr;
      const approvalUrl = `https://www.paypal.com/checkoutnow?token=${createData.id}`;
      window.location.href = approvalUrl;
    } catch {
      toast({ title: "Fehler", description: "PayPal-Zahlung konnte nicht gestartet werden.", variant: "destructive" });
    }
    setLoading(null);
  };

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-foreground">Dein Warenkorb ist leer</p>
        <Button asChild className="mt-6 rounded-none px-8 text-sm uppercase tracking-[0.15em]">
          <Link to="/shop">Zurück zum Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold text-foreground">Kasse</h1>

      {/* Account hint */}
      {!user && (
        <div className="mt-4 flex items-center gap-3 border border-border p-4">
          <User className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
          <div className="flex-1">
            <p className="text-sm text-foreground">Schneller bezahlen mit einem Konto</p>
            <p className="text-xs text-muted-foreground">Adresse speichern und Bestellungen einsehen.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-none text-xs uppercase tracking-wider">
            <Link to="/auth">Anmelden</Link>
          </Button>
        </div>
      )}

      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Personal info */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">Kontaktdaten</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Vorname</Label>
                <Input className="rounded-none" placeholder="Max" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nachname</Label>
                <Input className="rounded-none" placeholder="Mustermann" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
              <Input className="rounded-none" type="email" placeholder="max@beispiel.de" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </div>
          </div>

          {/* Shipping address */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-4">Lieferadresse</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Straße & Hausnummer</Label>
                <Input className="rounded-none" placeholder="Musterstraße 12" value={form.address} onChange={(e) => update("address", e.target.value)} required />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">PLZ</Label>
                  <Input className="rounded-none" placeholder="10115" maxLength={5} value={form.zip} onChange={(e) => update("zip", e.target.value.replace(/\D/g, ""))} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Stadt</Label>
                  <Input className="rounded-none" placeholder="Berlin" value={form.city} onChange={(e) => update("city", e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Land</Label>
                <Input className="rounded-none" value="Deutschland" readOnly />
              </div>
            </div>

            {/* Address errors */}
            {addressErrors.length > 0 && (
              <div className="mt-3 space-y-1 border border-destructive/30 bg-destructive/5 p-3">
                {addressErrors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-destructive">
                    <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>{err}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Zahlungsmethode</p>
            
            <Button
              size="lg"
              className="w-full rounded-none text-sm uppercase tracking-[0.15em]"
              onClick={() => validateAndPay(handleStripe)}
              disabled={!!loading || !isFormFilled}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {loading === "stripe" ? "Weiterleitung..." : "Mit Kreditkarte bezahlen"}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-none text-sm uppercase tracking-[0.15em] border-[#0070ba] text-[#0070ba] hover:bg-[#0070ba]/10"
              onClick={() => validateAndPay(handlePayPal)}
              disabled={!!loading || !isFormFilled}
            >
              {loading === "paypal" ? "Weiterleitung..." : "Mit PayPal bezahlen"}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Sichere Zahlung über Stripe oder PayPal. Deine Daten sind verschlüsselt.
          </p>
        </div>

        {/* Order summary */}
        <div className="border border-border p-6 h-fit">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-foreground">Bestellübersicht</p>
          <div className="mt-4 divide-y divide-border">
            {items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-3 py-3">
                {item.image && (
                  <div className="h-12 w-12 shrink-0 border border-border overflow-hidden">
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain bg-white" />
                  </div>
                )}
                <div className="flex-1 text-sm">
                  <p className="text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                </div>
                <p className="text-sm text-foreground">{(item.price * item.quantity).toFixed(2).replace(".", ",")} €</p>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mt-4 border-t border-border pt-4">
            {discountCode ? (
              <div className="flex items-center justify-between rounded-none border border-green-200 bg-green-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-green-700" />
                  <span className="text-xs font-medium text-green-800">{discountCode} (−10 %)</span>
                </div>
                <button onClick={removeDiscount} className="text-green-600 hover:text-green-800">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Rabattcode"
                  value={couponInput}
                  onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                  className="rounded-none text-xs"
                />
                <Button variant="outline" className="shrink-0 rounded-none text-xs uppercase tracking-wider" onClick={handleApplyCoupon}>
                  Einlösen
                </Button>
              </div>
            )}
            {couponError && <p className="mt-1 text-xs text-destructive">{couponError}</p>}
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Zwischensumme</span>
              <span>{subtotal.toFixed(2).replace(".", ",")} €</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700">
                <span>Rabatt (−10 %)</span>
                <span>−{discount.toFixed(2).replace(".", ",")} €</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Versand</span>
              <span>{shippingCost === 0 ? "Kostenlos" : `${shippingCost.toFixed(2).replace(".", ",")} €`}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground">
              <span>Gesamt</span>
              <span>{total.toFixed(2).replace(".", ",")} €</span>
            </div>
            <p className="text-xs text-muted-foreground">inkl. MwSt.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
