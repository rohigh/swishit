import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import SmoothScrollProvider from './providers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'Swishit',
    template: '%s | Swishit',
  },
  description: 'Swishit — a premium modern web experience',
  keywords: ['swishit'],
  authors: [{ name: 'Swishit' }],
  creator: 'Swishit',
  metadataBase: new URL('https://swishit.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://swishit.app',
    siteName: 'Swishit',
    title: 'Swishit',
    description: 'Swishit — a premium modern web experience',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swishit',
    description: 'Swishit — a premium modern web experience',
    creator: '@swishit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Preconnect to font CDNs for faster loading */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-base text-text antialiased font-body selection:bg-black selection:text-white">
        {/*
          SmoothScrollProvider wraps:
          - GSAP plugin registration (ScrollTrigger, useGSAP)
          - Lenis smooth scroll (disabled on touch devices)
          - AnimatePresence for Framer Motion page transitions

          'use client' is declared in providers.js; this layout
          remains a Server Component for optimal SSR performance.
        */}
        <Navbar />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
