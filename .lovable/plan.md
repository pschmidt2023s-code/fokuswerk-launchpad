

# FOKUSWERK — Premium E-Commerce Website

## Brand & Design
**Name:** FOKUSWERK | **Claim:** "Mehr Fokus. Weniger Chaos."
Premium Dark Design mit maßgeschneidertem Farbsystem: Tiefschwarz (#0E0E0E), Graphit (#2B2B2B), Weiß (#F5F5F5), Grau (#A8A8A8). Minimalistisch, ruhig, viel Weißraum, keine bunten Farben. Font: Inter. Mobile-first.

---

## Phase 1: Design System & Layout

- Custom Tailwind-Farbpalette (dark premium theme)
- Eigene UI-Komponenten im Premium-Stil: Button, Input, Select, Checkbox, Modal, Drawer, Toast, Tabs, Badge, Table, Pagination
- Responsive Layout-Shell mit Header (Logo + Nav + Cart-Icon) und Footer (Links, Legal, Social Placeholders)
- Mobile Hamburger-Menü

## Phase 2: Öffentliche Seiten

### Homepage (`/`)
- Hero-Sektion mit Produktbild-Platzhalter + Claim "Mehr Fokus. Weniger Chaos."
- Vorteile-Sektion (3–5 Bullet-Icons: Ordnung, Magnetkraft, Premium Finish, einfache Montage, universell)
- Video/Animation Platzhalter für Magnet-Snap-Demo
- Bestseller-Produktkarte mit CTA
- Social Proof Sektion (Platzhalter-Reviews mit Sternen)
- FAQ Akkordeon (Versand, Rückgabe, Magnet-Haftung, Kabeltypen)

### Produktseite (`/product/fokuswerk-snap-system`)
- Bildergalerie (Platzhalter-Thumbnails + Hauptbild)
- Preis, Varianten-Auswahl (Set 3 Clips / Set 5 Clips)
- Bullet Benefits (Ordnung, schneller Zugriff, Premium Finish, 3M Klebepad)
- Tabs: Lieferumfang, Kompatibilität, Pflege
- Cross-Sell-Sektion für Extra-Clips

### Warenkorb (`/cart`)
- Artikelliste mit Mengenänderung, Entfernen
- Versandkosten-Berechnung (3,99€ Standard DE, kostenlos ab 49€)
- Gutscheincode-Feld
- Weiter zur Kasse Button

### Checkout (`/checkout`)
- Adressformular (DE-Format) mit Validierung
- Zusammenfassung + Stripe Checkout Redirect

### Bestellbestätigung & -abbruch
- `/order/success` — Danke-Seite mit Bestellübersicht
- `/order/cancel` — Abbruch-Seite mit Zurück-Link

### Kontakt (`/kontakt`)
- Kontaktformular (Name, E-Mail, Nachricht) mit Validierung
- Sendet E-Mail an Admin (via Supabase Edge Function)

### Legal-Seiten
- `/impressum`, `/datenschutz`, `/widerruf`, `/versand-und-zahlung`, `/agb`
- Deutsche Template-Texte als Platzhalter, editierbar über Admin

### Account (`/account`) — vorbereitet
- Login/Registrierung vorbereitet, aber optional deaktiviert

## Phase 3: Supabase Backend

### Datenbank-Tabellen
- **products** — Titel, Beschreibung, Preis, Bilder, SEO-Felder, Bestand, aktiv/inaktiv
- **product_variants** — Name (z.B. "3er Set"), Preis, Bestand, SKU
- **orders** — Kundeninfo, Adresse, Gesamtbetrag, Status, Stripe Session ID, Versandstatus, Notizen
- **order_items** — Bestellpositionen mit Variante
- **customers** — E-Mail, Name, Adresse (aus Bestellungen aggregiert)
- **discounts** — Code, Typ (Prozent/Fix), Wert, Gültigkeit, Nutzungslimit
- **content** — Key-Value für editierbare Inhalte (Hero-Text, FAQ, Policies, Footer)
- **user_roles** — Admin-Rollen (sichere Implementierung mit `has_role`-Funktion)
- **media** — Hochgeladene Dateien (via Supabase Storage)

### Auth
- Admin-Login via Supabase Auth (E-Mail/Passwort)
- Admin-Rolle über `user_roles`-Tabelle gesichert
- RLS-Policies: Öffentlich lesen für Produkte/Content, Admin-only für Schreiben

### Edge Functions
- **create-checkout** — Stripe Checkout Session erstellen
- **stripe-webhook** — Bestellung als bezahlt markieren
- **send-contact** — Kontaktformular-Mail senden
- **send-order-confirmation** — Bestellbestätigung per E-Mail (via Resend)

## Phase 4: Stripe Integration

- Stripe einrichten (EUR, DE)
- Checkout-Flow: Cart → Stripe Checkout → Webhook → Order confirmed
- Produkte & Preise werden dynamisch über die Edge Function erstellt

## Phase 5: Admin-Bereich (`/admin`)

- **Login** — geschützter Zugang via Supabase Auth + Admin-Rolle
- **Dashboard** — KPI-Karten (Umsatz, Bestellungen, Conversion-Platzhalter) mit Recharts
- **Produkte** — CRUD: Titel, Preis, Varianten, Bilder-Upload, Bestand, Beschreibung, SEO-Felder
- **Bestellungen** — Liste mit Filtern, Status-Update, Versandstatus, Notizen, Detail-Ansicht
- **Kunden** — Liste mit Bestellhistorie
- **Rabatte/Coupons** — CRUD: Code, Typ, Wert, Gültigkeit, Nutzungslimit
- **Content Manager** — Hero-Text, FAQ-Einträge, Legal-Seiten editieren
- **Media** — Bilder hochladen und verwalten (Supabase Storage)

## Phase 6: SEO & Finishing

- Meta-Tags (Title, Description) pro Seite
- OpenGraph + Twitter Card Tags
- JSON-LD strukturierte Daten für Produkt
- robots.txt optimiert
- Cookie-Banner Platzhalter (DSGVO-vorbereitet)

## Seed Data
- 1 Produkt: FOKUSWERK Snap System (29,90€)
- 2 Varianten: Set 3 Clips (14,90€), Set 5 Clips (24,90€)
- Platzhalter-Bilder mit klaren Markierungen zum Austauschen
- FAQ-Einträge, Legal-Platzhaltertexte, Hero-Content vorausgefüllt

