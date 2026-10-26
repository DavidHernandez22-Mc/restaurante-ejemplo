import type { Metadata, Viewport } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", axes: ["wdth"] });

const SITE_URL = "https://restauranteejemplodc.netlify.app";
const OG_IMAGE = `${SITE_URL}/images/hero-burger-estrella-smash-doble.jpg`;
const TITLE = "La Plancha 70 · Hamburguesas, papas y malteadas en Laureles, Medellín";
const DESCRIPTION =
  "Hamburguesas smash con carne molida cada mañana, papas cortadas a mano y malteadas espesas. Pide por WhatsApp o visítanos en la Cra. 70 #44-21, Laureles. Sitio de demostración.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["hamburguesas Medellín", "hamburguesas Laureles", "domicilios hamburguesas", "malteadas Medellín", "comida rápida La 70"],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "La Plancha 70",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1400, height: 1750, alt: "La Doble 70: dos carnes smash con cheddar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#D91F16",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "La Plancha 70",
  servesCuisine: ["Hamburguesas", "Comida rápida"],
  priceRange: "$$",
  url: SITE_URL,
  image: OG_IMAGE,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cra. 70 #44-21",
    addressLocality: "Medellín",
    addressRegion: "Antioquia",
    addressCountry: "CO",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "12:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "12:00", closes: "23:30" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "21:00" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // overflowAnchor va en línea porque el compilador de CSS descarta esa propiedad:
    // evita que el navegador mueva el scroll solo cuando la carta cambia de alto.
    <html lang="es-CO" className={`${anton.variable} ${archivo.variable}`} style={{ overflowAnchor: "none" }}>
      <body>
        <noscript>
          <style>{`.loader{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
