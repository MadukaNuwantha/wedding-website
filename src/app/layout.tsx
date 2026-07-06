import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Montserrat, Cinzel } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Maduka & Marine · 1 August 2026",
  description:
    "Maduka & Marine are getting married on Saturday, 1st August 2026. Join us to celebrate — ceremony at the Church of the Immaculate Heart of Mary, Haldanduwana, and reception at Moon Light Hotel, Nattandiya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${cormorant.variable} ${montserrat.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
