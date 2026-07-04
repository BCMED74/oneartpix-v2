import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.oneartpix.com"),
  title: "OneArtPix — Where Light Meets Emotion",
  description: "Fine art photography prints. Limited editions. Signed & numbered. By appointment.",
  keywords: "fine art photography, limited edition prints, luxury art prints, Switzerland",
  openGraph: {
    title: "OneArtPix — Where Light Meets Emotion",
    description: "Fine art photography prints. Limited editions. Signed & numbered.",
    url: "https://oneartpix.com",
    siteName: "OneArtPix",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Cursor />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
