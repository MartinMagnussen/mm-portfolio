import type { Metadata } from "next";
import { Space_Grotesk, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body>{children}</body>
    </html>
  );
}
