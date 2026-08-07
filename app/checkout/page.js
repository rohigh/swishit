'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const router = useRouter();
  const supabase = createClient();
  const { cartItems, cartSubtotal, clearCart } = useCart();

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

  // Payment Method: 'online' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('online');

  // Processing + error state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

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

  // ─── Calculations ────────────────────────────────────────────────────────────
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

  // ─── Promo Code Handler ───────────────────────────────────────────────────────
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

  // ─── Validate form fields ─────────────────────────────────────────────────────
  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'postalCode'];
    for (const field of required) {
      if (!formData[field]?.trim()) {
        return `Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
      }
    }
    return null;
  };

  const completeOrder = async (orderDetails) => {
    try {
      if (user?.id) {
        await supabase.from('orders').insert({
          user_id: user.id,
          order_number: orderDetails.orderId,
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
    router.push(`/order-success?orderId=${orderDetails.orderId}`);
  };

  // ─── Main Form Submit ─────────────────────────────────────────────────────────
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const validationError = validateForm();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

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

    if (paymentMethod === 'online') {
      try {
        const response = await fetch('/api/razorpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal }),
        });
        const data = await response.json();
        
        if (!data.order) throw new Error('Failed to create Razorpay order');

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'SWISH IT',
          description: 'Payment for your order',
          order_id: data.order.id,
          handler: async function (response) {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.isOk) {
              await completeOrder(orderDetails);
            } else {
              alert('Payment verification failed. Please contact support.');
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#173E4A',
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
            }
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
          alert('Payment failed. Reason: ' + response.error.description);
          setIsSubmitting(false);
        });
        rzp1.open();
        
      } catch (err) {
        console.error('Payment Error:', err);
        alert('Could not initialize payment. Please try again.');
        setIsSubmitting(false);
      }
      return;
    }

    // COD Flow
    await completeOrder(orderDetails);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FBF7EC] text-[#173E4A] flex flex-col font-body selection:bg-[#1D7E9E] selection:text-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-text font-bold mb-2">
            <span>Shop</span>
            <span>/</span>
            <span>Cart</span>
            <span>/</span>
            <span className="text-text">Checkout</span>
          </span>
          <h1 className="text-fluid-2xl font-heading font-semibold text-text">
            Complete Your Order
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#155E78]/10 max-w-2xl mx-auto shadow-sm">
            <h2 className="text-2xl font-heading font-semibold text-text mb-2">Your cart is empty</h2>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#155E78] text-white font-medium text-sm hover:bg-[#155E78] transition-all shadow-md">
              Return to Shop
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#155E78]/10">
                <h2 className="text-xl font-heading font-semibold text-text mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Email Address</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">First Name</label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">Last Name</label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Phone Number</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Street Address</label>
                    <input type="text" name="street" required value={formData.street} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">City</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text mb-1">State</label>
                      <input type="text" name="state" required value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text mb-1">Postal Code</label>
                    <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#155E78]/10">
                <h2 className="text-xl font-heading font-semibold text-text mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <label
                    onClick={() => setPaymentMethod('online')}
                    className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-[#173E4A] bg-[#FBF7EC]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="mt-1 accent-[#173E4A]"
                    />
                    <div className="w-full">
                      <p className="font-semibold text-sm text-[#173E4A]">Pay Online Securely</p>
                      <p className="text-xs text-[#173E4A]/70 mb-1">UPI, Credit/Debit Cards, NetBanking, Wallets</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] bg-[#173E4A]/10 text-[#173E4A] px-2 py-0.5 rounded uppercase font-semibold tracking-wider">UPI</span>
                        <span className="text-[10px] bg-[#173E4A]/10 text-[#173E4A] px-2 py-0.5 rounded uppercase font-semibold tracking-wider">Cards</span>
                        <span className="text-[10px] bg-[#173E4A]/10 text-[#173E4A] px-2 py-0.5 rounded uppercase font-semibold tracking-wider">NetBanking</span>
                      </div>
                    </div>
                  </label>
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
                      <p className="text-xs text-[#173E4A]/70">Pay cash upon delivery.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#155E78]/10 sticky top-28">
                <h2 className="text-xl font-heading font-semibold text-text pb-4 border-b border-[#155E78]/10">Order Summary</h2>
                <div className="py-4 space-y-4 max-h-80 overflow-y-auto">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.title} x {item.quantity}</span>
                      <span className="font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="py-4 border-t border-[#155E78]/10">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-green-700">{appliedPromo.code} — {appliedPromo.label} applied!</span>
                      </div>
                      <button type="button" onClick={() => setAppliedPromo(null)} className="text-xs font-semibold text-red-500 hover:underline">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-300 text-sm text-text focus:outline-none focus:ring-2 focus:ring-[#5AB8D6]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-[#155E78] text-white text-sm font-semibold hover:bg-[#155E78] transition-all"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
                </div>

                {/* Pricing Totals Breakdown */}
                <div className="py-4 space-y-2.5 text-sm border-t border-[#155E78]/10">
                  <div className="flex justify-between text-text/80">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text">₹{cartSubtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo?.code})</span>
                      <span className="font-semibold">−₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-text/80">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-text">
                      {shippingFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shippingFee}`}
                    </span>
                  </div>

                  {shippingFee > 0 && (
                    <p className="text-[11px] text-text">Add ₹{399 - cartSubtotal} more for FREE Shipping!</p>
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
                  className="w-full py-4 rounded-full bg-[#173E4A] hover:bg-[#155E78] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing Order...'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'} · ₹{finalTotal}
                      </span>
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
