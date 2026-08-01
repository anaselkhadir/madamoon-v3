import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://madamoon.fr"),
  title: "MADAMOON — La boutique immersive | Robes de mariée sur mesure à Paris",
  description:
    "Visitez le showroom MADAMOON en 3D : un écrin classé monument historique au cœur du 10ᵉ arrondissement de Paris. Robes de mariée modernes à l'élégance intemporelle, confection sur mesure, essayage privé.",
  keywords: [
    "robe de mariée Paris",
    "boutique 3D",
    "robe de mariée sur mesure",
    "essayage privé",
    "Madamoon",
  ],
  openGraph: {
    title: "MADAMOON — Entrez dans la boutique",
    description:
      "Une expérience immersive : parcourez notre showroom parisien et découvrez nos robes de mariée sur mesure.",
    locale: "fr_FR",
    type: "website",
    images: ["/images/showroom.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${cormorant.variable} ${jost.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
