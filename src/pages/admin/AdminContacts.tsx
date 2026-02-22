import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Mail, MailOpen } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const AdminContacts = () => {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Tables<"contact_messages"> | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-contacts"] }),
  });

  const openMessage = (m: Tables<"contact_messages">) => {
    setSelected(m);
    if (!m.is_read) markRead.mutate(m.id);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">Kontaktanfragen</h1>
      <p className="mt-1 text-xs text-muted-foreground">Eingegangene Nachrichten</p>

      <div className="mt-6 border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card text-left">
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">E-Mail</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Nachricht</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Datum</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">Laden...</td></tr>
            ) : messages?.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">Keine Anfragen</td></tr>
            ) : (
              messages?.map((m) => (
                <tr key={m.id} className={`border-b border-border last:border-0 ${!m.is_read ? "bg-accent/50" : ""}`}>
                  <td className="px-4 py-3">
                    {m.is_read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-foreground" />}
                  </td>
                  <td className={`px-4 py-3 ${!m.is_read ? "font-semibold text-foreground" : "text-foreground"}`}>{m.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                  <td className="px-4 py-3 text-muted-foreground truncate max-w-[200px]">{m.message}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(m.created_at).toLocaleDateString("de-DE")}</td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="rounded-none text-xs" onClick={() => openMessage(m)}>Lesen</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg rounded-none">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">Nachricht von {selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Name</p><p className="text-foreground">{selected.name}</p></div>
                <div><p className="text-xs text-muted-foreground">E-Mail</p><p className="text-foreground">{selected.email}</p></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nachricht</p>
                <p className="mt-1 whitespace-pre-wrap text-foreground">{selected.message}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Eingegangen am</p>
                <p className="text-foreground">{new Date(selected.created_at).toLocaleString("de-DE")}</p>
              </div>
              <Button asChild variant="outline" className="rounded-none text-xs">
                <a href={`mailto:${selected.email}`}>Per E-Mail antworten</a>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContacts;
