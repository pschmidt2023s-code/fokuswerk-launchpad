import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderCancel = () => (
  <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <XCircle className="mb-6 h-12 w-12 text-muted-foreground" />
    <h1 className="text-2xl font-bold text-foreground">Bestellung abgebrochen</h1>
    <p className="mt-3 max-w-md text-sm text-muted-foreground">
      Deine Bestellung wurde nicht abgeschlossen. Keine Sorge — es wurde nichts berechnet.
    </p>
    <div className="mt-8 flex gap-4">
      <Button asChild className="rounded-none px-8 text-sm uppercase tracking-wider">
        <Link to="/cart">Zurück zum Warenkorb</Link>
      </Button>
      <Button asChild variant="outline" className="rounded-none px-8 text-sm uppercase tracking-wider">
        <Link to="/">Zur Startseite</Link>
      </Button>
    </div>
  </div>
);

export default OrderCancel;
