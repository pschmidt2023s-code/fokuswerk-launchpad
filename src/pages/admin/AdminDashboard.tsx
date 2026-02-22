import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, Euro, Package, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  const { data: orders } = useQuery({
    queryKey: ["admin-orders-summary"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: products } = useQuery({
    queryKey: ["admin-products-count"],
    queryFn: async () => {
      const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: unreadContacts } = useQuery({
    queryKey: ["admin-contacts-unread"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false);
      return count ?? 0;
    },
  });

  const totalRevenue = orders?.reduce((s, o) => s + Number(o.total), 0) ?? 0;
  const totalOrders = orders?.length ?? 0;
  const recentOrders = orders?.slice(0, 5) ?? [];

  const stats = [
    { label: "Umsatz", value: `${totalRevenue.toFixed(2).replace(".", ",")} €`, icon: Euro },
    { label: "Bestellungen", value: totalOrders.toString(), icon: ShoppingCart },
    { label: "Produkte", value: (products ?? 0).toString(), icon: Package },
    { label: "Neue Anfragen", value: (unreadContacts ?? 0).toString(), icon: MessageSquare },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-xs text-muted-foreground">Übersicht deines Shops</p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-border p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-foreground">Letzte Bestellungen</p>
        <div className="mt-3 border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card text-left">
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Kunde</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Betrag</th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Datum</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">
                    Noch keine Bestellungen
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-foreground">{o.customer_name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        o.status === "paid" ? "bg-green-100 text-green-800" :
                        o.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{Number(o.total).toFixed(2).replace(".", ",")} €</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("de-DE")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
