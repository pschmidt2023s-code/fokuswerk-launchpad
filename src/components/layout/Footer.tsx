import { Link } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="section-dark">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="text-sm font-bold tracking-[0.3em] text-white">FOKUSWERK</p>
            <p className="mt-3 max-w-sm text-sm text-[hsl(var(--section-dark-muted))]">
              Premium workspace essentials designed for clarity and control.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--section-dark-muted))]">
                Newsletter
              </p>
              <div className="mt-3 flex max-w-xs gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-none border-white/20 bg-transparent text-sm text-white placeholder:text-white/40"
                />
                <Button
                  variant="outline"
                  className="shrink-0 rounded-none border-white/20 bg-transparent text-xs uppercase tracking-wider text-white hover:bg-white hover:text-black"
                >
                  Join
                </Button>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--section-dark-muted))]">
              Shop
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/shop" className="text-sm text-white/70 hover:text-white">Desk Mat 01</Link>
              <Link to="/cart" className="text-sm text-white/70 hover:text-white">Cart</Link>
              <Link to="/contact" className="text-sm text-white/70 hover:text-white">Contact</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[hsl(var(--section-dark-muted))]">
              Legal
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/legal-notice" className="text-sm text-white/70 hover:text-white">Legal Notice</Link>
              <Link to="/privacy" className="text-sm text-white/70 hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-white/70 hover:text-white">Terms</Link>
              <Link to="/returns" className="text-sm text-white/70 hover:text-white">Returns</Link>
            </div>
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} FOKUSWERK. All rights reserved.
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
