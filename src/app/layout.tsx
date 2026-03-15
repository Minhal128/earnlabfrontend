import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans, Manrope, Inter } from "next/font/google";
import "./globals.css";
import ToastClient from "@/Components/ToastClient";
import { SocketProvider } from "@/contexts/SocketProvider";
import BottomNavigation from "@/Components/Shared/BottomNavigation";
import CookieConsent from "@/Components/Shared/CookieConsent";
import ReduxProvider from "@/Components/ReduxProvider";
import { ClerkProvider } from "@clerk/nextjs";
import ClerkSyncProvider from "@/Components/ClerkSyncProvider";

import FacebookFragmentFix from '@/Components/FacebookFragmentFix';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Labwards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0D0F1E]">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${manrope.variable} ${inter.variable} antialiased bg-[#0D0F1E]`}
      >
        <FacebookFragmentFix />
        <ClerkProvider>
          <ClerkSyncProvider>
            <ReduxProvider>
              <SocketProvider>
                {children}
                <BottomNavigation />
                <CookieConsent />
                <ToastClient />
              </SocketProvider>
            </ReduxProvider>
          </ClerkSyncProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
