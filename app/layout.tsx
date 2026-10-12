import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FnJ Working Space & Pickleball Club — MDS Demo",
  description:
    "FnJ Working Space and Pickleball Club in Tagas, Daraga, Albay. Coworking desk passes, conference rooms, pickleball court reservations, and amenities guide.",
  openGraph: {
    title: "FnJ Working Space & Pickleball Club — MDS Demo",
    description:
      "FnJ Working Space and Pickleball Club in Tagas, Daraga, Albay. Coworking desk passes, conference rooms, pickleball court reservations, and amenities guide.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${poppins.variable}`}>
      <body className={`${poppins.className} min-h-screen bg-[#F5F5DC] text-[#0A192F] antialiased selection:bg-[#D4AF37] selection:text-[#0A192F]`}>
        {children}
      </body>
    </html>
  );
}
