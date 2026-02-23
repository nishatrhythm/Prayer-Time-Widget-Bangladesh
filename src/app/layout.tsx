import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prayer Time Widget",
  description: "আজকের নামাজের সময়সূচী - জেলা ভিত্তিক",
  icons: {
    icon: "/favicon.png",
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
