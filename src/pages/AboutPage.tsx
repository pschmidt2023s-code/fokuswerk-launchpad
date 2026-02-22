import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";

const AboutPage = () => (
  <div>
    {/* Hero */}
    <section className="section-dark">
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <p className="animate-fade-in text-xs font-medium uppercase tracking-[0.4em] text-[hsl(var(--section-dark-muted))]">
          Über uns – FOKUSWERK
        </p>
        <h1 className="mt-6 animate-fade-in text-4xl font-bold tracking-tight text-white md:text-6xl" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
          Fokus wird nicht gefunden.
        </h1>
        <p className="mt-4 animate-fade-in text-lg text-[hsl(var(--section-dark-muted))] md:text-xl" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          Er wird gebaut.
        </p>
      </div>
    </section>

    {/* Intro */}
    <section className="container py-24 md:py-32">
      <ScrollReveal>
        <div className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            FOKUSWERK ist aus einer einfachen Beobachtung entstanden:<br />
            Die meisten Arbeitsplätze sind laut. Visuell. Überladen. Ablenkend.
          </p>
          <p className="font-medium text-foreground">
            RGB. Logos. Unruhe.
          </p>
          <p>
            Aber echte Leistung entsteht nicht im Chaos.<br />
            Sie entsteht in Struktur.
          </p>
        </div>
      </ScrollReveal>
    </section>

    {/* Warum */}
    <section className="section-dark">
      <div className="container py-24 md:py-32">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-[hsl(var(--section-dark-muted))] md:text-lg">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Warum FOKUSWERK existiert
            </h2>
            <p className="font-medium text-white">Deine Umgebung formt dein Ergebnis.</p>
            <p>
              Ein unruhiger Arbeitsplatz erzeugt einen unruhigen Geist.<br />
              Unordnung kostet Energie.<br />
              Ablenkung kostet Tiefe.
            </p>
            <p>FOKUSWERK wurde geschaffen, um genau das zu eliminieren.</p>
            <p>
              Nicht durch mehr Features.<br />
              Sondern durch Reduktion.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Philosophie */}
    <section className="container py-24 md:py-32">
      <ScrollReveal>
        <div className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Unsere Philosophie
          </h2>
          <p className="font-medium text-foreground">
            Struktur ist keine Einschränkung.<br />
            Struktur ist Freiheit.
          </p>
          <p>
            Wenn jeder Gegenstand auf deinem Schreibtisch einen Zweck erfüllt,<br />
            entsteht Klarheit.
          </p>
          <p className="font-medium text-foreground">
            Und Klarheit ist das Fundament für Leistung.
          </p>
          <p>Wir entwickeln Produkte nach einem Prinzip:</p>
          <p>
            Keine unnötigen Funktionen.<br />
            Keine visuelle Ablenkung.<br />
            Keine ästhetischen Kompromisse.
          </p>
          <p className="font-medium text-foreground">Nur das, was deinen Fokus unterstützt.</p>
        </div>
      </ScrollReveal>
    </section>

    {/* Anspruch */}
    <section className="section-dark">
      <div className="container py-24 md:py-32">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-[hsl(var(--section-dark-muted))] md:text-lg">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Unser Anspruch
            </h2>
            <p>
              FOKUSWERK ist kein Gaming-Accessoire.<br />
              Es ist kein Trendprodukt.<br />
              Es ist ein Werkzeug.
            </p>
            <p>
              Ein Fundament für konzentrierte Arbeit.<br />
              Für Menschen, die ernsthaft bauen, denken, entwickeln.
            </p>
            <p>
              Jedes Detail dient einem Zweck.<br />
              Jede Oberfläche ist bewusst gestaltet.<br />
              Jede Entscheidung folgt der Funktion.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* First Drop */}
    <section className="container py-24 md:py-32">
      <ScrollReveal>
        <div className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            First Drop
          </h2>
          <p>
            Wir starten bewusst klein.<br />
            Limitierte Stückzahl.<br />
            Kein Massenprodukt.
          </p>
          <p className="font-medium text-foreground">
            Qualität vor Quantität.<br />
            Substanz vor Hype.
          </p>
        </div>
      </ScrollReveal>
    </section>

    {/* Für wen */}
    <section className="section-dark">
      <div className="container py-24 md:py-32">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl space-y-6 text-base leading-relaxed text-[hsl(var(--section-dark-muted))] md:text-lg">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Für wen wir bauen
            </h2>
            <p>Für Menschen, die:</p>
            <ul className="space-y-2 pl-4">
              <li>Klarheit über Chaos stellen</li>
              <li>Tiefe über Geschwindigkeit</li>
              <li>Substanz über Lautstärke</li>
            </ul>
            <p>
              Wenn du deinen Arbeitsplatz bewusst gestaltest,<br />
              gestaltest du deine Arbeit bewusst.
            </p>
            <p>
              Und wenn du deine Arbeit bewusst gestaltest,<br />
              gestaltest du dein Ergebnis.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    {/* Closing */}
    <section className="container py-24 md:py-32">
      <ScrollReveal>
        <div className="mx-auto max-w-2xl space-y-6 text-center text-base leading-relaxed text-muted-foreground md:text-lg">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            FOKUSWERK
          </h2>
          <p className="font-medium text-foreground">
            Reduktion ist kein Verzicht.<br />
            Sie ist Entscheidung.
          </p>
          <div className="pt-8">
            <Button asChild size="lg" className="rounded-none px-10 text-sm uppercase tracking-[0.15em]">
              <Link to="/shop">Kollektion entdecken</Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  </div>
);

export default AboutPage;
