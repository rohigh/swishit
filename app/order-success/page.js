'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('swishit_last_order');
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to read order details:', e);
    }
  }, []);

  const displayOrderId = order?.orderId || orderIdParam || 'SWISH-984210';
  const displayTotal = order?.total || 349;
  const displayAddress = order?.shippingAddress || {
    firstName: 'Valued',
    lastName: 'Customer',
    street: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#173E4A]/10 text-center relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Checkmark Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 relative z-10 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          Order Confirmed • Payment Successful
        </span>

        <h1 className="text-3xl sm:text-5xl font-heading font-semibold text-[#173E4A] mb-3">
          Thank you for your order!
        </h1>
        <p className="text-base text-[#173E4A]/70 max-w-lg mx-auto mb-8 leading-relaxed">
          We’ve received your order and are preparing your high-performance hygiene products for shipment.
        </p>

        {/* Order Meta Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#FBF7EC] rounded-2xl border border-[#173E4A]/10 text-left mb-8">
          <div>
            <span className="block text-[11px] font-mono font-bold uppercase text-[#173E4A]/60">Order Number</span>
            <span className="text-sm font-bold text-[#173E4A] font-mono">{displayOrderId}</span>
          </div>
          <div>
            <span className="block text-[11px] font-mono font-bold uppercase text-[#173E4A]/60">Estimated Delivery</span>
            <span className="text-sm font-semibold text-[#155E78]">2 - 4 Business Days</span>
          </div>
          <div>
            <span className="block text-[11px] font-mono font-bold uppercase text-[#173E4A]/60">Payment Method</span>
            <span className="text-sm font-semibold text-[#173E4A] uppercase">{order?.paymentMethod || 'COD / UPI'}</span>
          </div>
          <div>
            <span className="block text-[11px] font-mono font-bold uppercase text-[#173E4A]/60">Total Paid</span>
            <span className="text-sm font-bold text-[#173E4A]">₹{displayTotal}</span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        <div className="text-left bg-white rounded-2xl p-6 border border-gray-100 shadow-xs mb-8">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#155E78] mb-2">
            Shipping Destination
          </h3>
          <p className="font-semibold text-[#173E4A] text-base">
            {displayAddress.firstName} {displayAddress.lastName}
          </p>
          <p className="text-sm text-[#173E4A]/80">{displayAddress.street} {displayAddress.apartment ? `, ${displayAddress.apartment}` : ''}</p>
          <p className="text-sm text-[#173E4A]/80">
            {displayAddress.city}, {displayAddress.state} - {displayAddress.postalCode}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#173E4A] text-white font-semibold text-sm hover:bg-[#155E78] transition-all shadow-md"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F4F1EB] text-[#173E4A] font-semibold text-sm hover:bg-gray-200 transition-all border border-[#173E4A]/10 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EC] text-[#173E4A] flex flex-col font-body selection:bg-[#1D7E9E] selection:text-white">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 md:px-12 lg:px-20">
        <Suspense fallback={<div className="max-w-4xl mx-auto h-96 bg-white rounded-3xl animate-pulse" />}>
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
