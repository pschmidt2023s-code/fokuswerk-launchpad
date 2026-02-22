import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const product = products[0];

const ProductPage = () => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [mainImage, setMainImage] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      image: product.images[0],
    });
    toast({ title: "Zum Warenkorb hinzugefügt", description: `${product.name} — ${selectedVariant.name}` });
  };

  return (
    <div className="container py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-sm border border-border bg-card p-8">
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Hauptbild {mainImage + 1}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setMainImage(i)}
                className={`aspect-square rounded-sm border bg-card p-2 text-xs text-muted-foreground transition-colors ${
                  mainImage === i ? "border-foreground" : "border-border hover:border-muted-foreground"
                }`}
              >
                Bild {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">FOKUSWERK</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground">{product.name}</h1>
          <p className="mt-4 text-muted-foreground">{product.description}</p>

          {/* Variants */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variante</p>
            <div className="flex gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`rounded-sm border px-5 py-3 text-sm transition-colors ${
                    selectedVariant.id === v.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:border-muted-foreground"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-3xl font-bold text-foreground">
            {selectedVariant.price.toFixed(2).replace(".", ",")} €
          </p>
          <p className="mt-1 text-xs text-muted-foreground">inkl. MwSt., zzgl. Versand</p>

          <Button
            onClick={handleAddToCart}
            size="lg"
            className="mt-8 w-full rounded-none text-sm uppercase tracking-wider md:w-auto md:px-12"
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> In den Warenkorb
          </Button>

          {/* Benefits */}
          <ul className="mt-8 space-y-2">
            {product.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                {b}
              </li>
            ))}
          </ul>

          {/* Tabs */}
          <Tabs defaultValue="lieferumfang" className="mt-10">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger value="lieferumfang" className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-xs uppercase tracking-wider data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Lieferumfang
              </TabsTrigger>
              <TabsTrigger value="kompatibilitaet" className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-xs uppercase tracking-wider data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Kompatibilität
              </TabsTrigger>
              <TabsTrigger value="pflege" className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-xs uppercase tracking-wider data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none">
                Pflege
              </TabsTrigger>
            </TabsList>
            <TabsContent value="lieferumfang" className="pt-4">
              <ul className="space-y-2">
                {product.deliveryContents.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    {d}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="kompatibilitaet" className="pt-4">
              <ul className="space-y-2">
                {product.compatibility.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    {c}
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="pflege" className="pt-4">
              <ul className="space-y-2">
                {product.care.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    {c}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Cross-sell */}
      <section className="mt-20 border-t border-border pt-12">
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Ergänzend dazu
        </p>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {product.variants.filter((v) => v.id !== selectedVariant.id).map((v) => (
            <div key={v.id} className="rounded-sm border border-border bg-card p-6">
              <p className="font-semibold text-foreground">{v.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{v.price.toFixed(2).replace(".", ",")} €</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-none text-xs uppercase tracking-wider"
                onClick={() => {
                  addItem({
                    variantId: v.id,
                    productId: product.id,
                    name: product.name,
                    variantName: v.name,
                    price: v.price,
                    image: product.images[0],
                  });
                  toast({ title: "Hinzugefügt", description: `${v.name}` });
                }}
              >
                Hinzufügen
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
