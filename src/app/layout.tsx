import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar, Footer } from "@/components/layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { PageTransitionProvider } from "@/components/transitions";
import { TopProgressBar } from '@/components/ui/TopProgressBar';
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
  title: "CinemaHub - Xem Phim Chất Lượng Cao",
  description: "Website xem phim chất lượng cao với giao diện hiện đại, đẹp mắt. Phim bộ, phim lẻ, hoạt hình, TV shows mới nhất.",
  keywords: ["xem phim", "cinema hub", "phim hay", "phim mới", "phim bộ", "phim lẻ", "hoạt hình"],
};

// Viewport configuration - allows zooming for accessibility
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050510',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Prevent Google Translate from breaking React hydration */}
        <meta name="google" content="notranslate" />
        {/* Preconnect to API domains for faster resource loading */}
        <link rel="preconnect" href="https://phimimg.com" />
        <link rel="preconnect" href="https://img.ophim.live" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://phimapi.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <PageTransitionProvider>
            <TopProgressBar />
            <div className="bg-orbs" />
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
            <Footer />
          </PageTransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

