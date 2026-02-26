import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ArrowRight, Tag, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PageTransition from "@/components/PageTransition";
import SEOHead from "@/components/SEOHead";

const CartPage = () => {
  const { items, removeItem, updateQuantity, subtotal, shippingCost, total, discount, discountCode, applyDiscount, removeDiscount } = useCart();
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const { toast } = useToast();

  const handleApplyCoupon = () => {
    setCouponError("");
    if (applyDiscount(coupon.trim())) {
      toast({ title: "Rabattcode angewendet", description: "10 % Rabatt auf deine Bestellung." });
      setCoupon("");
    } else {
      setCouponError("Ungültiger Rabattcode.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <SEOHead title="Warenkorb — FOCUSWERK" description="Dein FOCUSWERK-Warenkorb ist leer. Entdecke unsere Premium-Schreibtischunterlage." noindex />
        <p className="text-lg font-semibold text-foreground">Dein Warenkorb ist leer</p>
        <p className="mt-2 text-sm text-muted-foreground">Entdecke unsere Produkte und finde deine Essentials.</p>
        <Button asChild className="mt-6 rounded-none px-8 text-sm uppercase tracking-[0.15em]">
          <Link to="/shop">Jetzt einkaufen</Link>
        </Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <SEOHead title="Warenkorb — FOCUSWERK" description="Dein FOCUSWERK-Warenkorb. Überprüfe deine Bestellung und gehe zur Kasse." noindex />
    <div className="container py-12">
      <h1 className="text-2xl font-bold text-foreground">Warenkorb</h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y divide-border border-y border-border">
            {items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-4 py-6">
                <div className="h-20 w-20 shrink-0 border border-border overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-contain bg-white" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">IMG</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.variantName}</p>
                  <div className="mt-3 flex items-center border border-border w-fit">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-foreground hover:bg-muted"
                      aria-label="Menge verringern"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="flex h-8 w-10 items-center justify-center border-x border-border text-xs text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-foreground hover:bg-muted"
                      aria-label="Menge erhöhen"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")} &euro;
                  </p>
                  <button onClick={() => removeItem(item.variantId)} className="mt-2 text-muted-foreground hover:text-foreground" aria-label="Artikel entfernen">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-border p-6 h-fit">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-foreground">Bestellübersicht</p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Zwischensumme</span>
              <span>{subtotal.toFixed(2).replace(".", ",")} &euro;</span>
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
            <div className="border-t border-border pt-3">
              <div className="flex justify-between font-semibold text-foreground">
                <span>Gesamt</span>
                <span>{total.toFixed(2).replace(".", ",")} &euro;</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">inkl. MwSt.</p>
            </div>
          </div>

          <div className="mt-6">
            {discountCode ? (
              <div className="flex items-center justify-between border border-green-200 bg-green-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-green-700" />
                  <span className="text-xs font-medium text-green-800">{discountCode} (−10 %)</span>
                </div>
                <button onClick={removeDiscount} className="text-green-600 hover:text-green-800" aria-label="Rabatt entfernen">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Rabattcode"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                  className="rounded-none text-sm"
                />
                <Button variant="outline" className="shrink-0 rounded-none text-xs uppercase tracking-wider" onClick={handleApplyCoupon}>
                  Einlösen
                </Button>
              </div>
            )}
            {couponError && <p className="mt-1 text-xs text-destructive">{couponError}</p>}
          </div>

          <Button asChild size="lg" className="mt-6 w-full rounded-none text-sm uppercase tracking-[0.15em]">
            <Link to="/checkout">
              Zur Kasse <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default CartPage;
