const LegalPage = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="container py-12">
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <div className="prose-sm mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  </div>
);

export const Impressum = () => (
  <LegalPage title="Impressum">
    <p><strong className="text-foreground">FOKUSWERK</strong></p>
    <p>Muster GmbH<br />Musterstraße 1<br />10115 Berlin<br />Deutschland</p>
    <p>Vertreten durch: Max Mustermann</p>
    <p>E-Mail: kontakt@fokuswerk.de<br />Telefon: +49 30 123456789</p>
    <p>Handelsregister: Amtsgericht Berlin, HRB 123456<br />USt-IdNr.: DE123456789</p>
    <p className="text-xs">Platzhaltertext — bitte mit echten Angaben ersetzen.</p>
  </LegalPage>
);

export const Datenschutz = () => (
  <LegalPage title="Datenschutzerklärung">
    <p>Der Schutz deiner persönlichen Daten ist uns wichtig. Nachfolgend informieren wir dich über die Erhebung und Verwendung persönlicher Daten bei der Nutzung unserer Website.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">1. Verantwortlicher</h2>
    <p>Muster GmbH, Musterstraße 1, 10115 Berlin. E-Mail: kontakt@fokuswerk.de</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">2. Erhebung und Speicherung personenbezogener Daten</h2>
    <p>Bei der Nutzung unserer Website werden automatisch Daten erhoben (Serverlogfiles): IP-Adresse, Datum und Uhrzeit, Browsertyp, Betriebssystem, Referrer-URL.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">3. Cookies</h2>
    <p>Wir setzen technisch notwendige Cookies ein. Details folgen in einem Cookie-Banner.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">4. Kontaktaufnahme</h2>
    <p>Bei der Kontaktaufnahme per Formular werden die von dir mitgeteilten Daten zur Bearbeitung gespeichert.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">5. Bestellungen</h2>
    <p>Bei Bestellungen speichern wir deine Lieferadresse, E-Mail-Adresse und Bestelldetails zur Vertragserfüllung.</p>
    <p className="mt-8 text-xs">Platzhaltertext — bitte mit rechtskonformem Text ersetzen.</p>
  </LegalPage>
);

export const Widerruf = () => (
  <LegalPage title="Widerrufsbelehrung">
    <h2 className="text-sm font-semibold text-foreground">Widerrufsrecht</h2>
    <p>Du hast das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt 14 Tage ab dem Tag, an dem du oder ein von dir benannter Dritter die Waren in Besitz genommen hast.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">Folgen des Widerrufs</h2>
    <p>Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen 14 Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf eingegangen ist.</p>
    <p className="mt-8 text-xs">Platzhaltertext — bitte mit rechtskonformem Text ersetzen.</p>
  </LegalPage>
);

export const VersandUndZahlung = () => (
  <LegalPage title="Versand & Zahlung">
    <h2 className="text-sm font-semibold text-foreground">Versand</h2>
    <p>Wir versenden innerhalb von 1–2 Werktagen nach Zahlungseingang. Die Lieferzeit beträgt 2–4 Werktage innerhalb Deutschlands.</p>
    <p><strong className="text-foreground">Versandkosten:</strong> 3,99 € innerhalb Deutschlands. Ab einem Bestellwert von 49,00 € liefern wir versandkostenfrei.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">Zahlung</h2>
    <p>Wir akzeptieren Zahlung per Kreditkarte (Visa, Mastercard), Apple Pay, Google Pay und Klarna über unseren Zahlungsdienstleister Stripe.</p>
    <p className="mt-8 text-xs">Platzhaltertext — bitte mit echten Informationen ersetzen.</p>
  </LegalPage>
);

export const AGB = () => (
  <LegalPage title="Allgemeine Geschäftsbedingungen">
    <h2 className="text-sm font-semibold text-foreground">§1 Geltungsbereich</h2>
    <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen über unseren Online-Shop.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">§2 Vertragsschluss</h2>
    <p>Durch Klick auf den Button "Jetzt kostenpflichtig bestellen" gibst du ein verbindliches Angebot zum Kauf der im Warenkorb befindlichen Waren ab.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">§3 Preise und Zahlung</h2>
    <p>Alle Preise sind Endpreise inklusive der gesetzlichen Mehrwertsteuer. Versandkosten werden gesondert ausgewiesen.</p>
    <p className="mt-8 text-xs">Platzhaltertext — bitte mit rechtskonformen AGB ersetzen.</p>
  </LegalPage>
);
