import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "ARV — Danish furniture, made to be inherited",
    template: "%s — ARV",
  },
  description:
    "Hand-crafted Danish furniture from a third-generation workshop in Copenhagen. Solid wood, honest joinery, pieces made to outlive you.",
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
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
          <CartDrawer />
          <AnimationOrchestrator />
        </CartProvider>
      </body>
    </html>
  );
}
