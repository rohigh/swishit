import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import SmoothScrollProvider from './providers';
import JsonLd from '@/components/JsonLd';

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
    default: 'SWISH IT | The Standard for Effortless Clean',
    template: '%s | SWISH IT',
  },
  description: 'High-performance, plant-powered dishwashing dew engineered for effortless clean. Cut grease instantly with zero soapy residue.',
  keywords: ['swishit', 'dishwash', 'plant-powered', 'hygiene', 'kitchen', 'cleaning dew', 'eco-friendly'],
  authors: [{ name: 'SWISH IT' }],
  creator: 'SWISH IT',
  metadataBase: new URL('https://swishit.app'),
  icons: {
    icon: '/img/logo - swishit-01.png',
    shortcut: '/img/logo - swishit-01.png',
    apple: '/img/logo - swishit-01.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://swishit.app',
    siteName: 'SWISH IT',
    title: 'SWISH IT | The Standard for Effortless Clean',
    description: 'High-performance, plant-powered dishwashing dew engineered for effortless clean. Free shipping over ₹399.',
    images: [
      {
        url: '/img/ocean garden edited.png',
        width: 1200,
        height: 630,
        alt: 'SWISH IT Dishwashing Dew',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SWISH IT | The Standard for Effortless Clean',
    description: 'High-performance, plant-powered dishwashing dew engineered for effortless clean. Free shipping over ₹399.',
    creator: '@swishit',
    images: ['/img/ocean garden edited.png'],
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
        <JsonLd />
        {/*
          SmoothScrollProvider wraps:
          - GSAP plugin registration (ScrollTrigger, useGSAP)
          - Lenis smooth scroll (disabled on touch devices)
          - AnimatePresence for Framer Motion page transitions

          'use client' is declared in providers.js; this layout
          remains a Server Component for optimal SSR performance.
        */}
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
