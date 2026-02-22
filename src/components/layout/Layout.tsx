import Header from "./Header";
import Footer from "./Footer";
import EmailCapturePopup from "@/components/EmailCapturePopup";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <EmailCapturePopup />
  </div>
);

export default Layout;
