import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import { ScrollToTop } from "./components/ScrollToTop";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import OrderCancel from "./pages/OrderCancel";
import ContactPage from "./pages/ContactPage";
import PhilosophyPage from "./pages/PhilosophyPage";
import AboutPage from "./pages/AboutPage";
import { LegalNotice, PrivacyPolicy, TermsPage, ReturnsPage } from "./pages/LegalPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<ProductPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order/success" element={<OrderSuccess />} />
              <Route path="/order/cancel" element={<OrderCancel />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/philosophy" element={<PhilosophyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/legal-notice" element={<LegalNotice />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
