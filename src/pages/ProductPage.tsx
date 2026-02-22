import { useState, useEffect, useRef } from "react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import shop1 from "@/assets/shop-1.png";
import shop2 from "@/assets/shop-2.png";
import shop3 from "@/assets/shop-3.png";
import shop4 from "@/assets/shop-4.png";
import shop5 from "@/assets/shop-5.png";

const product = products[0];
const shopImages = [shop1, shop2, shop3, shop4, shop5];

const StockBar = ({ stock }: { stock: number }) => {
  const totalStock = 25;
  const remaining = Math.round((stock / totalStock) * 100);
  const [animated, setAnimated] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(remaining); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [remaining]);

  return (
    <div className="mt-4" ref={ref}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          DESK MAT 01 — Limitiert
        </p>
        <p className="text-xs font-bold text-foreground">{stock} / {totalStock}</p>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden bg-muted">
        <div
          className="h-full bg-foreground transition-all duration-1000 ease-out"
          style={{ width: `${animated}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {remaining <= 20 ? "⚡ Fast ausverkauft" : `${remaining}% verfügbar`}
      </p>
    </div>
  );
};

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
    toast({ title: "Zum Warenkorb hinzugefügt", description: `${product.name} x${quantity}` });
  };

  return (
    <div>
      <div className="container py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Gallery */}
          <div>
            <div className="border border-border overflow-hidden">
              <img src={shopImages[mainImage]} alt={`FOKUSWERK DESK MAT 01 — Bild ${mainImage + 1}`} className="w-full aspect-square object-contain bg-white" />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {shopImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`border overflow-hidden transition-colors ${
                    mainImage === i ? "border-foreground" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full aspect-square object-contain bg-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">FOKUSWERK</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{product.name}</h1>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Low stock - animated */}
            {variant.stock <= 25 && <StockBar stock={variant.stock} />}

            <p className="mt-8 text-4xl font-bold text-foreground">
              {variant.price},00 &euro;
            </p>
            <p className="mt-1 text-xs text-muted-foreground">inkl. MwSt., kostenloser Versand EU</p>

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
              <ShoppingBag className="mr-2 h-4 w-4" /> In den Warenkorb
            </Button>

            {/* Micro-Trust Badges */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>Kostenloser Versand EU</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>14 Tage Rückgaberecht</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>Versand aus Deutschland</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                <span>Sichere Zahlung</span>
              </div>
            </div>

            {/* Specs */}
            <div className="mt-8 border-t border-border pt-8">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Performance</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
                  90 × 45 cm Vollfläche
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
                  4 mm Komfort-Dicke
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
                  Ultra-glatte Mikrofaser
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Kontrolle</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
                  Anti-Rutsch-Gummibasis
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
                  Tiefes Mattschwarz
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} />
                  Dezentes tonales Logo
                </li>
              </ul>
            </div>

            {/* Care */}
            <div className="mt-8 border-t border-border pt-8">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Pflege</p>
              <ul className="mt-4 space-y-2">
                {product.careInstructions.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                FOKUSWERK wurde entwickelt, um Ablenkung zu reduzieren.
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                Jede Oberfläche, jede Kante, jede Entscheidung dient einem Zweck: Kontrolle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;