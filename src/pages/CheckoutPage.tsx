import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const { items, subtotal, shippingCost, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-foreground">Dein Warenkorb ist leer</p>
        <Button asChild className="mt-6 rounded-none px-8 text-sm uppercase tracking-wider">
          <Link to="/">Zurück zum Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold text-foreground">Kasse</h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Vorname</Label>
              <Input className="rounded-none" placeholder="Max" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nachname</Label>
              <Input className="rounded-none" placeholder="Mustermann" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
            <Input className="rounded-none" type="email" placeholder="max@beispiel.de" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Straße & Hausnummer</Label>
            <Input className="rounded-none" placeholder="Musterstraße 1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">PLZ</Label>
              <Input className="rounded-none" placeholder="10115" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Stadt</Label>
              <Input className="rounded-none" placeholder="Berlin" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Land</Label>
            <Input className="rounded-none" value="Deutschland" readOnly />
          </div>

          <Button size="lg" className="mt-4 w-full rounded-none text-sm uppercase tracking-wider">
            Jetzt kostenpflichtig bestellen
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Nach Klick wirst du zu Stripe weitergeleitet, um die Zahlung sicher abzuschließen.
          </p>
        </div>

        {/* Order Summary */}
        <div className="rounded-sm border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground">Bestellübersicht</p>
          <div className="mt-4 divide-y divide-border">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.variantName} × {item.quantity}</p>
                </div>
                <p className="text-foreground">{(item.price * item.quantity).toFixed(2).replace(".", ",")} €</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Zwischensumme</span>
              <span>{subtotal.toFixed(2).replace(".", ",")} €</span>
            </div>
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
