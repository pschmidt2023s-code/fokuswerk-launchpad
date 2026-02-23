import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import SEOHead from "@/components/SEOHead";
import PageTransition from "@/components/PageTransition";

const LegalPage = ({ title, children, seoTitle, seoDesc }: { title: string; children: React.ReactNode; seoTitle?: string; seoDesc?: string }) => (
  <PageTransition>
  <div className="container py-12 md:py-20">
    {seoTitle && <SEOHead title={seoTitle} description={seoDesc || ""} />}
    <div className="mx-auto max-w-2xl">
      <ScrollReveal>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </ScrollReveal>
    </div>
  </div>
  </PageTransition>
);

export const LegalNotice = () => (
  <LegalPage title="Impressum" seoTitle="Impressum — FOCUSWERK" seoDesc="Impressum von FOCUSWERK. Angaben gemäß § 5 TMG.">
    <p><strong className="text-foreground">FOCUSWERK</strong></p>
    <p>FOCUSWERK<br />BGM.-Scheller-Str 14<br />96215 Lichtenfels<br />Deutschland</p>
    <p>Vertreten durch: Patric-Maurice Schmidt</p>
    <p>E-Mail: support@focuswerk.com</p>
    <p className="text-xs"></p>
  </LegalPage>
);

export const PrivacyPolicy = () => (
  <LegalPage title="Datenschutzerklärung" seoTitle="Datenschutz — FOCUSWERK" seoDesc="Datenschutzerklärung von FOCUSWERK. Informationen zur Verarbeitung personenbezogener Daten.">
    <p>Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Im Folgenden informieren wir dich darüber, wie wir personenbezogene Daten bei der Nutzung unserer Website erheben und verwenden.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">1. Verantwortlicher</h2>
    <p>FOCUSWERK<br />Patric-Maurice Schmidt<br />BGM.-Scheller-Str 14<br />96215 Lichtenfels<br />Deutschland<br />E-Mail: support@focuswerk.com</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">2. Datenerhebung beim Besuch der Website</h2>
    <p>Bei der Nutzung unserer Website werden automatisch technische Daten erhoben (Server-Logfiles): IP-Adresse (anonymisiert), Datum und Uhrzeit des Zugriffs, Browsertyp und -version, Betriebssystem, Referrer-URL, aufgerufene Seiten. Diese Daten dienen der Sicherstellung eines reibungslosen Verbindungsaufbaus, der komfortablen Nutzung unserer Website sowie der Systemsicherheit.</p>
    <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">3. Cookies</h2>
    <p>Wir verwenden ausschließlich technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind (z. B. Session-Cookies für den Warenkorb und die Authentifizierung). Diese Cookies werden nach Beendigung der Browser-Sitzung gelöscht. Eine gesonderte Einwilligung ist hierfür nicht erforderlich.</p>
    <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">4. Bestellungen und Vertragsabwicklung</h2>
    <p>Bei einer Bestellung erheben wir folgende Daten zur Vertragserfüllung: Vor- und Nachname, E-Mail-Adresse, Lieferadresse (Straße, PLZ, Stadt, Land), Bestelldetails (Produkte, Menge, Preis), Zahlungsinformationen (werden ausschließlich vom jeweiligen Zahlungsdienstleister verarbeitet).</p>
    <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Die Daten werden nach Ablauf der steuerrechtlichen Aufbewahrungsfristen (10 Jahre) gelöscht.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">5. Kontaktformular</h2>
    <p>Wenn du uns über das Kontaktformular kontaktierst, speichern wir deinen Namen, deine E-Mail-Adresse und deine Nachricht zur Bearbeitung deiner Anfrage. Diese Daten werden gelöscht, sobald die Anfrage abschließend bearbeitet wurde, es sei denn, gesetzliche Aufbewahrungsfristen stehen dem entgegen.</p>
    <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">6. Newsletter</h2>
    <p>Mit deiner Einwilligung kannst du unseren Newsletter abonnieren. Wir speichern hierzu deine E-Mail-Adresse. Du kannst den Newsletter jederzeit abbestellen. Die Abmeldung ist über einen Link in jedem Newsletter möglich oder per E-Mail an support@focuswerk.com.</p>
    <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">7. Zahlungsdienstleister</h2>
    <p>Wir nutzen folgende Zahlungsdienstleister:</p>
    <p><strong className="text-foreground">Stripe</strong> — Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Dublin 2, Irland. Datenschutzerklärung: <a href="https://stripe.com/de/privacy" className="underline text-foreground" target="_blank" rel="noopener noreferrer">stripe.com/de/privacy</a></p>
    <p><strong className="text-foreground">PayPal</strong> — PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxemburg. Datenschutzerklärung: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" className="underline text-foreground" target="_blank" rel="noopener noreferrer">paypal.com/privacy</a></p>
    <p>Die Verarbeitung der Zahlungsdaten erfolgt ausschließlich durch den jeweiligen Zahlungsdienstleister. Wir erhalten keine vollständigen Kreditkarten- oder Kontodaten.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">8. Hosting</h2>
    <p>Unsere Website wird gehostet von externen Dienstleistern. Personenbezogene Daten, die auf dieser Website verarbeitet werden, werden auf den Servern des Hosters gespeichert. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO und eines Auftragsverarbeitungsvertrags gemäß Art. 28 DSGVO.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">9. Deine Rechte</h2>
    <p>Du hast gegenüber uns folgende Rechte hinsichtlich deiner personenbezogenen Daten:</p>
    <ul className="list-disc pl-6 space-y-1">
      <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
      <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
      <li>Recht auf Löschung (Art. 17 DSGVO)</li>
      <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
      <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
      <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
    </ul>
    <p>Zur Ausübung deiner Rechte kannst du dich jederzeit an support@focuswerk.com wenden.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">10. Beschwerderecht</h2>
    <p>Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde über die Verarbeitung deiner personenbezogenen Daten zu beschweren. Die zuständige Aufsichtsbehörde ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">11. Änderungen</h2>
    <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte rechtliche Rahmenbedingungen oder Änderungen unseres Dienstes anzupassen. Die aktuelle Version findest du stets auf dieser Seite.</p>

    <p className="mt-8 text-xs">Stand: Februar 2026</p>
  </LegalPage>
);

export const TermsPage = () => (
  <LegalPage title="Allgemeine Geschäftsbedingungen" seoTitle="AGB — FOCUSWERK" seoDesc="Allgemeine Geschäftsbedingungen von FOCUSWERK für den Onlineshop focuswerk.de.">
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
    <p>Informationen zur Verarbeitung personenbezogener Daten finden sich in der <Link to="/privacy" className="underline text-foreground">Datenschutzerklärung</Link>.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 9 Streitbeilegung</h2>
    <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" className="underline text-foreground" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a>. Der Anbieter ist weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

    <h2 className="mt-6 text-sm font-semibold text-foreground">§ 10 Schlussbestimmungen</h2>
    <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.</p>
    <p>(2) Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>

    <p className="mt-8 text-xs">Stand: Februar 2026</p>
  </LegalPage>
);

export const ReturnsPage = () => (
  <LegalPage title="Widerrufsbelehrung" seoTitle="Widerruf — FOCUSWERK" seoDesc="Widerrufsbelehrung von FOCUSWERK. 14 Tage Rückgaberecht.">
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
