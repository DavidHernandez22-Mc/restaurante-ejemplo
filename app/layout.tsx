import type { Metadata, Viewport } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", axes: ["wdth"] });

const SITE_URL = "https://restauranteejemplo.co";
const TITLE = "Restaurante Ejemplo · Hamburguesas, papas y malteadas en Laureles, Medellín";
const DESCRIPTION =
  "Hamburguesas smash con carne molida cada mañana, papas cortadas a mano y malteadas espesas. Pide a domicilio por WhatsApp o visítanos en la Cra. 70 #44-21, Laureles.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["hamburguesas Medellín", "hamburguesas Laureles", "domicilios hamburguesas", "malteadas Medellín", "comida rápida La 70"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: "Restaurante Ejemplo",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/hero-burger-estrella-smash-doble.jpg", width: 1400, height: 1750, alt: "La Doble Ejemplo: dos carnes smash con cheddar" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/hero-burger-estrella-smash-doble.jpg"],
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
  name: "Restaurante Ejemplo",
  servesCuisine: ["Hamburguesas", "Comida rápida"],
  priceRange: "$$",
  telephone: "+57 604 444 1234",
  url: SITE_URL,
  image: `${SITE_URL}/images/hero-burger-estrella-smash-doble.jpg`,
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
