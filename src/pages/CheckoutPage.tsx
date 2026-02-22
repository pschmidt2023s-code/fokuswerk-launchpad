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
        <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
        <Button asChild className="mt-6 rounded-none px-8 text-sm uppercase tracking-[0.15em]">
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold text-foreground">Checkout</h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">First Name</Label>
              <Input className="rounded-none" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Last Name</Label>
              <Input className="rounded-none" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input className="rounded-none" type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Address</Label>
            <Input className="rounded-none" placeholder="Street and number" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Postal Code</Label>
              <Input className="rounded-none" placeholder="10115" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">City</Label>
              <Input className="rounded-none" placeholder="Berlin" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Country</Label>
            <Input className="rounded-none" value="Germany" readOnly />
          </div>

          <Button size="lg" className="mt-4 w-full rounded-none text-sm uppercase tracking-[0.15em]">
            Place Order
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            You will be redirected to Stripe for secure payment.
          </p>
        </div>

        <div className="border border-border p-6">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-foreground">Order Summary</p>
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
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2).replace(".", ",")} &euro;</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : `${shippingCost.toFixed(2).replace(".", ",")} \u20AC`}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground">
              <span>Total</span>
              <span>{total.toFixed(2).replace(".", ",")} &euro;</span>
            </div>
            <p className="text-xs text-muted-foreground">incl. VAT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
