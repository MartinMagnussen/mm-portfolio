import type { Metadata } from "next";
import { Suspense } from "react";
import { Bricolage_Grotesque, Archivo, Space_Mono } from "next/font/google";
import GridGlow from "@/components/GridGlow";
import TopNav from "@/components/TopNav";
import Cursor from "@/components/Cursor";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Archivo({
  variable: "--ff-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const mono = Space_Mono({
  variable: "--ff-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const SITE_URL = "https://mm-portfolio-zeta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Martin Magnussen — Kreativ konseptutvikler & designer",
    template: "%s — Martin Magnussen",
  },
  description:
    "Portefølje av Martin Magnussen. Kreativ konseptutvikling, reklame og visuell design.",
  openGraph: {
    title: "Martin Magnussen — Kreativ konseptutvikler & designer",
    description:
      "Portefølje av Martin Magnussen. Kreativ konseptutvikling, reklame og visuell design.",
    url: SITE_URL,
    siteName: "MM",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Martin Magnussen — Kreativ konseptutvikler & designer",
    description:
      "Portefølje av Martin Magnussen. Kreativ konseptutvikling, reklame og visuell design.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        {/* Page-wide grid + cursor glow for every page; the spiral view sits on
            an opaque backdrop and layers its own identical grid on top. */}
        <GridGlow asBackground />
        {/* Persistent nav so the indicator animates across route changes.
            Reads the URL via useSearchParams, hence the Suspense boundary. */}
        <Suspense fallback={null}>
          <TopNav />
        </Suspense>
        {children}
        {/* Custom two-square cursor (fine pointers only; native cursor otherwise). */}
        <Cursor />
      </body>
    </html>
  );
}
