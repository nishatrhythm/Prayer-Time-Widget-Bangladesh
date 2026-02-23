import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prayer Time Widget",
  description: "আজকের নামাজের সময়সূচী - জেলা ভিত্তিক",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Prayer Time Widget",
    description: "আজকের নামাজের সময়সূচী - জেলা ভিত্তিক",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "আজকের নামাজের সময়সূচী",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prayer Time Widget",
    description: "আজকের নামাজের সময়সূচী - জেলা ভিত্তিক",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
