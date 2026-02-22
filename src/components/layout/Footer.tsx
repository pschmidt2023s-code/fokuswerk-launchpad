import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold tracking-[0.2em] text-foreground">FOKUSWERK</p>
          <p className="mt-2 text-sm text-muted-foreground">Mehr Fokus. Weniger Chaos.</p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shop</p>
          <div className="flex flex-col gap-2">
            <Link to="/product/fokuswerk-snap-system" className="text-sm text-muted-foreground hover:text-foreground">Snap System</Link>
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground">Warenkorb</Link>
            <Link to="/kontakt" className="text-sm text-muted-foreground hover:text-foreground">Kontakt</Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rechtliches</p>
          <div className="flex flex-col gap-2">
            <Link to="/impressum" className="text-sm text-muted-foreground hover:text-foreground">Impressum</Link>
            <Link to="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground">Datenschutz</Link>
            <Link to="/widerruf" className="text-sm text-muted-foreground hover:text-foreground">Widerruf</Link>
            <Link to="/versand-und-zahlung" className="text-sm text-muted-foreground hover:text-foreground">Versand & Zahlung</Link>
            <Link to="/agb" className="text-sm text-muted-foreground hover:text-foreground">AGB</Link>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} FOKUSWERK. Alle Rechte vorbehalten.
      </div>
    </div>
  </footer>
);

export default Footer;
