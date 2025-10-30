import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastClient from "@/Components/ToastClient";
import ChatRoom from "@/Components/HomePage/ChatRoom";
import { SocketProvider } from "@/contexts/SocketProvider";
import ClerkProviderClient from "@/Components/ClerkProviderClient";

import FacebookFragmentFix from '@/Components/FacebookFragmentFix';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lab Wards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FacebookFragmentFix />
        {/* Container for Clerk Smart CAPTCHA widget. Clerk will search for an element
            with id="clerk-captcha" to mount the visual CAPTCHA. If absent, Clerk
            falls back to an invisible CAPTCHA (functionality still works). */}
        <div id="clerk-captcha" />

        <ClerkProviderClient>
          <SocketProvider>
            {children}
            <ChatRoom />
            <ToastClient />
          </SocketProvider>
        </ClerkProviderClient>
      </body>
    </html>
  );
}
