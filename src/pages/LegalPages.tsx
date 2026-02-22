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
  <LegalPage title="Impressum">
    <p><strong className="text-foreground">FOKUSWERK</strong></p>
    <p>Muster GmbH<br />Musterstraße 1<br />10115 Berlin<br />Deutschland</p>
    <p>Vertreten durch: Max Mustermann</p>
    <p>E-Mail: hello@fokuswerk.com<br />Telefon: +49 30 123456789</p>
    <p>Handelsregister: Amtsgericht Berlin, HRB 123456<br />USt-IdNr.: DE123456789</p>
    <p className="text-xs">Platzhalter — durch tatsächliche Angaben ersetzen.</p>
  </LegalPage>
);

export const PrivacyPolicy = () => (
  <LegalPage title="Datenschutzerklärung">
    <p>Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Im Folgenden informieren wir dich darüber, wie wir personenbezogene Daten bei der Nutzung unserer Website erheben und verwenden.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">1. Verantwortlicher</h2>
    <p>Muster GmbH, Musterstraße 1, 10115 Berlin. E-Mail: hello@fokuswerk.com</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">2. Datenerhebung</h2>
    <p>Bei der Nutzung unserer Website werden automatisch Daten erhoben (Server-Logfiles): IP-Adresse, Datum und Uhrzeit, Browsertyp, Betriebssystem, Referrer-URL.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">3. Cookies</h2>
    <p>Wir verwenden technisch notwendige Cookies. Details folgen in einem Cookie-Banner.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">4. Bestellungen</h2>
    <p>Bei Bestellungen speichern wir deine Lieferadresse, E-Mail-Adresse und Bestelldetails zur Vertragserfüllung.</p>
    <p className="mt-8 text-xs">Platzhalter — durch rechtskonforme Texte ersetzen.</p>
  </LegalPage>
);

export const TermsPage = () => (
  <LegalPage title="Allgemeine Geschäftsbedingungen">
    <h2 className="text-sm font-semibold text-foreground">1. Geltungsbereich</h2>
    <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über unseren Onlineshop.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">2. Vertragsschluss</h2>
    <p>Durch Klicken auf „Bestellung aufgeben" gibst du ein verbindliches Angebot zum Kauf der Artikel in deinem Warenkorb ab.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">3. Preise & Zahlung</h2>
    <p>Alle Preise sind Endpreise inkl. MwSt. Versandkosten werden gesondert ausgewiesen.</p>
    <p className="mt-8 text-xs">Platzhalter — durch rechtskonforme AGB ersetzen.</p>
  </LegalPage>
);

export const ReturnsPage = () => (
  <LegalPage title="Widerrufsbelehrung">
    <h2 className="text-sm font-semibold text-foreground">Widerrufsrecht</h2>
    <p>Du hast das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">Folgen des Widerrufs</h2>
    <p>Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen 14 Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf bei uns eingegangen ist.</p>
    <p className="mt-8 text-xs">Platzhalter — durch rechtskonforme Widerrufsbelehrung ersetzen.</p>
  </LegalPage>
);