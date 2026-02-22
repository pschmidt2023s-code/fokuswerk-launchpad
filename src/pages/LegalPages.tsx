const LegalPage = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="container py-12 md:py-20">
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  </div>
);

export const LegalNotice = () => (
  <LegalPage title="Legal Notice">
    <p><strong className="text-foreground">FOKUSWERK</strong></p>
    <p>Muster GmbH<br />Musterstrasse 1<br />10115 Berlin<br />Germany</p>
    <p>Represented by: Max Mustermann</p>
    <p>Email: hello@fokuswerk.com<br />Phone: +49 30 123456789</p>
    <p>Commercial register: Amtsgericht Berlin, HRB 123456<br />VAT ID: DE123456789</p>
    <p className="text-xs">Placeholder — replace with actual information.</p>
  </LegalPage>
);

export const PrivacyPolicy = () => (
  <LegalPage title="Privacy Policy">
    <p>We take the protection of your personal data seriously. Below we inform you about how we collect and use personal data when using our website.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">1. Data Controller</h2>
    <p>Muster GmbH, Musterstrasse 1, 10115 Berlin. Email: hello@fokuswerk.com</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">2. Data Collection</h2>
    <p>When using our website, data is collected automatically (server logs): IP address, date and time, browser type, operating system, referrer URL.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">3. Cookies</h2>
    <p>We use technically necessary cookies. Details will follow in a cookie banner.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">4. Orders</h2>
    <p>When placing orders, we store your shipping address, email address and order details for contract fulfillment.</p>
    <p className="mt-8 text-xs">Placeholder — replace with legally compliant text.</p>
  </LegalPage>
);

export const TermsPage = () => (
  <LegalPage title="Terms & Conditions">
    <h2 className="text-sm font-semibold text-foreground">1. Scope</h2>
    <p>These terms and conditions apply to all orders placed through our online shop.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">2. Contract</h2>
    <p>By clicking "Place Order" you submit a binding offer to purchase the items in your cart.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">3. Prices & Payment</h2>
    <p>All prices are final prices including VAT. Shipping costs are shown separately.</p>
    <p className="mt-8 text-xs">Placeholder — replace with legally compliant terms.</p>
  </LegalPage>
);

export const ReturnsPage = () => (
  <LegalPage title="Returns & Refunds">
    <h2 className="text-sm font-semibold text-foreground">Right of Withdrawal</h2>
    <p>You have the right to withdraw from this contract within 14 days without giving any reason.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">Effects of Withdrawal</h2>
    <p>If you withdraw from this contract, we shall reimburse all payments received from you no later than 14 days from the day on which we receive your notice of withdrawal.</p>
    <p className="mt-8 text-xs">Placeholder — replace with legally compliant text.</p>
  </LegalPage>
);
