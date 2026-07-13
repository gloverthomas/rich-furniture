import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { AnimationOrchestrator } from "@/components/layout/AnimationOrchestrator";
import "@/styles/global.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const title = "ARV — Solid oak tables, made to be inherited";
const description =
  "ARV is a two-person studio in Sydney — architect Richard Lovell and maker Tom Glover — building solid oak dining, coffee and side tables for clients around the world.";

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: title,
    template: "%s — ARV",
  },
  description,
  openGraph: {
    title,
    description,
    siteName: "ARV",
    locale: "en_AU",
    type: "website",
    images: [{ url: "/site/hero.jpg", width: 2400, height: 1400 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/site/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          <SmoothScroll>
            <Header />
            <div className="content-shrink" data-shrink-wrap>
              <main id="main">{children}</main>
            </div>
            <Footer />
          </SmoothScroll>
          <CartDrawer />
          <AnimationOrchestrator />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
