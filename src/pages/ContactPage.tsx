import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactPage = () => {
  const [sending, setSending] = useState(false);
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
      // Send admin notification (fire and forget)
      supabase.functions.invoke("send-email", {
        body: {
          type: "contact_notification",
          to: "pschmidt2023s@gmail.com",
          data: { name, email, message },
        },
      });

      // Send customer confirmation (fire and forget)
      supabase.functions.invoke("send-email", {
        body: {
          type: "contact_confirmation",
          to: email,
          data: { name, message },
        },
      });
    }

    setSending(false);
    if (error) {
      toast({ title: "Fehler", description: "Nachricht konnte nicht gesendet werden.", variant: "destructive" });
    } else {
      toast({ title: "Nachricht gesendet", description: "Du erhältst eine Bestätigung per E-Mail." });
      (e.target as HTMLFormElement).reset();
    }
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
            <Input name="name" className="rounded-none" placeholder="Dein Name" required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
            <Input name="email" className="rounded-none" type="email" placeholder="du@beispiel.de" required maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nachricht</Label>
            <Textarea name="message" className="min-h-[120px] rounded-none" placeholder="Deine Nachricht..." required maxLength={1000} />
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
