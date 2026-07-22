import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LenisProvider } from "@/components/lenis-provider";
import { t } from "@/content/copy";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display script font — reserved for exactly two moments: the hero headline
// and the footer signature (see globals.css @theme comment).
const bigRiver = localFont({
  src: "../public/fonts/big_river_sample.ttf",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute base for OG / Twitter card image URLs (project.ogImage is a
  // root-relative path). Points at the deployed site so social crawlers can
  // fetch the images. Override via NEXT_PUBLIC_SITE_URL for a custom domain.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://vivekarya2026.github.io/ayushi-portfolio",
  ),
  title: t.meta.siteTitle,
  description: t.meta.siteDescription,
  openGraph: {
    title: t.meta.siteTitle,
    description: t.meta.ogDescription,
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} ${bigRiver.variable}`}
    >
      {/* Extensions (Grammarly, Kapture, …) inject classes/attributes onto
          <body> before React hydrates; suppress that one-level mismatch so it
          doesn't surface as a console hydration error. */}
      <body
        suppressHydrationWarning
        className="min-h-dvh flex flex-col bg-canvas text-ink antialiased"
      >
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <LenisProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
