export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  variants: ProductVariant[];
  images: string[];
  benefits: string[];
  deliveryContents: string[];
  compatibility: string[];
  care: string[];
  seoTitle: string;
  seoDescription: string;
}

export const products: Product[] = [
  {
    id: "fokuswerk-snap-system",
    slug: "fokuswerk-snap-system",
    name: "FOKUSWERK Snap System",
    description:
      "Das magnetische Kabelmanagement-System für deinen Schreibtisch. Kein Kabelchaos mehr — jedes Kabel hat seinen Platz, sofort griffbereit durch die Magnetkraft. Premium matt-schwarzes Finish, passend zu jedem Setup.",
    shortDescription: "Magnetisches Kabelmanagement-System. Premium. Matt-Schwarz. Sofort Ordnung.",
    variants: [
      { id: "snap-3", name: "Set 3 Clips", price: 14.9, sku: "FW-SNAP-3", stock: 100 },
      { id: "snap-5", name: "Set 5 Clips", price: 24.9, sku: "FW-SNAP-5", stock: 100 },
    ],
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    benefits: [
      "Sofort Ordnung auf dem Schreibtisch",
      "Schneller Zugriff — Magnetischer Snap-Mechanismus",
      "Premium matt-schwarzes Finish",
      "3M VHB Klebepad — hält auf allen glatten Oberflächen",
      "Universell — USB-C, Lightning, Micro-USB, Klinke",
    ],
    deliveryContents: [
      "Magnetische Kabelclips (je nach Variante 3 oder 5 Stück)",
      "3M VHB Klebepads (vormontiert)",
      "Kurzanleitung",
      "Branded Verpackung",
    ],
    compatibility: [
      "USB-C Kabel (bis 4mm Durchmesser)",
      "Lightning Kabel",
      "Micro-USB Kabel",
      "3,5mm Klinke / AUX",
      "Dünne Ladekabel aller Art",
    ],
    care: [
      "Mit feuchtem Tuch abwischen",
      "Keine aggressiven Reinigungsmittel verwenden",
      "Magnetkraft bleibt dauerhaft erhalten",
      "Klebepad bei Bedarf austauschbar (3M VHB Ersatzpads separat erhältlich)",
    ],
    seoTitle: "FOKUSWERK Snap System — Magnetisches Kabelmanagement",
    seoDescription:
      "Premium magnetische Kabelclips für deinen Schreibtisch. Matt-schwarzes Finish. Sofort Ordnung, kein Chaos. Jetzt bestellen.",
  },
];

export const faqData = [
  {
    question: "Wie lange dauert der Versand?",
    answer: "Wir versenden innerhalb von 1–2 Werktagen nach Bestelleingang. Die Lieferung innerhalb Deutschlands dauert in der Regel 2–4 Werktage.",
  },
  {
    question: "Kann ich meine Bestellung zurückgeben?",
    answer: "Ja, du hast ein 14-tägiges Widerrufsrecht. Die Rücksendung ist unkompliziert — alle Details findest du auf unserer Widerrufsseite.",
  },
  {
    question: "Wie stark ist die Magnetkraft?",
    answer: "Die Magnete sind stark genug, um jedes gängige Kabel sicher zu halten, aber leicht genug, um das Kabel mit einer Hand zu lösen. Perfekte Balance.",
  },
  {
    question: "Welche Kabeltypen passen?",
    answer: "USB-C, Lightning, Micro-USB, 3,5mm Klinke und alle Kabel mit bis zu 4mm Durchmesser. Praktisch alle gängigen Kabel.",
  },
  {
    question: "Hält das Klebepad auf jeder Oberfläche?",
    answer: "Das 3M VHB Klebepad hält auf allen glatten, sauberen Oberflächen wie Holz, Metall, Glas und Kunststoff. Nicht geeignet für raue oder texturierte Oberflächen.",
  },
];

export const reviewsData = [
  { name: "Max K.", rating: 5, text: "Endlich Ordnung auf meinem Schreibtisch. Das Snap System ist genial einfach.", date: "12.01.2026" },
  { name: "Laura S.", rating: 5, text: "Premium Qualität, sieht super aus und funktioniert einwandfrei. Kaufe mir noch ein Set.", date: "28.12.2025" },
  { name: "Tim R.", rating: 4, text: "Sehr gute Verarbeitung. Einziger Wunsch: Mehr Farben! Aber in Schwarz passt es perfekt.", date: "05.01.2026" },
];
