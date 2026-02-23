import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/layout/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import SkipToMain from "@/components/SkipToMain";
import { lazy, Suspense } from "react";

// Eager load critical pages
import Index from "./pages/Index";

// Lazy load non-critical pages
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const OrderCancel = lazy(() => import("./pages/OrderCancel"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PhilosophyPage = lazy(() => import("./pages/PhilosophyPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Legal pages
// Legal pages (named exports)
const LegalNotice = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.LegalNotice })));
const PrivacyPolicy = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.PrivacyPolicy })));
const TermsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.TermsPage })));
const ReturnsPage = lazy(() => import("./pages/LegalPages").then((m) => ({ default: m.ReturnsPage })));

// Admin (lazy)
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminContacts = lazy(() => import("./pages/admin/AdminContacts"));
const AdminErrorLog = lazy(() => import("./pages/admin/AdminErrorLog"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">Laden...</p>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="errors" element={<AdminErrorLog />} />
          </Route>
        </Routes>
      </Suspense>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
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
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/legal-notice" element={<LegalNotice />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SkipToMain />
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
