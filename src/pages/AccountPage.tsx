import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, ExternalLink, RotateCcw } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const shippingSteps = [
  { key: "pending", label: "Bestellt", icon: Clock },
  { key: "processing", label: "In Bearbeitung", icon: Package },
  { key: "shipped", label: "Versendet", icon: Truck },
  { key: "delivered", label: "Zugestellt", icon: CheckCircle },
];

const getStepIndex = (status: string | null) => {
  const map: Record<string, number> = { pending: 0, processing: 1, shipped: 2, delivered: 3 };
  return map[status ?? "pending"] ?? 0;
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = { pending: "Ausstehend", paid: "Bezahlt", cancelled: "Storniert", refunded: "Erstattet" };
  return map[s] ?? s;
};

const AccountPage = () => {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const [returnDialog, setReturnDialog] = useState<{ open: boolean; orderId: string; orderNr: string }>({ open: false, orderId: "", orderNr: "" });
  const [returnReason, setReturnReason] = useState("");
  const [returnSending, setReturnSending] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: orders } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("my-orders-realtime")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

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
      const { error } = await supabase.from("profiles").update(form).eq("user_id", user!.id);
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

  const handleReturnRequest = async () => {
    if (!returnReason.trim()) return;
    setReturnSending(true);

    try {
      // Send return request email to admin
      await supabase.functions.invoke("send-email", {
        body: {
          type: "contact_notification",
          to: "pschmidt2023s@gmail.com",
          data: {
            name: `Retoure — ${user?.email}`,
            email: user?.email ?? "",
            message: `Retouranfrage für Bestellung #${returnDialog.orderNr}\n\nKunde: ${profile?.first_name ?? ""} ${profile?.last_name ?? ""}\nE-Mail: ${user?.email}\n\nBegründung:\n${returnReason}`,
          },
        },
      });

      // Send confirmation to customer
      await supabase.functions.invoke("send-email", {
        body: {
          type: "contact_confirmation",
          to: user?.email ?? "",
          data: {
            name: profile?.first_name || "Kunde",
            message: `Deine Retouranfrage für Bestellung #${returnDialog.orderNr} ist bei uns eingegangen. Wir melden uns innerhalb von 24 Stunden mit weiteren Informationen zur Rücksendung.\n\nDeine Begründung:\n${returnReason}`,
          },
        },
      });

      toast({ title: "Retouranfrage gesendet", description: "Du erhältst eine Bestätigung per E-Mail." });
      setReturnDialog({ open: false, orderId: "", orderNr: "" });
      setReturnReason("");
    } catch {
      toast({ title: "Fehler", description: "Retouranfrage konnte nicht gesendet werden.", variant: "destructive" });
    }

    setReturnSending(false);
  };

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  // Can return if order is paid and within 14 days
  const canReturn = (order: any) => {
    if (order.status !== "paid") return false;
    const daysSince = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 14;
  };

  return (
    <div className="container py-12 md:py-20">
      <SEOHead title="Mein Konto — FOCUSWERK" description="Verwalte dein FOCUSWERK-Konto, Bestellungen und Lieferadresse." noindex />
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mein Konto</h1>
            <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" className="rounded-none text-xs uppercase tracking-wider" onClick={signOut}>
            Abmelden
          </Button>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-6 border-b border-border">
          <button
            onClick={() => setTab("profile")}
            className={`pb-3 text-xs font-medium uppercase tracking-wider transition-colors ${tab === "profile" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Persönliche Daten
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`pb-3 text-xs font-medium uppercase tracking-wider transition-colors ${tab === "orders" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Bestellungen {orders && orders.length > 0 && <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">{orders.length}</span>}
          </button>
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <form onSubmit={(e) => { e.preventDefault(); updateProfile.mutate(); }} className="mt-8 space-y-5 animate-fade-in">
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
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-Mail</Label>
              <Input className="rounded-none" value={user.email ?? ""} disabled />
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
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="mt-8 space-y-6 animate-fade-in">
            {!orders || orders.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                <p className="mt-3 text-sm text-muted-foreground">Noch keine Bestellungen</p>
              </div>
            ) : (
              orders.map((order) => {
                const stepIndex = getStepIndex(order.shipping_status);
                const items = Array.isArray(order.items) ? order.items as { name: string; quantity: number; price: number }[] : [];
                const returnable = canReturn(order);

                return (
                  <div key={order.id} className="border border-border transition-all duration-300 hover:border-foreground/20">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-4">
                      <div className="flex gap-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Bestellung</p>
                          <p className="text-xs font-mono text-foreground">#{order.id.slice(0, 8)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Datum</p>
                          <p className="text-xs text-foreground">{new Date(order.created_at).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Gesamt</p>
                          <p className="text-xs font-semibold text-foreground">{Number(order.total).toFixed(2).replace(".", ",")} €</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        order.status === "paid" ? "bg-green-100 text-green-800" :
                        order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        order.status === "refunded" ? "bg-blue-100 text-blue-800" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {statusLabel(order.status)}
                      </span>
                    </div>

                    {/* Tracking Progress Bar */}
                    <div className="px-5 py-6">
                      <div className="flex items-center justify-between">
                        {shippingSteps.map((step, i) => {
                          const isActive = i <= stepIndex;
                          const isCurrent = i === stepIndex;
                          return (
                            <div key={step.key} className="flex flex-1 flex-col items-center">
                              <div className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                isActive ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground"
                              } ${isCurrent ? "ring-2 ring-foreground/20 ring-offset-2" : ""}`}>
                                <step.icon className="h-3.5 w-3.5" strokeWidth={2} />
                              </div>
                              <p className={`mt-2 text-center text-[10px] font-medium uppercase tracking-wider ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                {step.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="relative mx-auto mt-[-38px] mb-8 flex h-0.5 w-[calc(100%-64px)]">
                        <div className="h-full w-full bg-border" />
                        <div
                          className="absolute left-0 top-0 h-full bg-foreground transition-all duration-500"
                          style={{ width: `${(stepIndex / (shippingSteps.length - 1)) * 100}%` }}
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3">
                        {order.tracking_url && (
                          <a
                            href={order.tracking_url as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-accent"
                          >
                            <Truck className="h-4 w-4" strokeWidth={1.5} />
                            Sendung verfolgen
                            {order.tracking_number && <span className="font-mono text-muted-foreground">({order.tracking_number})</span>}
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </a>
                        )}
                        {returnable && (
                          <button
                            onClick={() => setReturnDialog({ open: true, orderId: order.id, orderNr: order.id.slice(0, 8) })}
                            className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-foreground transition-colors hover:bg-accent"
                          >
                            <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
                            Retoure beantragen
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-border px-5 py-4">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Artikel</p>
                      <div className="mt-2 divide-y divide-border">
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between py-2 text-sm">
                            <span className="text-foreground">{item.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                            <span className="text-foreground">{(item.price * item.quantity).toFixed(2).replace(".", ",")} €</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="border-t border-border bg-card px-5 py-3">
                      <div className="flex gap-4 text-[10px] text-muted-foreground">
                        <span>Erstellt: {new Date(order.created_at).toLocaleString("de-DE")}</span>
                        <span>Aktualisiert: {new Date(order.updated_at).toLocaleString("de-DE")}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Return Request Dialog */}
      <Dialog open={returnDialog.open} onOpenChange={(open) => { if (!open) { setReturnDialog({ open: false, orderId: "", orderNr: "" }); setReturnReason(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Retoure beantragen</DialogTitle>
            <DialogDescription>
              Bestellung #{returnDialog.orderNr} — Du hast 14 Tage Widerrufsrecht ab Erhalt der Ware. Die Rücksendekosten trägst du.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Begründung (optional, aber hilfreich)</Label>
              <Textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="min-h-[100px] rounded-none"
                placeholder="Warum möchtest du den Artikel zurückgeben?"
                maxLength={500}
              />
            </div>
            <div className="rounded-sm border border-border bg-card p-4">
              <p className="text-xs font-semibold text-foreground">So funktioniert's:</p>
              <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
                <li>1. Retouranfrage absenden</li>
                <li>2. Du erhältst eine Bestätigung per E-Mail</li>
                <li>3. Wir melden uns mit der Rücksendeadresse</li>
                <li>4. Erstattung nach Erhalt der Ware (max. 14 Tage)</li>
              </ol>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-none text-xs uppercase tracking-wider">Abbrechen</Button>
            </DialogClose>
            <Button
              onClick={handleReturnRequest}
              className="rounded-none text-xs uppercase tracking-wider"
              disabled={returnSending}
            >
              {returnSending ? "Wird gesendet..." : "Retoure beantragen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountPage;
