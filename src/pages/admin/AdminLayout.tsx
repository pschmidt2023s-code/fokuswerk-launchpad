import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { LayoutDashboard, Package, ShoppingCart, MessageSquare, LogOut, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import AdminLogin from "./AdminLogin";

const links = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/orders", icon: ShoppingCart, label: "Bestellungen" },
  { to: "/admin/products", icon: Package, label: "Produkte" },
  { to: "/admin/contacts", icon: MessageSquare, label: "Kontakt" },
];

const SidebarContent = ({ onNavigate, onSignOut }: { onNavigate?: () => void; onSignOut: () => void }) => (
  <>
    <div className="border-b border-border p-4">
      <p className="text-xs font-bold tracking-[0.3em] text-foreground">FOKUSWERK</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Admin</p>
    </div>
    <nav className="flex-1 space-y-1 p-3">
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === "/admin"}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-sm px-3 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
              isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`
          }
        >
          <l.icon className="h-4 w-4" strokeWidth={1.5} />
          {l.label}
        </NavLink>
      ))}
    </nav>
    <div className="border-t border-border p-3">
      <button
        onClick={onSignOut}
        className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        Abmelden
      </button>
    </div>
  </>
);

const AdminLayout = () => {
  const { user, isAdmin, loading, signOut } = useAdmin();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Laden...</p>
      </div>
    );
  }

  if (!user || !isAdmin) return <AdminLogin />;

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="flex w-56 flex-col border-r border-border bg-card">
          <SidebarContent onSignOut={handleSignOut} />
        </aside>
      )}

      {/* Mobile Header + Sheet */}
      {isMobile && (
        <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-foreground">FOKUSWERK</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Admin</p>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="p-2 text-foreground">
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-56 flex-col p-0">
              <SidebarContent onNavigate={() => setSheetOpen(false)} onSignOut={handleSignOut} />
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Content */}
      <main className={`flex-1 overflow-auto bg-background p-4 sm:p-8 ${isMobile ? "pt-20" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
