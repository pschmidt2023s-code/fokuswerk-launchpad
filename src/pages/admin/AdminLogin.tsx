import { useState, useCallback } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000;

const AdminLogin = () => {
  const { signIn } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now < lockedUntil) {
      const secs = Math.ceil((lockedUntil - now) / 1000);
      setError(`Zu viele Versuche. Bitte warte ${secs} Sekunden.`);
      return;
    }
    setError("");
    setLoading(true);
    const { error: err } = await signIn(email, password);
    if (err) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setAttempts(0);
        setError("Zu viele Fehlversuche. 60 Sekunden gesperrt.");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  }, [email, password, signIn, attempts, lockedUntil]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6 p-6 sm:p-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.3em] text-foreground">FOKUSWERK</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">Admin-Bereich</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
            <Input className="rounded-none" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Passwort</Label>
            <Input className="rounded-none" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" className="w-full rounded-none text-sm uppercase tracking-[0.15em]" disabled={loading}>
            {loading ? "Anmeldung..." : "Anmelden"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
