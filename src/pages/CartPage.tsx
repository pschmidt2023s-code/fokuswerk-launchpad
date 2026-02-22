import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, shippingCost, total } = useCart();
  const [coupon, setCoupon] = useState("");

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-semibold text-foreground">Dein Warenkorb ist leer</p>
        <p className="mt-2 text-sm text-muted-foreground">Entdecke unsere Produkte und finde deinen Favoriten.</p>
        <Button asChild className="mt-6 rounded-none px-8 text-sm uppercase tracking-wider">
          <Link to="/product/fokuswerk-snap-system">Zum Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold text-foreground">Warenkorb</h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-4 py-6">
                <div className="h-20 w-20 shrink-0 rounded-sm border border-border bg-card p-2">
                  <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">Bild</div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.variantName}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-foreground hover:bg-secondary"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-sm border border-border text-foreground hover:bg-secondary"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")} €
                  </p>
                  <button onClick={() => removeItem(item.variantId)} className="mt-2 text-muted-foreground hover:text-foreground">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-sm border border-border bg-card p-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground">Zusammenfassung</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Zwischensumme</span>
              <span>{subtotal.toFixed(2).replace(".", ",")} €</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Versand</span>
              <span>{shippingCost === 0 ? "Kostenlos" : `${shippingCost.toFixed(2).replace(".", ",")} €`}</span>
            </div>
            {shippingCost > 0 && (
              <p className="text-xs text-muted-foreground">Kostenloser Versand ab 49,00 €</p>
            )}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-semibold text-foreground">
                <span>Gesamt</span>
                <span>{total.toFixed(2).replace(".", ",")} €</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">inkl. MwSt.</p>
            </div>
          </div>

          {/* Coupon */}
          <div className="mt-6 flex gap-2">
            <Input
              placeholder="Gutscheincode"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="rounded-none text-sm"
            />
            <Button variant="outline" className="shrink-0 rounded-none text-xs uppercase tracking-wider">
              Einlösen
            </Button>
          </div>

          <Button asChild size="lg" className="mt-6 w-full rounded-none text-sm uppercase tracking-wider">
            <Link to="/checkout">
              Zur Kasse <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
