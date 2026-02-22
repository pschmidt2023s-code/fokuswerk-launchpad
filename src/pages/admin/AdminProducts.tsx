import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const emptyProduct: Partial<TablesInsert<"products">> = {
  name: "",
  slug: "",
  price: 0,
  stock: 0,
  description: "",
  short_description: "",
  tagline: "",
  is_active: true,
  seo_title: "",
  seo_description: "",
};

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const upsert = useMutation({
    mutationFn: async (p: Partial<Product>) => {
      if (isNew) {
        await supabase.from("products").insert({
          name: p.name!,
          slug: p.slug!,
          price: p.price ?? 0,
          stock: p.stock ?? 0,
          description: p.description,
          short_description: p.short_description,
          tagline: p.tagline,
          is_active: p.is_active ?? true,
          seo_title: p.seo_title,
          seo_description: p.seo_description,
        });
      } else {
        const { id, created_at, updated_at, ...rest } = p as Product;
        await supabase.from("products").update(rest).eq("id", id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setEditing(null);
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      await supabase.from("products").update({ is_active }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-products"] }),
  });

  const openNew = () => { setIsNew(true); setEditing({ ...emptyProduct }); };
  const openEdit = (p: Product) => { setIsNew(false); setEditing({ ...p }); };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Produkte</h1>
          <p className="mt-1 text-xs text-muted-foreground">Produkte verwalten</p>
        </div>
        <Button onClick={openNew} className="rounded-none text-xs uppercase tracking-wider">
          <Plus className="mr-2 h-4 w-4" /> Neues Produkt
        </Button>
      </div>

      <div className="mt-6 border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-card text-left">
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Preis</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Bestand</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Aktiv</th>
              <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">Laden...</td></tr>
            ) : products?.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">Keine Produkte</td></tr>
            ) : (
              products?.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-foreground">{Number(p.price).toFixed(2).replace(".", ",")} €</td>
                  <td className="px-4 py-3 text-foreground">{p.stock}</td>
                  <td className="px-4 py-3">
                    <Switch checked={p.is_active} onCheckedChange={(v) => toggleActive.mutate({ id: p.id, is_active: v })} />
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="rounded-none text-xs" onClick={() => openEdit(p)}>Bearbeiten</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-none">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold uppercase tracking-wider">
              {isNew ? "Neues Produkt" : "Produkt bearbeiten"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={(e) => { e.preventDefault(); upsert.mutate(editing); }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
                  <Input className="rounded-none" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Slug</Label>
                  <Input className="rounded-none" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Preis (€)</Label>
                  <Input className="rounded-none" type="number" step="0.01" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Bestand</Label>
                  <Input className="rounded-none" type="number" value={editing.stock ?? 0} onChange={(e) => setEditing({ ...editing, stock: parseInt(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Tagline</Label>
                <Input className="rounded-none" value={editing.tagline ?? ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Kurzbeschreibung</Label>
                <Input className="rounded-none" value={editing.short_description ?? ""} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Beschreibung</Label>
                <Textarea className="min-h-[80px] rounded-none" value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">SEO Titel</Label>
                  <Input className="rounded-none" value={editing.seo_title ?? ""} onChange={(e) => setEditing({ ...editing, seo_title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">SEO Beschreibung</Label>
                  <Input className="rounded-none" value={editing.seo_description ?? ""} onChange={(e) => setEditing({ ...editing, seo_description: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <Label className="text-xs text-muted-foreground">Aktiv</Label>
              </div>
              <Button type="submit" className="w-full rounded-none text-xs uppercase tracking-wider" disabled={upsert.isPending}>
                {upsert.isPending ? "Speichern..." : "Speichern"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
