import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <SEOHead title="Seite nicht gefunden — FOCUSWERK" description="Diese Seite existiert nicht. Zurück zur Startseite von FOCUSWERK." noindex />
      <p className="text-6xl font-bold text-foreground">404</p>
      <p className="mt-4 text-muted-foreground">Seite nicht gefunden.</p>
      <Button asChild className="mt-8 rounded-none px-8 text-sm uppercase tracking-[0.15em]">
        <Link to="/">Zurück zur Startseite</Link>
      </Button>
    </div>
  );
};

export default NotFound;
