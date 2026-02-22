import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus, ShoppingBag, Truck, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const product = products[0];

const ProductPage = () => {
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  const variant = product.variants[0];

  const handleAddToCart = () => {
    addItem(
      {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        variantName: variant.name,
        price: variant.price,
        image: product.images[0],
      },
      quantity
    );
    toast({ title: "Added to cart", description: `${product.name} x${quantity}` });
  };

  return (
    <div>
      <div className="container py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Gallery */}
          <div>
            <div className="border border-border p-8">
              <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
                Product Image {mainImage + 1}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`border p-3 text-xs text-muted-foreground transition-colors ${
                    mainImage === i ? "border-foreground" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">FOKUSWERK</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{product.name}</h1>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Low stock */}
            {variant.stock <= 50 && (
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Limited — Only {variant.stock} left
              </p>
            )}

            <p className="mt-8 text-4xl font-bold text-foreground">
              {variant.price},00 &euro;
            </p>
            <p className="mt-1 text-xs text-muted-foreground">incl. VAT, free shipping EU</p>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-12 w-12 items-center justify-center text-foreground hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-16 items-center justify-center border-x border-border text-sm font-medium text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-12 w-12 items-center justify-center text-foreground hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="mt-6 w-full rounded-none py-6 text-sm uppercase tracking-[0.15em] md:w-auto md:px-16"
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
            </Button>

            {/* Shipping info */}
            <div className="mt-8 space-y-3 border-t border-border pt-8">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Truck className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>5-8 business days EU shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                <span>14-day return policy</span>
              </div>
            </div>

            {/* Specs */}
            <div className="mt-8 border-t border-border pt-8">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Specifications</p>
              <ul className="mt-4 space-y-2">
                {product.specs.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Care */}
            <div className="mt-8 border-t border-border pt-8">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Care</p>
              <ul className="mt-4 space-y-2">
                {product.careInstructions.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile ATC */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background p-4 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">{variant.price},00 &euro;</p>
            <p className="text-xs text-muted-foreground">{product.name}</p>
          </div>
          <Button onClick={handleAddToCart} className="rounded-none px-8 text-xs uppercase tracking-wider">
            <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>

      {/* Bottom spacer for mobile sticky */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

export default ProductPage;
