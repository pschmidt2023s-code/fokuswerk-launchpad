import { Link } from "react-router-dom";
import { ArrowRight, Star, Play, Shield, Zap, Box, Grip, Cable } from "lucide-react";
import { products, faqData, reviewsData } from "@/data/products";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const product = products[0];

const benefits = [
  { icon: Grip, title: "Sofort Ordnung", desc: "Jedes Kabel hat seinen Platz" },
  { icon: Zap, title: "Magnetkraft", desc: "Snap & Release in Sekunden" },
  { icon: Shield, title: "Premium Finish", desc: "Matt-schwarz, zeitlos elegant" },
  { icon: Box, title: "Einfache Montage", desc: "3M Klebepad — kein Bohren" },
  { icon: Cable, title: "Universell", desc: "USB-C, Lightning, Klinke & mehr" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="container py-20 md:py-32">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Kabelmanagement neu gedacht
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Mehr Fokus.<br />Weniger Chaos.
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              {product.shortDescription}
            </p>
            <div className="mt-8 flex gap-4">
              <Button asChild size="lg" className="rounded-none px-8 text-sm uppercase tracking-wider">
                <Link to="/product/fokuswerk-snap-system">Jetzt entdecken <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          <div className="order-1 flex items-center justify-center md:order-2">
            <div className="aspect-square w-full max-w-md rounded-sm border border-border bg-card p-8">
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Produktbild-Platzhalter
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-card">
        <div className="container py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
            {benefits.map((b) => (
              <div key={b.title} className="text-center">
                <b.icon className="mx-auto mb-3 h-6 w-6 text-foreground" />
                <p className="text-sm font-semibold text-foreground">{b.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Placeholder */}
      <section className="container py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex aspect-video items-center justify-center rounded-sm border border-border bg-card">
            <div className="text-center">
              <Play className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Magnet Snap Demo — Video-Platzhalter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bestseller Card */}
      <section className="border-y border-border bg-card">
        <div className="container py-16">
          <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Bestseller
          </p>
          <div className="mx-auto grid max-w-3xl items-center gap-8 md:grid-cols-2">
            <div className="aspect-square rounded-sm border border-border bg-background p-6">
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Produktbild
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
              <p className="mt-2 text-muted-foreground text-sm">{product.shortDescription}</p>
              <p className="mt-4 text-2xl font-bold text-foreground">
                ab {product.variants[0].price.toFixed(2).replace(".", ",")} €
              </p>
              <Button asChild className="mt-6 rounded-none px-8 text-sm uppercase tracking-wider">
                <Link to="/product/fokuswerk-snap-system">Zum Produkt</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="container py-20">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Das sagen unsere Kunden
        </p>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {reviewsData.map((r, i) => (
            <div key={i} className="rounded-sm border border-border bg-card p-6">
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">"{r.text}"</p>
              <p className="mt-4 text-xs font-semibold text-foreground">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-card">
        <div className="container py-20">
          <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Häufige Fragen
          </p>
          <div className="mx-auto max-w-2xl">
            <Accordion type="single" collapsible>
              {faqData.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-sm text-foreground hover:no-underline">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
