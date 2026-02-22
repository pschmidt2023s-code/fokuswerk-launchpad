import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent", description: "We'll get back to you shortly." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-foreground">Contact</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Have a question? We typically respond within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
            <Input className="rounded-none" placeholder="Your name" required maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input className="rounded-none" type="email" placeholder="you@example.com" required maxLength={255} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Message</Label>
            <Textarea className="min-h-[120px] rounded-none" placeholder="Your message..." required maxLength={1000} />
          </div>
          <Button type="submit" className="w-full rounded-none text-sm uppercase tracking-[0.15em]" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
