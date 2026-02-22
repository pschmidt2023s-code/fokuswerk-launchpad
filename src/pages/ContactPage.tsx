import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Clock, MessageSquare, CheckCircle } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ContactPage = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const message = fd.get("message") as string;

    const { error } = await supabase.from("contact_messages").insert({ name, email, message });

    if (!error) {
      supabase.functions.invoke("send-email", {
        body: { type: "contact_notification", to: "pschmidt2023s@gmail.com", data: { name, email, message } },
      });
      supabase.functions.invoke("send-email", {
        body: { type: "contact_confirmation", to: email, data: { name, message } },
      });
      setSent(true);
    }

    setSending(false);
    if (error) {
      toast({ title: "Fehler", description: "Nachricht konnte nicht gesendet werden.", variant: "destructive" });
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="section-dark">
        <div className="container flex min-h-[40vh] flex-col items-center justify-center py-20 text-center">
          <p className="animate-fade-in text-xs font-medium uppercase tracking-[0.4em] text-[hsl(var(--section-dark-muted))]">
            Kontakt
          </p>
          <h1 className="mt-6 animate-fade-in text-4xl font-bold tracking-tight text-white md:text-5xl" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
            Wir hören zu.
          </h1>
          <p className="mt-4 max-w-md animate-fade-in text-base text-[hsl(var(--section-dark-muted))]" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
            Hast du eine Frage, Feedback oder eine Idee? Schreib uns — wir antworten persönlich.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="container -mt-12 pb-12">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { icon: Mail, title: "E-Mail", desc: "support@focuswerk.com" },
            { icon: Clock, title: "Antwortzeit", desc: "Innerhalb von 24 Stunden" },
            { icon: MessageSquare, title: "Sprachen", desc: "Deutsch & Englisch" },
          ].map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 100}>
              <div className="border border-border bg-card p-6 text-center transition-all duration-300 hover:border-foreground/20 hover:shadow-sm">
                <item.icon className="mx-auto h-5 w-5 text-foreground" strokeWidth={1.5} />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="container py-12 md:py-20">
        <div className="mx-auto max-w-lg">
          {sent ? (
            <ScrollReveal>
              <div className="py-16 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-foreground" strokeWidth={1.5} />
                <h2 className="mt-6 text-xl font-bold text-foreground">Nachricht gesendet!</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Vielen Dank für deine Nachricht. Du erhältst eine Bestätigung per E-Mail.
                  <br />Wir melden uns innerhalb von 24 Stunden bei dir.
                </p>
                <Button
                  onClick={() => setSent(false)}
                  className="mt-8 rounded-none text-sm uppercase tracking-[0.15em]"
                  variant="outline"
                >
                  Weitere Nachricht senden
                </Button>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <h2 className="text-xl font-bold text-foreground">Schreib uns eine Nachricht</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Alle Felder sind erforderlich.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
                    <Input name="name" className="rounded-none transition-all duration-200 focus:ring-2 focus:ring-foreground/10" placeholder="Dein Name" required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
                    <Input name="email" className="rounded-none transition-all duration-200 focus:ring-2 focus:ring-foreground/10" type="email" placeholder="du@beispiel.de" required maxLength={255} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nachricht</Label>
                  <Textarea name="message" className="min-h-[160px] rounded-none transition-all duration-200 focus:ring-2 focus:ring-foreground/10" placeholder="Wie können wir dir helfen?" required maxLength={1000} />
                </div>
                <Button type="submit" className="w-full rounded-none text-sm uppercase tracking-[0.15em] transition-all duration-200" disabled={sending}>
                  {sending ? "Wird gesendet..." : "Nachricht senden"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Durch das Absenden stimmst du unserer{" "}
                  <a href="/datenschutz" className="underline transition-colors hover:text-foreground">Datenschutzerklärung</a> zu.
                </p>
              </form>
            </ScrollReveal>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
