import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Correct mobile viewport handling.
 * `maximumScale` is intentionally left unset so users can still pinch-zoom
 * (locking zoom is an accessibility failure).
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets us use env(safe-area-inset-*) on notched phones
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EFE3D5" },
    { media: "(prefers-color-scheme: dark)", color: "#181113" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Stayuga — Farmhouse Stays & Celebrations, Handled End to End",
    template: "%s | Stayuga",
  },
  description:
    "Hyderabad's one-stop farmhouse company. Handpicked estates, private dining, styling and full event management — arranged by a single team.",
  appleWebApp: {
    capable: true,
    title: "Stayuga",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: true },
  openGraph: {
    type: "website",
    siteName: "Stayuga",
    title: "Stayuga — Farmhouse Stays & Celebrations, Handled End to End",
    description:
      "Hyderabad's one-stop farmhouse company. Handpicked estates, private dining, styling and full event management — arranged by a single team.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      {/*
        `suppressHydrationWarning` is needed because browser extensions inject
        attributes into <body> before React hydrates — Grammarly adds
        `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed`, and
        password managers / dark-mode extensions do similar things.

        The server can't know about them, so React reports an attribute
        mismatch. The flag applies to THIS element only, one level deep: it
        silences the extension noise on <body> without hiding genuine
        hydration bugs in any child component.
      */}
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col overflow-x-hidden bg-cream text-ink"
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to content
        </a>
        <Header />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
