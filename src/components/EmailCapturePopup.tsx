import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DISMISSED_KEY = "fokuswerk_popup_dismissed";

const EmailCapturePopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const location = useLocation();
  const excludedPaths = ["/contact", "/auth", "/account"];

  useEffect(() => {
    if (excludedPaths.some((p) => location.pathname.startsWith(p))) {
      setShow(false);
      return;
    }
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 8000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      const code = "FIRSTDROP10";
      await supabase.from("email_subscribers").insert({ email: email.trim(), discount_code: code, source: "popup" });

      // Send discount email
      await supabase.functions.invoke("send-email", {
        body: {
          type: "discount_welcome",
          to: email.trim(),
          data: { discountCode: code },
        },
      });

      setSubmitted(true);
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      toast({ title: "Fehler", description: "Bitte versuche es erneut.", variant: "destructive" });
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-sm border border-border bg-background p-8">
        <button onClick={dismiss} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Willkommen</p>
            <p className="mt-4 text-lg font-bold text-foreground">Dein Code: FIRSTDROP10</p>
            <p className="mt-2 text-sm text-muted-foreground">10 % Rabatt auf deine erste Bestellung. Code wurde per E-Mail gesendet.</p>
            <Button onClick={dismiss} className="mt-6 w-full rounded-none text-xs uppercase tracking-wider">
              Weiter einkaufen
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">First Drop</p>
            <p className="mt-3 text-center text-xl font-bold text-foreground">10 % Rabatt</p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Trag dich ein und erhalte 10 % auf deine erste Bestellung.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <Input
                type="email"
                placeholder="deine@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-none"
                required
              />
              <Button type="submit" className="w-full rounded-none text-xs uppercase tracking-wider" disabled={loading}>
                {loading ? "Wird gesendet..." : "Code erhalten"}
              </Button>
            </form>
            <button onClick={dismiss} className="mt-3 block w-full text-center text-xs text-muted-foreground hover:text-foreground">
              Nein danke
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCapturePopup;
