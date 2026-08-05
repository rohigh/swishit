'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'
  const [upiVpa, setUpiVpa] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function getUserData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const meta = user.user_metadata || {};
          const nameParts = (meta.full_name || meta.name || '').split(' ');
          setFormData((prev) => ({
            ...prev,
            email: user.email || '',
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
          }));
        }
      } catch (err) {
        console.error('Error fetching user for checkout:', err);
      } finally {
        setLoadingUser(false);
      }
    }
    getUserData();
  }, [supabase]);

  // Calculations
  const shippingFee = cartSubtotal >= 399 || cartItems.length === 0 ? 0 : 49;
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = Math.round((cartSubtotal * appliedPromo.value) / 100);
    } else if (appliedPromo.type === 'fixed') {
      discountAmount = appliedPromo.value;
    }
  }

  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const codeUpper = promoCode.trim().toUpperCase();

    if (!codeUpper) return;

    if (codeUpper === 'SWISH10') {
      setAppliedPromo({ code: 'SWISH10', type: 'percent', value: 10, label: '10% OFF' });
      setPromoCode('');
    } else if (codeUpper === 'SWISH50') {
      setAppliedPromo({ code: 'SWISH50', type: 'fixed', value: 50, label: '₹50 OFF' });
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try "SWISH10" for 10% off!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    const orderId = `SWISH-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderDetails = {
      orderId,
      date: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      items: cartItems,
      subtotal: cartSubtotal,
      discount: discountAmount,
      shippingFee,
      total: finalTotal,
      shippingAddress: formData,
      paymentMethod,
      userEmail: formData.email,
    };

    // Save order to Supabase database if authenticated
    try {
      if (user?.id) {
        await supabase.from('orders').insert({
          user_id: user.id,
          order_number: orderId,
          items: cartItems,
          subtotal: cartSubtotal,
          shipping_fee: shippingFee,
          total: finalTotal,
          payment_method: paymentMethod,
          shipping_address: formData,
          status: 'Processing',
        });
      }
    } catch (dbErr) {
      console.error('Database order save notice:', dbErr);
    }

    try {
      sessionStorage.setItem('swishit_last_order', JSON.stringify(orderDetails));
    } catch (err) {
      console.error('Failed to save order to session storage:', err);
    }

    clearCart();
    router.push(`/order-success?orderId=${orderId}`);
  };

  return (
    <div className="min-h-screen bg-[#FBF7EC] text-[#173E4A] flex flex-col font-body selection:bg-[#1D7E9E] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        {/* Header Breadcrumbs */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#155E78] font-bold mb-2">
            <span>Shop</span>
            <span>/</span>
            <span>Cart</span>
            <span>/</span>
            <span className="text-[#173E4A]">Checkout</span>
          </span>
          <h1 className="text-fluid-2xl font-heading font-semibold text-[#173E4A]">
            Complete Your Order
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#173E4A]/10 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#F4F1EB] flex items-center justify-center text-[#155E78] mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-heading font-semibold text-[#173E4A] mb-2">Your cart is currently empty</h2>
            <p className="text-sm text-[#173E4A]/70 mb-6">
              Add some of our high-performance hygiene products to your bag before checking out.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#173E4A] text-white font-medium text-sm hover:bg-[#155E78] transition-all shadow-md"
            >
              Return to Shop
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* ── LEFT COLUMN: Shipping & Payment Details ── */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. Contact & Shipping Address Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#173E4A]/10">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#173E4A]/10">
                  <div className="w-8 h-8 rounded-full bg-[#173E4A] text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-[#173E4A]">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#173E4A] mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#173E4A] mb-1">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#173E4A] mb-1">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#173E4A] mb-1">Phone Number (For Delivery Updates)</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#173E4A] mb-1">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="House / Flat No., Street Name, Area"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#173E4A] mb-1">Apartment, Suite, Unit (Optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      placeholder="Apt 4B"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#173E4A] mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#173E4A] mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#173E4A] mb-1">Postal Code (PIN)</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#173E4A] mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        disabled
                        value={formData.country}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#173E4A]/70 bg-gray-50 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Payment Method Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#173E4A]/10">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#173E4A]/10">
                  <div className="w-8 h-8 rounded-full bg-[#173E4A] text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-[#173E4A]">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {/* Option A: Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#173E4A] bg-[#FBF7EC]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 accent-[#173E4A]"
                    />
                    <div>
                      <p className="font-semibold text-sm text-[#173E4A]">Cash on Delivery (COD)</p>
                      <p className="text-xs text-[#173E4A]/70">Pay easily with cash or UPI at your doorstep upon delivery.</p>
                    </div>
                  </label>

                  {/* Option B: UPI Payment */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-[#173E4A] bg-[#FBF7EC]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-1 accent-[#173E4A]"
                    />
                    <div className="w-full">
                      <p className="font-semibold text-sm text-[#173E4A]">Instant UPI / QR Code</p>
                      <p className="text-xs text-[#173E4A]/70 mb-3">Google Pay, PhonePe, Paytm, BHIM</p>

                      {paymentMethod === 'upi' && (
                        <div className="mt-3 p-4 bg-white rounded-xl border border-[#173E4A]/10 space-y-3">
                          <label className="block text-xs font-semibold text-[#173E4A]">Enter your UPI ID / VPA</label>
                          <input
                            type="text"
                            placeholder="username@upi or 9876543210@paytm"
                            value={upiVpa}
                            onChange={(e) => setUpiVpa(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6]"
                          />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option C: Credit/Debit Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#173E4A] bg-[#FBF7EC]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-1 accent-[#173E4A]"
                    />
                    <div className="w-full">
                      <p className="font-semibold text-sm text-[#173E4A]">Credit / Debit Card</p>
                      <p className="text-xs text-[#173E4A]/70 mb-3">Visa, Mastercard, RuPay, Amex</p>

                      {paymentMethod === 'card' && (
                        <div className="mt-3 p-4 bg-white rounded-xl border border-[#173E4A]/10 space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#173E4A] mb-1">Card Number</label>
                            <input
                              type="text"
                              placeholder="4532 •••• •••• 8901"
                              value={cardData.number}
                              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6]"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-[#173E4A] mb-1">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                placeholder="08/28"
                                value={cardData.expiry}
                                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#173E4A] mb-1">CVV</label>
                              <input
                                type="password"
                                maxLength={4}
                                placeholder="•••"
                                value={cardData.cvv}
                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-[#173E4A] focus:outline-none focus:ring-2 focus:ring-[#5AB8D6]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Order Summary Sidebar ── */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#173E4A]/10 sticky top-28">
                <h2 className="text-xl font-heading font-semibold text-[#173E4A] pb-4 border-b border-[#173E4A]/10">
                  Order Summary
                </h2>

                {/* Items List */}
                <div className="py-4 space-y-4 max-h-80 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                      <div className="relative w-16 h-16 rounded-xl bg-[#F4F1EB] p-2 flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={item.image || '/img/blue-nobg.jpeg'}
                          alt={item.title}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-semibold text-[#173E4A] line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-[#173E4A]/60 font-mono mb-1">{item.variant}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#155E78]">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#173E4A]">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Totals Breakdown */}
                <div className="py-4 space-y-2.5 text-sm border-t border-[#173E4A]/10">
                  <div className="flex justify-between text-[#173E4A]/80">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#173E4A]">₹{cartSubtotal}</span>
                  </div>

                  <div className="flex justify-between text-[#173E4A]/80">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-[#173E4A]">
                      {shippingFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shippingFee}`}
                    </span>
                  </div>

                  {shippingFee > 0 && (
                    <p className="text-[11px] text-[#155E78]">Add ₹{399 - cartSubtotal} more for FREE Shipping!</p>
                  )}

                  <div className="pt-3 border-t border-[#173E4A]/10 flex justify-between items-baseline">
                    <span className="text-base font-heading font-semibold text-[#173E4A]">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold font-heading text-[#173E4A]">₹{finalTotal}</span>
                      <p className="text-[10px] text-[#173E4A]/60 font-mono">Includes all applicable taxes</p>
                    </div>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-full bg-[#173E4A] hover:bg-[#155E78] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order • ₹{finalTotal}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-[#173E4A]/60 mt-4 flex items-center justify-center gap-1">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  256-Bit SSL Encrypted Checkout Guarantee
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
