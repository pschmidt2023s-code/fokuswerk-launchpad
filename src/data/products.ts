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
    id: "fokuswerk-desk-mat-01",
    slug: "fokuswerk-desk-mat-01",
    name: "FOKUSWERK DESK MAT 01",
    description:
      "This is not a gaming mousepad. This is a foundation for your workspace. A premium full-desk performance mat designed for clarity and control.",
    shortDescription: "Premium full-desk performance mat. 36x18 inches. Deep matte black.",
    tagline: "Structure Your Workspace.",
    variants: [
      { id: "desk-mat-01", name: "DESK MAT 01", price: 39, sku: "FW-DM-01", stock: 50 },
    ],
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    features: [
      { title: "36x18 Full Desk Coverage", desc: "Covers your entire workspace" },
      { title: "Precision Tracking Surface", desc: "Ultra smooth microfiber" },
      { title: "Anti-Slip Rubber Base", desc: "Stays exactly where you put it" },
      { title: "3mm Comfort Thickness", desc: "Engineered for all-day use" },
      { title: "Deep Matte Black Finish", desc: "Subtle tonal logo" },
    ],
    specs: [
      "36 x 18 inches (900 x 450 mm)",
      "Ultra smooth microfiber surface",
      "Non-slip rubber base",
      "3mm thickness",
      "Deep matte black",
      "Subtle tonal logo",
    ],
    careInstructions: [
      "Hand wash recommended",
      "Air dry flat",
      "Do not machine wash",
      "Do not iron",
    ],
    seoTitle: "FOKUSWERK DESK MAT 01 — Premium Workspace Mat",
    seoDescription:
      "A premium full-desk performance mat designed for clarity and control. 36x18 inches. Deep matte black. Structure your workspace.",
  },
];

export const faqData = [
  {
    question: "Is this a gaming mousepad?",
    answer: "It is optimized for precision, but designed for premium workspaces. Not gaming aesthetics.",
  },
  {
    question: "Is it washable?",
    answer: "Yes, hand wash recommended. Air dry flat. Do not machine wash or iron.",
  },
  {
    question: "Does it move on the desk?",
    answer: "No. The anti-slip rubber base keeps it exactly where you place it.",
  },
  {
    question: "What is the shipping time?",
    answer: "5-8 business days within the EU. We ship from Germany.",
  },
  {
    question: "What is the return policy?",
    answer: "14-day return policy. No questions asked. See our returns page for details.",
  },
];

export const reviewsData = [
  { name: "Alexander M.", rating: 5, text: "Finally a desk mat that matches my setup. No logos, no RGB. Just clean.", date: "Feb 2026" },
  { name: "Sophie K.", rating: 5, text: "The surface quality is incredible. My workspace feels intentional now.", date: "Jan 2026" },
  { name: "David R.", rating: 5, text: "Ordered two. One for the office, one for home. Premium in every detail.", date: "Jan 2026" },
  { name: "Lena W.", rating: 4, text: "Exactly what I was looking for. Minimal, functional, beautiful.", date: "Dec 2025" },
];
