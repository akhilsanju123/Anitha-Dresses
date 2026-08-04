import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppFloating from '../components/common/WhatsAppFloating';
import CartDrawer from '../components/common/CartDrawer';
import QuickViewModal from '../components/common/QuickViewModal';
import { constructMetadata, generateOrganizationJsonLd } from '../lib/seo';

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = generateOrganizationJsonLd();

  return (
    <html lang="te">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col justify-between bg-maroon-950 text-gold-100 antialiased selection:bg-amber-400 selection:text-maroon-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloating />
        <CartDrawer />
        <QuickViewModal />
      </body>
    </html>
  );
}
