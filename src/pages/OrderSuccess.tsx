import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => (
  <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <CheckCircle className="mb-6 h-12 w-12 text-foreground" />
    <h1 className="text-2xl font-bold text-foreground">Vielen Dank für deine Bestellung!</h1>
    <p className="mt-3 max-w-md text-sm text-muted-foreground">
      Wir haben deine Bestellung erhalten und bearbeiten sie so schnell wie möglich.
      Du erhältst in Kürze eine Bestätigungsmail.
    </p>
    <Button asChild className="mt-8 rounded-none px-8 text-sm uppercase tracking-wider">
      <Link to="/">Zurück zum Shop</Link>
    </Button>
  </div>
);

export default OrderSuccess;
