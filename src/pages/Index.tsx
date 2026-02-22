import { Link } from "react-router-dom";
import { ArrowRight, Star, Maximize2, MousePointer, ShieldCheck, Layers, Square } from "lucide-react";
import deskMatHero from "@/assets/desk-mat-hero.png";
import deskBefore from "@/assets/desk-before.png";
import { products, faqData, reviewsData } from "@/data/products";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const product = products[0];

const features = [
  { icon: Maximize2, title: "90x45 cm Vollflächig", desc: "Bedeckt deinen gesamten Arbeitsplatz" },
  { icon: MousePointer, title: "Präzise Tracking-Oberfläche", desc: "Ultra-glatte Mikrofaser" },
  { icon: ShieldCheck, title: "Anti-Rutsch-Gummibasis", desc: "Bleibt genau dort, wo du sie platzierst" },
  { icon: Layers, title: "3 mm Komfort-Dicke", desc: "Entwickelt für ganztägige Nutzung" },
  { icon: Square, title: "Tiefes Mattschwarz", desc: "Dezentes tonales Logo" },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="section-dark">
        <div className="container flex min-h-[90vh] flex-col items-center justify-center py-24 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.4em] text-[hsl(var(--section-dark-muted))]">
            First Drop — Limitierte Stückzahl
          </p>
          <h1 className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
            Kontrolle beginnt auf<br />deinem Schreibtisch.
          </h1>
          <p className="mt-6 max-w-lg text-base text-[hsl(var(--section-dark-muted))] md:text-lg">
            90×45 cm kompromisslose Struktur für deinen Arbeitsplatz.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-none bg-white px-10 text-sm uppercase tracking-[0.15em] text-black hover:bg-white/90">
              <Link to="/shop">DESK MAT 01 ENTDECKEN <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-none border-white/20 bg-transparent px-10 text-sm uppercase tracking-[0.15em] text-white hover:bg-white/10">
              <Link to="/philosophy">Unsere Philosophie</Link>
            </Button>
          </div>

          {/* Product Image Placeholder */}
          <div className="mt-16 w-full max-w-3xl">
            <img
              src={deskMatHero}
              alt="FOKUSWERK DESK MAT 01 — Premium-Schreibtischunterlage auf einem minimalistischen Schreibtisch"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Dein Arbeitsplatz spiegelt deinen Fokus.
          </h2>
          <div className="mt-8 space-y-2 text-base text-muted-foreground md:text-lg">
            <p>Die meisten Schreibtische sind chaotisch.</p>
            <p>Kabel. Lärm. Ablenkung.</p>
            <p className="font-medium text-foreground">Fokus beginnt mit Struktur.</p>
          </div>
        </div>

        {/* Before/After */}
        <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-2">
          <div className="border border-border overflow-hidden">
            <img src={deskBefore} alt="Vorher — Unordentlicher Schreibtisch" className="w-full h-full object-cover aspect-[4/3]" />
          </div>
          <div className="border border-foreground bg-card p-8">
            <div className="flex aspect-[4/3] items-center justify-center text-sm text-foreground">
              Nachher — FOKUSWERK Setup
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border">
        <div className="container py-24">
          <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Durchdachte Details
          </p>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Designed für Performance.
          </h2>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 md:grid-cols-5">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <f.icon className="mx-auto mb-4 h-6 w-6 text-foreground" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="container py-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="border border-border p-6">
            <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
              Vollflächige Abdeckung
            </div>
          </div>
          <div className="border border-border p-6">
            <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
              Textur-Nahaufnahme
            </div>
          </div>
          <div className="border border-border p-6">
            <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
              Seitenansicht — 3 mm Dicke
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-dark">
        <div className="container py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Fokus wird gebaut.
            </h2>
            <div className="mt-8 space-y-4 text-base text-[hsl(var(--section-dark-muted))] md:text-lg">
              <p>FOKUSWERK wurde geschaffen, um Ablenkung zu eliminieren.</p>
              <p>Jedes Detail dient einem Zweck: Kontrolle.</p>
              <p className="font-medium text-white">Dein Arbeitsplatz sollte deine Ambitionen unterstützen.</p>
            </div>
            <Button asChild variant="outline" size="lg" className="mt-10 rounded-none border-white/20 bg-transparent px-10 text-sm uppercase tracking-[0.15em] text-white hover:bg-white/10">
              <Link to="/philosophy">Philosophie lesen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Product Card */}
      <section className="container py-24">
        <div className="mx-auto grid max-w-4xl items-center gap-12 md:grid-cols-2">
          <div className="border border-border p-8">
            <div className="flex aspect-square items-center justify-center text-sm text-muted-foreground">
              DESK MAT 01
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
              First Drop
            </p>
            <h3 className="mt-3 text-2xl font-bold text-foreground">{product.name}</h3>
            <p className="mt-3 text-muted-foreground">{product.shortDescription}</p>
            <p className="mt-6 text-3xl font-bold text-foreground">
              {product.variants[0].price},00 &euro;
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Kostenloser Versand EU. 14 Tage Rückgabe.</p>
            <Button asChild size="lg" className="mt-8 rounded-none px-10 text-sm uppercase tracking-[0.15em]">
              <Link to="/shop">Jetzt kaufen</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-y border-border">
        <div className="container py-24">
          <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            Das sagen unsere Kunden
          </p>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {reviewsData.map((r, i) => (
              <div key={i} className="border border-border p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">„{r.text}"</p>
                <div className="mt-6">
                  <p className="text-xs font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-24">
        <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
          FAQ
        </p>
        <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground">
          Häufige Fragen
        </h2>
        <div className="mx-auto mt-12 max-w-2xl">
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
      </section>
    </div>
  );
};

export default Index;