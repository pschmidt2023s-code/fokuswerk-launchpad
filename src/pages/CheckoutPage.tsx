import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { items, subtotal, shippingCost, total } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    address: "", zip: "", city: "", country: "Deutschland",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleStripe = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
          customer: { name: `${form.firstName} ${form.lastName}`, email: form.email },
          shippingAddress: { address: form.address, zip: form.zip, city: form.city, country: form.country },
        },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      toast({ title: "Fehler", description: "Zahlung konnte nicht gestartet werden.", variant: "destructive" });
    }
    setLoading(false);
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

  const isValid = form.firstName && form.lastName && form.email && form.address && form.zip && form.city;

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold text-foreground">Kasse</h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
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
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
            <Input className="rounded-none" type="email" placeholder="max@beispiel.de" value={form.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Adresse</Label>
            <Input className="rounded-none" placeholder="Straße und Hausnummer" value={form.address} onChange={(e) => update("address", e.target.value)} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">PLZ</Label>
              <Input className="rounded-none" placeholder="10115" value={form.zip} onChange={(e) => update("zip", e.target.value)} required />
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

          <Button
            size="lg"
            className="mt-4 w-full rounded-none text-sm uppercase tracking-[0.15em]"
            onClick={handleStripe}
            disabled={loading || !isValid}
          >
            {loading ? "Weiterleitung..." : "Mit Stripe bezahlen"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Du wirst für die sichere Zahlung zu Stripe weitergeleitet.
          </p>
        </div>

        <div className="border border-border p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-foreground">Bestellübersicht</p>
          <div className="mt-4 divide-y divide-border">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                </div>
                <p className="text-foreground">{(item.price * item.quantity).toFixed(2).replace(".", ",")} &euro;</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Zwischensumme</span>
              <span>{subtotal.toFixed(2).replace(".", ",")} &euro;</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Versand</span>
              <span>{shippingCost === 0 ? "Kostenlos" : `${shippingCost.toFixed(2).replace(".", ",")} €`}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground">
              <span>Gesamt</span>
              <span>{total.toFixed(2).replace(".", ",")} &euro;</span>
            </div>
            <p className="text-xs text-muted-foreground">inkl. MwSt.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
