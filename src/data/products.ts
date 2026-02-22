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
  tagline: string;
  variants: ProductVariant[];
  images: string[];
  features: { title: string; desc: string }[];
  specs: string[];
  careInstructions: string[];
  seoTitle: string;
  seoDescription: string;
}

export const products: Product[] = [
  {
    id: "focuswerk-desk-mat-01",
    slug: "focuswerk-desk-mat-01",
    name: "FOCUSWERK DESK MAT 01",
    description:
      "Kein Gaming-Mousepad. Ein Fundament für Fokus.",
    shortDescription: "90 × 45 cm.\nTiefes Mattschwarz.\nKeine Ablenkung.",
    tagline: "Strukturiere deinen Arbeitsplatz.",
    variants: [
      { id: "desk-mat-01", name: "DESK MAT 01", price: 55, sku: "FW-DM-01", stock: 25 },
    ],
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    features: [
      { title: "90x45 cm Vollflächig", desc: "Bedeckt deinen gesamten Arbeitsplatz" },
      { title: "Präzise Tracking-Oberfläche", desc: "Ultra-glatte Mikrofaser" },
      { title: "Anti-Rutsch-Gummibasis", desc: "Bleibt genau dort, wo du sie platzierst" },
      { title: "3 mm Komfort-Dicke", desc: "Entwickelt für ganztägige Nutzung" },
      { title: "Tiefes Mattschwarz", desc: "Dezentes tonales Logo" },
    ],
    specs: [
      "90 x 45 cm (900 x 450 mm)",
      "Ultra-glatte Mikrofaser-Oberfläche",
      "Anti-Rutsch-Gummibasis",
      "3 mm Dicke",
      "Tiefes Mattschwarz",
      "Dezentes tonales Logo",
    ],
    careInstructions: [
      "Handwäsche empfohlen",
      "Flach trocknen lassen",
      "Nicht in der Maschine waschen",
      "Nicht bügeln",
    ],
    seoTitle: "FOCUSWERK DESK MAT 01 — Premium-Schreibtischunterlage",
    seoDescription:
      "Eine Premium-Schreibtischunterlage für Klarheit und Kontrolle. 90x45 cm. Tiefes Mattschwarz. Strukturiere deinen Arbeitsplatz.",
  },
];

export const faqData = {
  produkt: [
    {
      question: "Ist es ein Gaming-Mousepad?",
      answer: "Es ist für Präzision optimiert, aber für hochwertige Arbeitsplätze designt. Keine Gaming-Ästhetik.",
    },
    {
      question: "Verrutscht es?",
      answer: "Nein. Die Anti-Rutsch-Gummibasis hält es genau dort, wo du es platzierst.",
    },
    {
      question: "Ist es waschbar?",
      answer: "Ja, Handwäsche wird empfohlen. Flach trocknen lassen. Nicht in der Maschine waschen oder bügeln.",
    },
    {
      question: "Wie dick ist es?",
      answer: "4 mm Komfort-Dicke — entwickelt für ganztägige Nutzung.",
    },
    {
      question: "Warum kostet es 55€?",
      answer: "Weil Qualität kein Feature ist. Sie ist Standard.",
    },
  ],
  versand: [
    {
      question: "Wie lang ist die Lieferzeit?",
      answer: "Dies ist ein Pre-Order. Der Versand beginnt ab dem 07.04.2026. Danach beträgt die Lieferzeit 5–8 Werktage innerhalb der EU.",
    },
    {
      question: "Was kosten die Versandkosten?",
      answer: "Kostenloser Versand innerhalb der EU. Keine versteckten Gebühren.",
    },
    {
      question: "Wohin wird versendet?",
      answer: "Wir versenden aktuell in alle EU-Länder. Versand aus Deutschland.",
    },
    {
      question: "Was bedeutet Pre-Order?",
      answer: "Du sicherst dir dein Produkt jetzt zum aktuellen Preis. Der Versand erfolgt ab dem 07.04.2026.",
    },
  ],
  rueckgabe: [
    {
      question: "Wie ist die Rückgabepolitik?",
      answer: "14 Tage Rückgaberecht. Ohne Angabe von Gründen. Details auf unserer Widerrufsseite.",
    },
    {
      question: "In welchem Zustand muss das Produkt sein?",
      answer: "Das Produkt muss unbenutzt und in der Originalverpackung zurückgesendet werden.",
    },
  ],
};

export const reviewsData = [
  { name: "Alexander M.", rating: 5, text: "Endlich eine Schreibtischunterlage, die zu meinem Setup passt. Keine Logos, kein RGB. Einfach clean.", date: "Feb 2026" },
  { name: "Sophie K.", rating: 5, text: "Die Oberflächenqualität ist unglaublich. Mein Arbeitsplatz fühlt sich jetzt durchdacht an.", date: "Jan 2026" },
  { name: "David R.", rating: 5, text: "Zwei bestellt. Eine fürs Büro, eine für zu Hause. Premium in jedem Detail.", date: "Jan 2026" },
  { name: "Lena W.", rating: 4, text: "Genau das, was ich gesucht habe. Minimal, funktional, schön.", date: "Dez 2025" },
];
