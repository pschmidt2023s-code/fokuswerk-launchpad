import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { products, reviewsData } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import shop1 from "@/assets/shop-1.png";
import shop2 from "@/assets/shop-2.png";
import shop3 from "@/assets/shop-3.png";
import shop4 from "@/assets/shop-4.png";
import shop5 from "@/assets/shop-5.png";

const product = products[0];
const shopImages = [shop1, shop2, shop3, shop4, shop5];

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "FOCUSWERK DESK MAT 01",
  description: "Premium-Schreibtischunterlage 90×45 cm. Tiefes Mattschwarz, Anti-Rutsch-Gummibasis, 4 mm Komfort-Dicke. Minimalist workspace mat designed in Germany.",
  brand: { "@type": "Brand", name: "FOCUSWERK" },
  sku: "FW-DM-01",
  mpn: "FW-DM-01",
  color: "Mattschwarz",
  material: "Mikrofaser / Gummi",
  size: "90 × 45 cm",
  image: "https://focuswerk.de/logo.png",
  offers: {
    "@type": "Offer",
    price: "55.00",
    priceCurrency: "EUR",
    availability: "https://schema.org/PreOrder",
    url: "https://focuswerk.de/shop",
    priceValidUntil: "2026-12-31",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@type": "Organization", name: "FOCUSWERK" },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "EUR" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "DE" },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
    },
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "4", bestRating: "5" },
  review: reviewsData.map(r => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.text,
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://focuswerk.de/" },
    { "@type": "ListItem", position: 2, name: "Shop", item: "https://focuswerk.de/shop" },
    { "@type": "ListItem", position: 3, name: "DESK MAT 01", item: "https://focuswerk.de/shop" },
  ],
};

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
  const [transitioning, setTransitioning] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const variant = product.variants[0];

  const handleAddToCart = () => {
    addItem(
      {
        variantId: variant.id,
        productId: product.id,
        name: product.name,
        variantName: variant.name,
        price: variant.price,
        image: shopImages[0],
      },
      quantity
    );
    toast({ title: "Zum Warenkorb hinzugefügt", description: `${product.name} x${quantity}` });
    setTransitioning(true);
    setTimeout(() => navigate("/cart"), 400);
  };

  return (
    <div className={`transition-opacity duration-400 ${transitioning ? "opacity-0 scale-[0.98] transition-all" : "opacity-100"}`}>
      <SEOHead
        title="FOCUSWERK DESK MAT 01 — Premium Schreibtischunterlage 90×45 cm"
        description="FOCUSWERK DESK MAT 01: Premium Schreibtischunterlage aus Deutschland. 90×45 cm, Mattschwarz, Anti-Rutsch-Gummibasis, 4 mm dick. Ab 55 € — kostenloser EU-Versand. Jetzt vorbestellen."
        canonical="https://focuswerk.de/shop"
        type="product"
        image="https://focuswerk.de/logo.png"
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="container pt-6">
        <ol className="flex items-center gap-2 text-xs text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">DESK MAT 01</li>
        </ol>
      </nav>

      <div className="container py-8 md:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Gallery */}
          <div>
            <div className="border border-border overflow-hidden">
              <img src={shopImages[mainImage]} alt={`FOCUSWERK DESK MAT 01 — Premium Schreibtischunterlage Bild ${mainImage + 1}`} className="w-full aspect-square object-contain bg-white" width={600} height={600} />
            </div>
            <div className="mt-4 grid grid-cols-5 gap-3">
              {shopImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  aria-label={`Produktbild ${i + 1} anzeigen`}
                  className={`border overflow-hidden transition-colors ${
                    mainImage === i ? "border-foreground" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img} alt={`FOCUSWERK DESK MAT 01 Thumbnail ${i + 1}`} className="w-full aspect-square object-contain bg-white" loading="lazy" width={120} height={120} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">FOCUSWERK</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">{product.name}</h1>

            <div className="mt-4 inline-flex items-center gap-2 border border-amber-400 bg-amber-50 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-700" strokeWidth={2} aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">Pre-Order — Versand ab 07.04.2026</span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Kein Gaming-Mousepad. Ein Fundament für Fokus. Das FOCUSWERK DESK MAT 01 ist eine Premium-Schreibtischunterlage 
              für professionelle Arbeitsplätze — 90×45 cm, tiefes Mattschwarz, minimalistisch und funktional. Designed in Germany.
            </p>

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
                  aria-label="Menge verringern"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-12 w-16 items-center justify-center border-x border-border text-sm font-medium text-foreground">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-12 w-12 items-center justify-center text-foreground hover:bg-muted"
                  aria-label="Menge erhöhen"
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
              <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" /> Jetzt vorbestellen
            </Button>

            {/* Trust Badges */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Pre-Order — Versand ab 07.04.2026</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Kostenloser Versand EU</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RotateCcw className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>14 Tage Rückgaberecht</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Versand aus Deutschland</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Sichere Zahlung</span>
              </div>
            </div>

            {/* Specs */}
            <div className="mt-8 border-t border-border pt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Performance</h2>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  90 × 45 cm Vollfläche
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  4 mm Komfort-Dicke
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  Ultra-glatte Mikrofaser
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Kontrolle</h2>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  Anti-Rutsch-Gummibasis
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  Tiefes Mattschwarz
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" strokeWidth={1.5} aria-hidden="true" />
                  Dezentes tonales Logo
                </li>
              </ul>
            </div>

            {/* Care */}
            <div className="mt-8 border-t border-border pt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Pflege</h2>
              <ul className="mt-4 space-y-2">
                {product.careInstructions.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Material & Verarbeitung */}
            <div className="mt-8 border-t border-border pt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Material & Verarbeitung</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Die Oberfläche des FOCUSWERK DESK MAT 01 besteht aus hochdichter Mikrofaser — ultra-glatt, schmutzabweisend 
                  und optimiert für präzises Maus-Tracking. Ob optische oder Laser-Maus: Die Oberfläche bietet gleichmäßige 
                  Kontrolle über die gesamte Fläche von 90×45 cm.
                </p>
                <p>
                  Die Unterseite ist aus einer Anti-Rutsch-Gummibasis gefertigt, die das Desk Mat sicher auf jedem Schreibtisch 
                  fixiert — auch auf glatten Oberflächen wie Glas oder lackiertem Holz. Mit 4 mm Dicke bietet die 
                  Schreibtischunterlage optimalen Komfort für ganztägiges Arbeiten, ohne dabei wulstig oder instabil zu wirken.
                </p>
                <p>
                  Jedes FOCUSWERK Desk Mat wird in Zusammenarbeit mit spezialisierten Produktionspartnern gefertigt. 
                  Vor dem Versand wird jede Charge in Deutschland geprüft — Materialqualität, Verarbeitung, Maßhaltigkeit. 
                  Kein Produkt verlässt unser Lager ohne Qualitätskontrolle. Das dezente tonale Logo wird präzise aufgebracht 
                  und fügt sich nahtlos in das minimalistische Design ein.
                </p>
              </div>
            </div>

            {/* Versand & Rückgabe */}
            <div className="mt-8 border-t border-border pt-8">
              <h2 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Versand & Rückgabe</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="text-foreground">Kostenloser Versand</strong> in alle EU-Länder. Der Versand erfolgt aus Deutschland 
                  mit einer Lieferzeit von 5–8 Werktagen nach Versandbeginn.
                </p>
                <p>
                  <strong className="text-foreground">Pre-Order:</strong> Der Versand beginnt ab dem 07.04.2026. Du sicherst dir 
                  dein Produkt jetzt zum aktuellen Preis.
                </p>
                <p>
                  <strong className="text-foreground">14 Tage Rückgaberecht</strong> — ohne Angabe von Gründen. Das Produkt muss 
                  unbenutzt und in der Originalverpackung zurückgesendet werden. Details findest du in unserer{" "}
                  <Link to="/returns" className="underline underline-offset-4 hover:text-foreground">Widerrufsbelehrung</Link>.
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-8">
              <p className="text-sm leading-relaxed text-muted-foreground">
                FOCUSWERK wurde entwickelt, um Ablenkung zu reduzieren. Jede Oberfläche, jede Kante, jede Entscheidung dient einem Zweck: Kontrolle.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                <Link to="/philosophy" className="underline underline-offset-4 hover:text-foreground">Unsere Philosophie</Link>
                {" · "}
                <Link to="/returns" className="underline underline-offset-4 hover:text-foreground">Rückgabe & Widerruf</Link>
                {" · "}
                <Link to="/contact" className="underline underline-offset-4 hover:text-foreground">Kontakt</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
