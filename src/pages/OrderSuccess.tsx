import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSuccess = () => (
  <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <CheckCircle className="mb-6 h-12 w-12 text-foreground" strokeWidth={1.5} />
    <h1 className="text-2xl font-bold text-foreground">Thank you for your order.</h1>
    <p className="mt-3 max-w-md text-sm text-muted-foreground">
      Your order has been received. You will receive a confirmation email shortly.
    </p>
    <Button asChild className="mt-8 rounded-none px-8 text-sm uppercase tracking-[0.15em]">
      <Link to="/">Back to Home</Link>
    </Button>
  </div>
);

export default OrderSuccess;
