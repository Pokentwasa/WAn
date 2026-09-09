import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AppDataProvider } from "@/lib/store";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Refer - Word of mouth. Now measurable.",
  description:
    "Turn your customers into referrers and only pay when they sell. Referral programmes for WhatsApp-first businesses.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAF7F1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans">
        <AppDataProvider>{children}</AppDataProvider>
      </body>
    </html>
  );
}
