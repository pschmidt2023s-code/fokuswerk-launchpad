import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage = () => (
  <div>
    <section className="section-dark">
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-[hsl(var(--section-dark-muted))]">
          Über uns
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
          Gebaut für Disziplin.
        </h1>
      </div>
    </section>

    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-2xl space-y-8 text-base leading-relaxed text-muted-foreground md:text-lg">
        <p>
          FOKUSWERK entstand aus einer einfachen Beobachtung: Die Produkte, die an Menschen vermarktet werden,
          die am Schreibtisch arbeiten, sind entweder billig, hässlich oder für Gamer designt. Keine davon
          spiegelt die Disziplin und Klarheit wider, die ernsthafte Arbeit erfordert.
        </p>
        <p>
          Wir haben uns vorgenommen, Arbeitsplatz-Essentials zu schaffen, die den Ambitionen ihrer Besitzer entsprechen.
          Produkte, die minimal, funktional und kompromisslos in der Qualität sind.
        </p>
        <p className="font-medium text-foreground">
          Kein RGB. Keine Logos, die um Aufmerksamkeit schreien. Keine unnötigen Features.
        </p>
        <p>
          Nur hochwertige Materialien, durchdachtes Design und tiefer Respekt für die Arbeit, die du machst.
          FOKUSWERK ist für Unternehmer, Entwickler, Kreative und Studenten, die verstehen,
          dass die Umgebung das Ergebnis formt.
        </p>
        <p>
          Die DESK MAT 01 ist unser erstes Produkt. Sie ist das Fundament. Mehr kommt.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl text-center">
        <Button asChild size="lg" className="rounded-none px-10 text-sm uppercase tracking-[0.15em]">
          <Link to="/shop">Kollektion entdecken</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default AboutPage;