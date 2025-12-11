import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Navbar, Footer } from "@/components/layout";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhimHay - Xem Phim Chất Lượng Cao",
  description: "Website xem phim chất lượng cao với giao diện hiện đại, đẹp mắt. Phim bộ, phim lẻ, hoạt hình, TV shows mới nhất.",
  keywords: ["xem phim", "phim hay", "phim mới", "phim bộ", "phim lẻ", "hoạt hình"],
};

// Viewport configuration for TV
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050510',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Polyfills for old TV browsers */}
        <Script
          src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,fetch,Promise,Array.prototype.includes,Object.assign,String.prototype.includes,Array.from,Symbol,Map,Set,WeakMap,WeakSet"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <AuthProvider>
          {/* Background Orbs */}
          <div className="bg-orbs" />
          
          {/* Main Layout */}
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
