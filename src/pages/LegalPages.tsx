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
    <p><strong className="text-foreground">FOCUSWERK</strong></p>
    <p>FOCUSWERK<br />BGM.-Scheller-Str 14<br />96215 Lichtenfels<br />Deutschland</p>
    <p>Vertreten durch: Patric-Maurice Schmidt</p>
    <p>E-Mail: support@focuswerk.com<br /></p>
    <p className="text-xs"></p>
  </LegalPage>
);

export const PrivacyPolicy = () => (
  <LegalPage title="Datenschutzerklärung">
    <p>Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Im Folgenden informieren wir dich darüber, wie wir personenbezogene Daten bei der Nutzung unserer Website erheben und verwenden.</p>
    <h2 className="mt-6 text-sm font-semibold text-foreground">1. Verantwortlicher</h2>
    <p>Muster GmbH, Musterstraße 1, 10115 Berlin. E-Mail: hello@focuswerk.com</p>
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
    <h2 className="text-sm font-semibold text-foreground">§ 1 Geltungsbereich</h2>
    <p>(1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle Verträge, die ein Verbraucher oder Unternehmer (nachfolgend „Kunde") mit FOCUSWERK, Patric-Maurice Schmidt, BGM.-Scheller-Str 14, 96215 Lichtenfels (nachfolgend „Anbieter") über den Onlineshop unter focuswerk.de schließt.</p>
    <p>(2) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
    <p>(3) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB).</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 2 Vertragsschluss</h2>
    <p>(1) Die Darstellung der Produkte im Onlineshop stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Bestellung dar.</p>
    <p>(2) Durch Klicken auf „Bestellung aufgeben" gibt der Kunde ein verbindliches Angebot zum Kauf der im Warenkorb befindlichen Artikel ab.</p>
    <p>(3) Der Vertrag kommt zustande, wenn der Anbieter das Angebot durch eine Bestellbestätigung per E-Mail annimmt oder die Ware ausliefert.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 3 Preise und Zahlung</h2>
    <p>(1) Alle angegebenen Preise sind Endpreise und enthalten keine Umsatzsteuer. Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).</p>
    <p>(2) Versandkosten werden vor Abschluss der Bestellung gesondert ausgewiesen. Der Versand innerhalb der EU ist kostenlos.</p>
    <p>(3) Die Zahlung erfolgt wahlweise per Kreditkarte (Stripe), PayPal, Apple Pay oder Google Pay. Die Zahlung wird unmittelbar nach Vertragsschluss fällig.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 4 Lieferung und Versand</h2>
    <p>(1) Die Lieferung erfolgt an die vom Kunden angegebene Lieferadresse innerhalb der Europäischen Union.</p>
    <p>(2) Dies ist ein Pre-Order-Produkt. Der Versand beginnt ab dem 07.04.2026. Die voraussichtliche Lieferzeit beträgt danach 5 bis 8 Werktage.</p>
    <p>(3) Sollte die bestellte Ware nicht verfügbar sein, ist der Anbieter zu Teillieferungen berechtigt, wenn dies für den Kunden zumutbar ist.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 5 Eigentumsvorbehalt</h2>
    <p>Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises Eigentum des Anbieters.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 6 Mängelhaftung / Gewährleistung</h2>
    <p>(1) Es gelten die gesetzlichen Mängelansprüche. Die Verjährungsfrist für Mängelansprüche bei neuen Sachen beträgt zwei Jahre ab Erhalt der Ware.</p>
    <p>(2) Offensichtliche Mängel sind innerhalb von zwei Wochen nach Erhalt der Ware schriftlich anzuzeigen.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 7 Haftung</h2>
    <p>(1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.</p>
    <p>(2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und beschränkt auf den vertragstypischen, vorhersehbaren Schaden.</p>
    <p>(3) Die vorstehenden Haftungsbeschränkungen gelten nicht bei Verletzung von Leben, Körper und Gesundheit.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 8 Datenschutz</h2>
    <p>Informationen zur Verarbeitung personenbezogener Daten finden sich in der Datenschutzerklärung unter focuswerk.de/datenschutz.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 9 Streitbeilegung</h2>
    <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" className="underline text-foreground" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>. Der Anbieter ist weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 10 Schlussbestimmungen</h2>
    <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
    <p>(2) Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>

    <p className="mt-8 text-xs">Stand: Februar 2026</p>
  </LegalPage>
);

export const ReturnsPage = () => (
  <LegalPage title="Widerrufsbelehrung">
    <h2 className="text-sm font-semibold text-foreground">Widerrufsrecht</h2>
    <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
    <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.</p>
    <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (FOCUSWERK, Patric-Maurice Schmidt, BGM.-Scheller-Str 14, 96215 Lichtenfels, E-Mail: support@focuswerk.com) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
    <p>Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">Folgen des Widerrufs</h2>
    <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>
    <p>Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.</p>
    <p>Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">Rücksendung</h2>
    <p>Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns (FOCUSWERK, BGM.-Scheller-Str 14, 96215 Lichtenfels) zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.</p>
    <p>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</p>
    <p>Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">Ausschluss des Widerrufsrechts</h2>
    <p>Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde.</p>

    <p className="mt-8 text-xs">Stand: Februar 2026</p>
  </LegalPage>
);
