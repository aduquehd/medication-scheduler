import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medication Scheduler | Track Your Doses",
  description: "Never miss a dose with our intelligent medication scheduler. Track multiple medications, set dosing intervals, and get a clear 24-hour schedule.",
  keywords: "medication scheduler, dose tracker, pill reminder, medication management, health tracker",
  authors: [{ name: "Medication Scheduler App" }],
  openGraph: {
    title: "Medication Scheduler",
    description: "Track your medications and never miss a dose",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Medication Scheduler",
    description: "Track your medications and never miss a dose",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3B82F6" },
    { media: "(prefers-color-scheme: dark)", color: "#1F2937" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
