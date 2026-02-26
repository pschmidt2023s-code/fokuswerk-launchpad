import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";

const AuthPage = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const { error: err } = await signUp(email, password);
      if (err) {
        setError(err.message);
      } else {
        toast({ title: "Konto erstellt", description: "Du bist jetzt angemeldet." });
        navigate(-1);
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err.message);
      } else {
        navigate(-1);
      }
    }
    setLoading(false);
  };

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <SEOHead
        title="Anmelden — FOCUSWERK | Konto & Bestellungen"
        description="Melde dich bei FOCUSWERK an oder erstelle ein Konto. Bestellungen verwalten, Adresse speichern und schneller bestellen."
        canonical="https://focuswerk.de/auth"
        noindex
      />
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">
            {mode === "login" ? "Anmelden" : "Konto erstellen"}
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {mode === "login"
              ? "Melde dich an, um deine Bestellungen einzusehen."
              : "Erstelle ein Konto für schnelleren Checkout."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
            <Input className="rounded-none" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Passwort</Label>
            <Input className="rounded-none" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full rounded-none text-sm uppercase tracking-[0.15em]" disabled={loading}>
            {loading ? "Laden..." : mode === "login" ? "Anmelden" : "Registrieren"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          {mode === "login" ? (
            <>
              Noch kein Konto?{" "}
              <button onClick={() => setMode("register")} className="underline text-foreground">
                Registrieren
              </button>
            </>
          ) : (
            <>
              Bereits ein Konto?{" "}
              <button onClick={() => setMode("login")} className="underline text-foreground">
                Anmelden
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
