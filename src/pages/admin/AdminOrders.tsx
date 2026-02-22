import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type OrderWithTracking = Tables<"orders"> & { tracking_number?: string | null; tracking_url?: string | null };

const OrderDetailDialog = ({
  selected,
  onClose,
  trackingNumber,
  setTrackingNumber,
  trackingUrl,
  setTrackingUrl,
  onSendShipping,
  isSending,
}: {
  selected: OrderWithTracking | null;
  onClose: () => void;
  trackingNumber: string;
  setTrackingNumber: (v: string) => void;
  trackingUrl: string;
  setTrackingUrl: (v: string) => void;
  onSendShipping: () => void;
  isSending: boolean;
}) => (
  <Dialog open={!!selected} onOpenChange={onClose}>
    <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-none">
      <DialogHeader>
        <DialogTitle className="text-sm font-bold uppercase tracking-wider">Bestelldetails</DialogTitle>
      </DialogHeader>
      {selected && (
        <div className="space-y-5 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-muted-foreground">Kunde</p><p className="text-foreground">{selected.customer_name}</p></div>
            <div><p className="text-xs text-muted-foreground">E-Mail</p><p className="text-foreground break-all">{selected.customer_email}</p></div>
            <div><p className="text-xs text-muted-foreground">Zahlung</p><p className="text-foreground">{selected.payment_method ?? "–"}</p></div>
            <div><p className="text-xs text-muted-foreground">Gesamt</p><p className="font-bold text-foreground">{Number(selected.total).toFixed(2).replace(".", ",")} €</p></div>
          </div>

          {selected.shipping_address && (
            <div>
              <p className="text-xs text-muted-foreground">Lieferadresse</p>
              <pre className="mt-1 whitespace-pre-wrap text-xs text-foreground">{JSON.stringify(selected.shipping_address, null, 2)}</pre>
            </div>
          )}

          <div>
            <p className="text-xs text-muted-foreground">Artikel</p>
            <div className="mt-1 divide-y divide-border">
              {(Array.isArray(selected.items) ? selected.items as { name: string; quantity: number; price: number }[] : []).map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-xs">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2).replace(".", ",")} €</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Versandtracking</p>
            <div className="mt-3 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Tracking-Nummer</Label>
                <Input className="rounded-none text-xs" placeholder="z.B. 123456789" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Tracking-URL</Label>
                <Input className="rounded-none text-xs" placeholder="https://tracking.dhl.de/..." value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} />
              </div>
              <Button onClick={onSendShipping} disabled={isSending} className="w-full rounded-none text-xs uppercase tracking-wider">
                <Send className="mr-2 h-3.5 w-3.5" />
                {isSending ? "Wird gesendet..." : "Versandbestätigung senden"}
              </Button>
            </div>
          </div>

          {selected.notes && (
            <div><p className="text-xs text-muted-foreground">Notizen</p><p className="text-foreground">{selected.notes}</p></div>
          )}
        </div>
      )}
    </DialogContent>
  </Dialog>
);

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<OrderWithTracking | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await supabase.from("orders").update({ status }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const updateShipping = useMutation({
    mutationFn: async ({ id, shipping_status }: { id: string; shipping_status: string }) => {
      await supabase.from("orders").update({ shipping_status }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  const sendShippingEmail = useMutation({
    mutationFn: async (order: OrderWithTracking) => {
      await supabase.from("orders").update({
        tracking_number: trackingNumber || null,
        tracking_url: trackingUrl || null,
        shipping_status: "shipped",
      }).eq("id", order.id);

      await supabase.functions.invoke("send-email", {
        body: {
          type: "shipping_confirmation",
          to: order.customer_email,
          data: {
            orderId: order.id,
            customerName: order.customer_name,
            trackingNumber: trackingNumber || null,
            trackingUrl: trackingUrl || null,
            siteUrl: window.location.origin,
          },
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Versandbestätigung gesendet", description: "Der Kunde wurde per E-Mail benachrichtigt." });
      setSelected(null);
      setTrackingNumber("");
      setTrackingUrl("");
    },
    onError: () => {
      toast({ title: "Fehler", description: "E-Mail konnte nicht gesendet werden.", variant: "destructive" });
    },
  });

  const openDetail = (o: Tables<"orders">) => {
    setSelected(o as OrderWithTracking);
    setTrackingNumber((o as any).tracking_number ?? "");
    setTrackingUrl((o as any).tracking_url ?? "");
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">Bestellungen</h1>
      <p className="mt-1 text-xs text-muted-foreground">Alle Bestellungen verwalten</p>

      {/* Desktop table */}
      <div className="mt-6 hidden sm:block overflow-x-auto border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card text-left">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Kunde</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Versand</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Betrag</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Datum</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">Laden...</td></tr>
            ) : orders?.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">Keine Bestellungen</td></tr>
            ) : (
              orders?.map((o) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{o.customer_name}</td>
                  <td className="px-4 py-3">
                    <Select value={o.status} onValueChange={(v) => updateStatus.mutate({ id: o.id, status: v })}>
                      <SelectTrigger className="h-7 w-28 rounded-none text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ausstehend</SelectItem>
                        <SelectItem value="paid">Bezahlt</SelectItem>
                        <SelectItem value="cancelled">Storniert</SelectItem>
                        <SelectItem value="refunded">Erstattet</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <Select value={o.shipping_status ?? "pending"} onValueChange={(v) => updateShipping.mutate({ id: o.id, shipping_status: v })}>
                      <SelectTrigger className="h-7 w-28 rounded-none text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ausstehend</SelectItem>
                        <SelectItem value="processing">Bearbeitung</SelectItem>
                        <SelectItem value="shipped">Versendet</SelectItem>
                        <SelectItem value="delivered">Zugestellt</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-foreground">{Number(o.total).toFixed(2).replace(".", ",")} €</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("de-DE")}</td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="rounded-none text-xs" onClick={() => openDetail(o)}>Details</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-2 sm:hidden">
        {isLoading ? (
          <p className="py-8 text-center text-xs text-muted-foreground">Laden...</p>
        ) : orders?.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">Keine Bestellungen</p>
        ) : (
          orders?.map((o) => (
            <div key={o.id} className="border border-border p-3 space-y-2" onClick={() => openDetail(o)}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{o.customer_name}</p>
                <p className="text-sm font-bold text-foreground">{Number(o.total).toFixed(2).replace(".", ",")} €</p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex gap-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                    o.status === "paid" ? "bg-green-100 text-green-800" :
                    o.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-muted text-muted-foreground"
                  }`}>{o.status}</span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                    o.shipping_status === "shipped" ? "bg-blue-100 text-blue-800" :
                    o.shipping_status === "delivered" ? "bg-green-100 text-green-800" :
                    "bg-muted text-muted-foreground"
                  }`}>{o.shipping_status ?? "pending"}</span>
                </div>
                <span>{new Date(o.created_at).toLocaleDateString("de-DE")}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <OrderDetailDialog
        selected={selected}
        onClose={() => setSelected(null)}
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
        trackingUrl={trackingUrl}
        setTrackingUrl={setTrackingUrl}
        onSendShipping={() => selected && sendShippingEmail.mutate(selected)}
        isSending={sendShippingEmail.isPending}
      />
    </div>
  );
};

export default AdminOrders;
