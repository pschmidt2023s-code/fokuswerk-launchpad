import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AccountPage = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const [form, setForm] = useState({
    first_name: "", last_name: "", address: "", zip: "", city: "", country: "Deutschland",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        address: profile.address ?? "",
        zip: profile.zip ?? "",
        city: profile.city ?? "",
        country: profile.country ?? "Deutschland",
      });
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update(form)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Gespeichert", description: "Dein Profil wurde aktualisiert." });
    },
    onError: () => {
      toast({ title: "Fehler", description: "Profil konnte nicht gespeichert werden.", variant: "destructive" });
    },
  });

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-lg space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mein Konto</h1>
          <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); updateProfile.mutate(); }}
          className="space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Vorname</Label>
              <Input className="rounded-none" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nachname</Label>
              <Input className="rounded-none" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Adresse</Label>
            <Input className="rounded-none" value={form.address} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">PLZ</Label>
              <Input className="rounded-none" value={form.zip} onChange={(e) => update("zip", e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Stadt</Label>
              <Input className="rounded-none" value={form.city} onChange={(e) => update("city", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Land</Label>
            <Input className="rounded-none" value={form.country} onChange={(e) => update("country", e.target.value)} />
          </div>
          <Button type="submit" className="w-full rounded-none text-sm uppercase tracking-[0.15em]" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Speichern..." : "Profil speichern"}
          </Button>
        </form>

        <div className="border-t border-border pt-6">
          <Button variant="outline" className="rounded-none text-xs uppercase tracking-wider" onClick={signOut}>
            Abmelden
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
