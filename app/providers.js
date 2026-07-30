'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

// ─────────────────────────────────────────────────────────
// GSAP Plugin Registration — done once at module level
// SSR guard: typeof window !== "undefined" ensures this
// only runs in the browser (gsap-react skill pattern)
// ─────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SmoothScrollProvider({ children }) {
  const pathname = usePathname();
  const lenisRef = useRef(null);

  useEffect(() => {
    // Dynamically import Lenis to avoid SSR issues
    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      lenisRef.current = lenis;
      if (typeof window !== 'undefined') {
        window.lenisInstance = lenis;
      }

      // Connect Lenis to GSAP's ticker for synchronized animation
      lenis.on('scroll', ScrollTrigger.update);

      const tickerCallback = (time) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      // Store callback for cleanup
      lenisRef.current._tickerCallback = tickerCallback;
    });

    return () => {
      if (lenisRef.current) {
        if (lenisRef.current._tickerCallback) {
          gsap.ticker.remove(lenisRef.current._tickerCallback);
        }
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <CartProvider>
      <AnimatePresence mode="wait" initial={false}>
        <div key={pathname} className="w-full">
          {children}
        </div>
      </AnimatePresence>
      <CartDrawer />
    </CartProvider>
  );
}
