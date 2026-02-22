import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const PhilosophyPage = () => (
  <div>
    <section className="section-dark">
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-[hsl(var(--section-dark-muted))]">
          Philosophie
        </p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
          Fokus wird nicht gefunden.<br />Er wird gebaut.
        </h1>
      </div>
    </section>

    <section className="container py-24 md:py-32">
      <div className="mx-auto max-w-2xl space-y-8 text-base leading-relaxed text-muted-foreground md:text-lg">
        <p>
          Deine Umgebung formt dein Ergebnis. Ein chaotischer Arbeitsplatz erzeugt einen chaotischen Geist.
          FOKUSWERK existiert, um diese Gleichung zu verändern.
        </p>
        <p>
          Wir glauben, dass jedes Objekt auf deinem Schreibtisch seinen Platz verdienen muss. Jede Oberfläche
          sollte einen Zweck erfüllen. Jedes Detail sollte deine Fähigkeit unterstützen, tiefe, bedeutungsvolle Arbeit zu leisten.
        </p>
        <p className="font-medium text-foreground">
          Struktur ist keine Einschränkung. Struktur ist Freiheit.
        </p>
        <p>
          Wenn dein Arbeitsplatz bewusst gestaltet ist, wird deine Arbeit bewusst. Wenn Ablenkungen
          entfernt werden, bleibt Klarheit. Und Klarheit ist das Fundament von allem,
          was es wert ist, gebaut zu werden.
        </p>
        <p>
          FOKUSWERK-Produkte werden nach einem Prinzip entwickelt: Eliminiere alles, was nicht
          deinem Fokus dient. Keine unnötigen Features. Keine ästhetischen Kompromisse. Kein Lärm.
        </p>
        <p className="font-medium text-foreground">
          Dein Arbeitsplatz sollte deine Ambitionen unterstützen. Nicht mehr. Nicht weniger.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl text-center">
        <Button asChild size="lg" className="rounded-none px-10 text-sm uppercase tracking-[0.15em]">
          <Link to="/shop">Jetzt entdecken <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  </div>
);

export default PhilosophyPage;