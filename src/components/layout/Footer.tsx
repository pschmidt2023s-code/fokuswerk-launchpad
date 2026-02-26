import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="section-dark" role="contentinfo">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-sm font-bold tracking-[0.3em] text-white">FOCUSWERK</p>
            <p className="mt-3 max-w-sm text-sm text-[hsl(var(--section-dark-muted))]">
              Premium-Arbeitsplatz-Essentials für Klarheit und Kontrolle. Designed in Germany.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--section-dark-muted))]">
                Newsletter
              </p>
              <div className="mt-3 flex max-w-xs gap-2">
                <Input
                  type="email"
                  placeholder="deine@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none border-white/20 bg-transparent text-sm text-white placeholder:text-white/40"
                  aria-label="E-Mail für Newsletter"
                />
                <Button
                  variant="outline"
                  className="shrink-0 rounded-none border-white/20 bg-transparent text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black"
                >
                  Anmelden
                </Button>
              </div>
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[hsl(var(--section-dark-muted))]">
              <span>Kostenloser Versand EU</span>
              <span>14 Tage Rückgabe</span>
              <span>Sichere Zahlung</span>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--section-dark-muted))]">
              Shop
            </p>
            <nav aria-label="Shop-Navigation" className="mt-4 flex flex-col gap-3">
              <Link to="/shop" className="text-sm text-white/70 hover:text-white">Desk Mat 01</Link>
              <Link to="/cart" className="text-sm text-white/70 hover:text-white">Warenkorb</Link>
              <Link to="/philosophy" className="text-sm text-white/70 hover:text-white">Philosophie</Link>
              <Link to="/about" className="text-sm text-white/70 hover:text-white">Über uns</Link>
              <Link to="/contact" className="text-sm text-white/70 hover:text-white">Kontakt</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--section-dark-muted))]">
              Rechtliches
            </p>
            <nav aria-label="Rechtliche Navigation" className="mt-4 flex flex-col gap-3">
              <Link to="/legal-notice" className="text-sm text-white/70 hover:text-white">Impressum</Link>
              <Link to="/privacy" className="text-sm text-white/70 hover:text-white">Datenschutz</Link>
              <Link to="/terms" className="text-sm text-white/70 hover:text-white">AGB</Link>
              <Link to="/returns" className="text-sm text-white/70 hover:text-white">Widerruf</Link>
            </nav>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} FOCUSWERK. Alle Rechte vorbehalten.
          </p>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white">
              Instagram
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-white">
              TikTok
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
