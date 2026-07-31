'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const FREE_SHIPPING_THRESHOLD = 399;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#173E4A]/40 backdrop-blur-xs"
          />

          {/* Slide-out Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col font-body text-[#173E4A] z-10 overflow-hidden border-l border-[#173E4A]/10"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-[#173E4A]/10 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#155E78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-xl font-heading font-semibold text-[#173E4A]">Your Bag</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#155E78]/10 text-[#155E78] text-xs font-bold font-mono">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F4F1EB] hover:bg-gray-200 text-[#173E4A] flex items-center justify-center transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Free Shipping Progress Banner */}
            <div className="bg-[#FBF7EC] px-6 py-3.5 border-b border-[#173E4A]/10">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                {amountNeeded > 0 ? (
                  <span className="text-[#173E4A]">
                    Add <strong className="text-[#155E78]">₹{amountNeeded}</strong> more for <strong className="text-green-700">FREE Shipping!</strong>
                  </span>
                ) : (
                  <span className="text-green-700 font-bold flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    🎉 You&apos;ve unlocked FREE Shipping!
                  </span>
                )}
                <span className="font-mono text-[#173E4A]/60">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    progressPercent >= 100 ? 'bg-green-600' : 'bg-[#155E78]'
                  }`}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#F4F1EB] flex items-center justify-center text-[#155E78] mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-[#173E4A] mb-1">Your bag is empty</h3>
                  <p className="text-xs text-[#173E4A]/70 max-w-xs mb-6">
                    Looks like you haven&apos;t added any products yet.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/shop');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#173E4A] text-white font-medium text-xs hover:bg-[#155E78] transition-all shadow-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <motion.div
                    key={`${item.id}-${item.variant || idx}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-3.5 rounded-2xl bg-[#F4F1EB]/50 border border-[#173E4A]/10 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl bg-white p-2 flex-shrink-0 flex items-center justify-center border border-gray-100">
                      <Image
                        src={item.image || '/img/blue-nobg.jpeg'}
                        alt={item.title}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start pr-6">
                          <h4 className="text-sm font-semibold text-[#173E4A] leading-tight line-clamp-1">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-[#173E4A]/60 font-mono mt-0.5">{item.variant}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 border border-gray-300 rounded-full bg-white px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, -1)}
                            className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center text-xs font-bold text-[#173E4A]"
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <span className="text-xs font-bold font-mono text-[#173E4A] w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, 1)}
                            className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center text-xs font-bold text-[#173E4A]"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-[#173E4A]">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Delete Icon Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.variant)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout CTA */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-[#173E4A]/10 bg-white shadow-lg space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-[#173E4A]/80">Subtotal</span>
                  <span className="text-2xl font-bold font-heading text-[#173E4A]">
                    ₹{cartSubtotal}
                  </span>
                </div>
                <p className="text-[11px] text-[#173E4A]/60">Taxes and shipping calculated at checkout.</p>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-full bg-[#173E4A] hover:bg-[#155E78] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center text-xs text-[#155E78] font-semibold hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
