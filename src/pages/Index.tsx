import { Link } from "react-router-dom";
import { ArrowRight, Star, Maximize2, MousePointer, ShieldCheck, Layers, Square, Clock } from "lucide-react";
import deskMatHero from "@/assets/desk-mat-hero.png";
import deskBefore from "@/assets/desk-before.png";
import deskAfter from "@/assets/desk-after.png";
import deskTexture from "@/assets/desk-texture.png";
import deskFullcover from "@/assets/desk-fullcover.png";
import deskMatProduct from "@/assets/desk-mat-product.png";
import { products, faqData, reviewsData } from "@/data/products";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";

const product = products[0];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    ...faqData.produkt,
    ...faqData.versand,
    ...faqData.rueckgabe,
  ].map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const features = [
  { icon: Maximize2, title: "90x45 cm Vollflächig", desc: "Bedeckt deinen gesamten Arbeitsplatz" },
  { icon: MousePointer, title: "Präzise Tracking-Oberfläche", desc: "Ultra-glatte Mikrofaser" },
  { icon: ShieldCheck, title: "Anti-Rutsch-Gummibasis", desc: "Bleibt genau dort, wo du sie platzierst" },
  { icon: Layers, title: "4 mm Komfort-Dicke", desc: "Entwickelt für ganztägige Nutzung" },
  { icon: Square, title: "Tiefes Mattschwarz", desc: "Dezentes tonales Logo" },
];

const Index = () => {
  return (
    <div>
      <SEOHead
        title="FOCUSWERK — Premium-Schreibtischunterlage | 90x45 cm"
        description="FOCUSWERK DESK MAT 01 — Premium-Schreibtischunterlage für Klarheit und Kontrolle. 90x45 cm. Tiefes Mattschwarz. Kostenloser Versand EU."
        canonical="https://focuswerk.de/"
        jsonLd={faqJsonLd}
      />
      <section className="section-dark">
        <div className="container flex min-h-[90vh] flex-col items-center justify-center py-24 text-center">
          <p className="animate-fade-in text-xs font-medium uppercase tracking-[0.4em] text-[hsl(var(--section-dark-muted))]">
            Pre-Order — Limitierte Stückzahl
          </p>
          <h1 className="mt-6 animate-fade-in text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
            Kontrolle beginnt auf<br />deinem Schreibtisch.
          </h1>
          <p className="mt-6 max-w-lg animate-fade-in text-base text-[hsl(var(--section-dark-muted))] md:text-lg" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            90×45 cm kompromisslose Struktur für deinen Arbeitsplatz.
          </p>

          {/* Pre-Order Hint */}
          <div className="mt-4 animate-fade-in inline-flex items-center gap-2 border border-amber-400/40 bg-amber-400/10 px-4 py-2" style={{ animationDelay: "375ms", animationFillMode: "both" }}>
            <Clock className="h-3.5 w-3.5 text-amber-300" strokeWidth={2} />
            <span className="text-xs font-medium text-amber-200">Pre-Order — Versand ab 07.04.2026</span>
          </div>

          <div className="mt-10 flex animate-fade-in flex-col gap-4 sm:flex-row" style={{ animationDelay: "450ms", animationFillMode: "both" }}>
            <Button asChild size="lg" className="rounded-none bg-white px-10 text-sm uppercase tracking-[0.15em] text-black hover:bg-white/90">
              <Link to="/shop">JETZT VORBESTELLEN <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-none border-white/20 bg-transparent px-10 text-sm uppercase tracking-[0.15em] text-white hover:bg-white/10">
              <Link to="/philosophy">Unsere Philosophie</Link>
            </Button>
          </div>

          <div className="mt-16 w-full max-w-3xl animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "both" }}>
            <img
              src={deskMatHero}
              alt="FOCUSWERK DESK MAT 01 — Premium-Schreibtischunterlage auf einem minimalistischen Schreibtisch"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container py-24 md:py-32">
        <ScrollReveal>
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
        </ScrollReveal>

        <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-2">
          <ScrollReveal delay={100}>
            <div className="border border-border overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <img src={deskBefore} alt="Vorher — Unordentlicher Schreibtisch ohne FOCUSWERK Desk Mat" loading="lazy" className="w-full h-full object-cover aspect-[4/3]" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <div className="border border-foreground overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <img src={deskAfter} alt="Nachher — Aufgeräumter Schreibtisch mit FOCUSWERK Desk Mat" loading="lazy" className="w-full h-full object-cover aspect-[4/3]" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-border">
        <div className="container py-24">
          <ScrollReveal>
            <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Durchdachte Details
            </p>
            <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Designed für Performance.
            </h2>
          </ScrollReveal>
          <div className="mt-16 grid gap-12 sm:grid-cols-2 md:grid-cols-5">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 100}>
                <div className="text-center transition-transform duration-300 hover:-translate-y-1">
                  <f.icon className="mx-auto mb-4 h-6 w-6 text-foreground" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-foreground">{f.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="container py-24">
        <div className="grid gap-6 md:grid-cols-2">
          <ScrollReveal delay={0}>
            <div className="border border-border overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <img src={deskFullcover} alt="FOCUSWERK Desk Mat vollflächige Schreibtischabdeckung" loading="lazy" className="w-full aspect-square object-cover" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div className="border border-border overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <img src={deskTexture} alt="FOCUSWERK Mikrofaser-Oberflächentextur Nahaufnahme" loading="lazy" className="w-full aspect-square object-cover" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-dark">
        <div className="container py-24 md:py-32">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
                Fokus wird gebaut.
              </h2>
              <div className="mt-8 space-y-4 text-base text-[hsl(var(--section-dark-muted))] md:text-lg">
                <p>FOCUSWERK wurde geschaffen, um Ablenkung zu eliminieren.</p>
                <p>Jedes Detail dient einem Zweck: Kontrolle.</p>
                <p className="font-medium text-white">Dein Arbeitsplatz sollte deine Ambitionen unterstützen.</p>
              </div>
              <Button asChild variant="outline" size="lg" className="mt-10 rounded-none border-white/20 bg-transparent px-10 text-sm uppercase tracking-[0.15em] text-white hover:bg-white/10">
                <Link to="/philosophy">Philosophie lesen</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Product Card */}
      <section className="container py-24">
        <ScrollReveal>
          <div className="mx-auto grid max-w-4xl items-center gap-12 md:grid-cols-2">
            <div className="border border-border overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
              <img src={deskMatProduct} alt="FOCUSWERK DESK MAT 01 Produktansicht" loading="lazy" className="w-full aspect-square object-contain bg-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                  Pre-Order
                </p>
                <span className="inline-flex items-center gap-1 border border-amber-400/50 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                  <Clock className="h-3 w-3" /> Ab 07.04.2026
                </span>
              </div>
              <h3 className="mt-3 text-2xl font-bold text-foreground">{product.name}</h3>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{product.shortDescription}</p>
              <p className="mt-6 text-3xl font-bold text-foreground">
                {product.variants[0].price},00 &euro;
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Kostenloser Versand EU. 14 Tage Rückgabe.</p>
              <Button asChild size="lg" className="mt-8 rounded-none px-10 text-sm uppercase tracking-[0.15em]">
                <Link to="/shop">Jetzt vorbestellen</Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Reviews */}
      <section className="border-y border-border">
        <div className="container py-24">
          <ScrollReveal>
            <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
              Das sagen unsere Kunden
            </p>
          </ScrollReveal>
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {reviewsData.map((r, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="border border-border p-8 transition-all duration-300 hover:border-foreground/30 hover:shadow-sm">
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-24">
        <ScrollReveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.4em] text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground">
            Häufige Fragen
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <div className="mx-auto mt-12 max-w-2xl space-y-12">
            {([
              { title: "Produkt", items: faqData.produkt },
              { title: "Versand", items: faqData.versand },
              { title: "Rückgabe", items: faqData.rueckgabe },
            ] as const).map((section) => (
              <div key={section.title}>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">{section.title}</p>
                <Accordion type="single" collapsible className="mt-4">
                  {section.items.map((f, i) => (
                    <AccordionItem key={i} value={`${section.title}-${i}`} className="border-border">
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
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Index;
