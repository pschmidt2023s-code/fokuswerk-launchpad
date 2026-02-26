import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  type?: "website" | "product";
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const SEOHead = ({ title, description, canonical, type = "website", image, jsonLd, noindex = false }: SEOHeadProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("og:url", canonical || window.location.href, "property");
    if (image) setMeta("og:image", image, "property");
    setMeta("og:locale", "de_DE", "property");
    setMeta("og:site_name", "FOCUSWERK", "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);

    // Robots
    const robotsContent = noindex ? "noindex, nofollow" : "index, follow";
    setMeta("robots", robotsContent);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    } else if (link) {
      link.remove();
    }

    // JSON-LD (support multiple)
    const existingScripts = document.querySelectorAll('script[data-seo-jsonld]');
    existingScripts.forEach(s => s.remove());
    
    const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    schemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "true");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-seo-jsonld]').forEach(s => s.remove());
    };
  }, [title, description, canonical, type, image, jsonLd, noindex]);

  return null;
};

export default SEOHead;
