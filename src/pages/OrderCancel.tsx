import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderCancel = () => (
  <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <XCircle className="mb-6 h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
    <h1 className="text-2xl font-bold text-foreground">Order cancelled</h1>
    <p className="mt-3 max-w-md text-sm text-muted-foreground">
      Your order was not completed. Nothing has been charged.
    </p>
    <div className="mt-8 flex gap-4">
      <Button asChild className="rounded-none px-8 text-sm uppercase tracking-[0.15em]">
        <Link to="/cart">Back to Cart</Link>
      </Button>
      <Button asChild variant="outline" className="rounded-none px-8 text-sm uppercase tracking-[0.15em]">
        <Link to="/">Home</Link>
      </Button>
    </div>
  </div>
);

export default OrderCancel;
