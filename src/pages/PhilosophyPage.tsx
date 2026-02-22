import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PhilosophyPage = () => (
  <div>
    {/* Hero */}
    <section className="section-dark">
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-[hsl(var(--section-dark-muted))]">
          Philosophy
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
          Focus Is Not Found.<br />It Is Built.
        </h1>
      </div>
    </section>

    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-2xl space-y-8 text-base leading-relaxed text-muted-foreground md:text-lg">
        <p>
          Your environment shapes your output. A cluttered workspace creates a cluttered mind.
          FOKUSWERK exists to change that equation.
        </p>
        <p>
          We believe that every object on your desk should earn its place. Every surface should
          serve a purpose. Every detail should support your ability to do deep, meaningful work.
        </p>
        <p className="font-medium text-foreground">
          Structure is not restriction. Structure is freedom.
        </p>
        <p>
          When your workspace is intentional, your work becomes intentional. When distractions
          are removed, what remains is clarity. And clarity is the foundation of everything
          worth building.
        </p>
        <p>
          FOKUSWERK products are designed with one principle: eliminate everything that does not
          serve your focus. No unnecessary features. No aesthetic compromises. No noise.
        </p>
        <p className="font-medium text-foreground">
          Your workspace should support your ambition. Nothing more. Nothing less.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl text-center">
        <Button asChild size="lg" className="rounded-none px-10 text-sm uppercase tracking-[0.15em]">
          <Link to="/shop">Shop the First Drop <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  </div>
);

export default PhilosophyPage;
