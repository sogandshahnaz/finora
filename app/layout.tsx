
import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";

import ToastProvider from "@/components/providers/ToastProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import LanguageProvider from "@/components/providers/LanguageProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Finora | Personal Finance Dashboard",
  description:
    "Manage your income, expenses, and personal finances with Finora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body 
      suppressHydrationWarning
      className="min-h-full flex flex-col"
      >
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <ToastProvider />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
