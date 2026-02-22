import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";

const OrderSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <CheckCircle className="mb-6 h-12 w-12 text-foreground" strokeWidth={1.5} />
      <h1 className="text-2xl font-bold text-foreground">Vielen Dank für deine Vorbestellung.</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Deine Bestellung ist eingegangen. Du erhältst in Kürze eine Bestätigungs-E-Mail.
        <br />Der Versand erfolgt ab dem 07.04.2026.
      </p>
      <Button asChild className="mt-8 rounded-none px-8 text-sm uppercase tracking-[0.15em]">
        <Link to="/">Zurück zur Startseite</Link>
      </Button>
    </div>
  );
};

export default OrderSuccess;
