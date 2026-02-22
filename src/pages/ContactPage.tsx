import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Nachricht gesendet", description: "Wir melden uns in Kürze bei dir." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-foreground">Kontakt</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hast du eine Frage? Wir antworten in der Regel innerhalb von 24 Stunden.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
            <Input className="rounded-none" placeholder="Dein Name" required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
            <Input className="rounded-none" type="email" placeholder="du@beispiel.de" required maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nachricht</Label>
            <Textarea className="min-h-[120px] rounded-none" placeholder="Deine Nachricht..." required maxLength={1000} />
          </div>
          <Button type="submit" className="w-full rounded-none text-sm uppercase tracking-[0.15em]" disabled={sending}>
            {sending ? "Wird gesendet..." : "Nachricht senden"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;