import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage = () => (
  <div>
    <section className="section-dark">
      <div className="container flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-[hsl(var(--section-dark-muted))]">
          About
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
          Built for Discipline.
        </h1>
      </div>
    </section>

    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-2xl space-y-8 text-base leading-relaxed text-muted-foreground md:text-lg">
        <p>
          FOKUSWERK was born from a simple observation: the tools marketed to people who work
          at desks are either cheap, ugly, or designed for gamers. None of them reflect the
          discipline and clarity that serious work demands.
        </p>
        <p>
          We set out to create workspace essentials that match the ambition of their owners.
          Products that are minimal, functional, and uncompromising in quality.
        </p>
        <p className="font-medium text-foreground">
          No RGB. No logos screaming for attention. No unnecessary features.
        </p>
        <p>
          Just premium materials, thoughtful design, and a deep respect for the work you do.
          FOKUSWERK is for entrepreneurs, developers, creators, and students who understand
          that environment shapes output.
        </p>
        <p>
          The DESK MAT 01 is our first product. It is the foundation. More is coming.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl text-center">
        <Button asChild size="lg" className="rounded-none px-10 text-sm uppercase tracking-[0.15em]">
          <Link to="/shop">Explore the Collection</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default AboutPage;
