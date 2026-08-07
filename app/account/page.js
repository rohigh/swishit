'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile' | 'addresses' | 'settings'
  const [signingOut, setSigningOut] = useState(false);

  // Address edit state (sample client state)
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [savedAddress, setSavedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          router.push('/login?redirect_to=/account');
          return;
        }
        setUser(user);

        // Fetch user orders from Supabase database
        try {
          const { data: dbOrders } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (dbOrders) {
            setOrders(dbOrders);
          }
        } catch (dbErr) {
          console.error('Error fetching user orders:', dbErr);
        } finally {
          setLoadingOrders(false);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        router.push('/login?redirect_to=/account');
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, [router, supabase]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setSigningOut(false);
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    setSavedAddress(address);
    setIsEditingAddress(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF7EC] flex flex-col font-body">
        <Navbar />
        <main className="flex-grow pt-36 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-[#155E78]/20 border-t-[#155E78] rounded-full animate-spin" />
            <p className="text-sm font-medium text-text/70">Loading your account...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  const metadata = user.user_metadata || {};
  const fullName = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Valued Customer';
  const avatarUrl = metadata.avatar_url || metadata.picture;
  const createdAtFormatted = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Member';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-[#FBF7EC] text-text flex flex-col font-body selection:bg-[#1D7E9E] selection:text-white">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 md:pt-40 md:pb-32 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        {/* ── USER BANNER HEADER ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#155E78]/10 mb-8 overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#5AB8D6]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F0A93B]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5 sm:gap-6">
              {/* User Avatar */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#155E78] to-[#155E78] text-white flex items-center justify-center text-2xl font-bold font-heading shadow-md overflow-hidden flex-shrink-0 border-2 border-white">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span>{fullName.charAt(0).toUpperCase()}</span>
                )}
              </div>

              {/* User Info */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-text capitalize">
                    {fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1D7E9E]/10 border border-[#1D7E9E]/20 text-text text-[0.6875rem] font-bold uppercase tracking-wider hidden sm:inline-block">
                    Verified Customer
                  </span>
                </div>
                <p className="text-sm text-text/70 font-mono mb-2">{user.email}</p>
                <div className="flex items-center gap-4 text-xs text-text/60 font-medium">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Member since {createdAtFormatted}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Action: Logout Button */}
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F4F1EB] hover:bg-red-50 hover:text-red-600 text-text font-semibold text-sm transition-all border border-[#155E78]/10 shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {signingOut ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </motion.div>

        {/* ── TABBED LAYOUT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-3 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] border border-[#155E78]/10 sticky top-28">
              <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap lg:whitespace-normal w-full text-left ${
                    activeTab === 'orders'
                      ? 'bg-[#155E78] text-white shadow-sm font-semibold'
                      : 'text-text/80 hover:bg-[#FBF7EC] hover:text-text'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Orders & History</span>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap lg:whitespace-normal w-full text-left ${
                    activeTab === 'profile'
                      ? 'bg-[#155E78] text-white shadow-sm font-semibold'
                      : 'text-text/80 hover:bg-[#FBF7EC] hover:text-text'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Info</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap lg:whitespace-normal w-full text-left ${
                    activeTab === 'addresses'
                      ? 'bg-[#155E78] text-white shadow-sm font-semibold'
                      : 'text-text/80 hover:bg-[#FBF7EC] hover:text-text'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Saved Address</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap lg:whitespace-normal w-full text-left ${
                    activeTab === 'settings'
                      ? 'bg-[#155E78] text-white shadow-sm font-semibold'
                      : 'text-text/80 hover:bg-[#FBF7EC] hover:text-text'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Preferences</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Tab Content */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#155E78]/10"
                >
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#155E78]/10">
                    <div>
                      <h2 className="text-xl font-heading font-semibold text-text">Your Orders</h2>
                      <p className="text-sm text-text/70 font-body">Track status, view receipts, and manage past purchases.</p>
                    </div>
                    <span className="px-3 py-1 bg-[#FBF7EC] rounded-full text-xs font-mono font-bold text-text border border-[#155E78]/10">
                      {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                    </span>
                  </div>

                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((ord) => (
                        <div key={ord.id} className="p-5 rounded-2xl bg-[#F4F1EB]/50 border border-[#155E78]/10 hover:border-[#155E78]/20 transition-all">
                          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#155E78]/10">
                            <div>
                              <span className="text-xs font-mono font-bold uppercase text-text/60">Order Number</span>
                              <p className="text-base font-bold text-text font-mono">{ord.order_number}</p>
                            </div>
                            <div>
                              <span className="text-xs font-mono font-bold uppercase text-text/60">Placed On</span>
                              <p className="text-sm font-medium text-text">
                                {new Date(ord.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs font-mono font-bold uppercase text-text/60">Total</span>
                              <p className="text-base font-bold text-text">₹{ord.total}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">
                              ● {ord.status || 'Processing'}
                            </span>
                          </div>

                          {/* Items summary preview */}
                          <div className="flex flex-wrap items-center gap-3">
                            {Array.isArray(ord.items) && ord.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-xs">
                                <span className="font-semibold text-text">{item.title}</span>
                                <span className="text-text font-bold">x{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Empty Orders State */
                    <div className="text-center py-12 px-4 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[#F4F1EB] flex items-center justify-center text-text mb-4 shadow-inner">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-text mb-2">No orders placed yet</h3>
                      <p className="text-sm text-text/70 max-w-md mb-6 leading-relaxed">
                        Experience the standard for effortless clean. Browse our high-performance hygiene line and place your first order.
                      </p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#155E78] text-white font-medium text-sm hover:bg-[#155E78] transition-all shadow-md"
                      >
                        <span>Explore Shop</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: PROFILE */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#155E78]/10"
                >
                  <div className="pb-6 mb-6 border-b border-[#155E78]/10">
                    <h2 className="text-xl font-heading font-semibold text-text">Profile Details</h2>
                    <p className="text-sm text-text/70">Your personal details synced with your login account.</p>
                  </div>

                  <div className="space-y-6 max-w-xl">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text/60 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value={fullName}
                        className="w-full px-4 py-3 rounded-xl bg-[#F4F1EB]/60 border border-[#155E78]/10 text-text font-medium cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text/60 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email || ''}
                        className="w-full px-4 py-3 rounded-xl bg-[#F4F1EB]/60 border border-[#155E78]/10 text-text font-medium cursor-not-allowed"
                      />
                      <p className="text-xs text-text/50 mt-1">Managed via your Google / Supabase login provider.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text/60 mb-2">
                        Account ID
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user.id}
                        className="w-full px-4 py-3 rounded-xl bg-[#F4F1EB]/60 border border-[#155E78]/10 text-text/70 font-mono text-xs cursor-not-allowed"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: ADDRESSES */}
              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#155E78]/10"
                >
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#155E78]/10">
                    <div>
                      <h2 className="text-xl font-heading font-semibold text-text">Delivery Address</h2>
                      <p className="text-sm text-text/70">Save your preferred shipping address for faster checkout.</p>
                    </div>
                    {!isEditingAddress && (
                      <button
                        onClick={() => setIsEditingAddress(true)}
                        className="px-4 py-2 rounded-full bg-[#155E78] text-white text-xs font-semibold hover:bg-[#155E78] transition-all"
                      >
                        {savedAddress ? 'Edit Address' : '+ Add Address'}
                      </button>
                    )}
                  </div>

                  {isEditingAddress ? (
                    <form onSubmit={handleSaveAddress} className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-xs font-semibold text-text mb-1">Street Address</label>
                        <input
                          type="text"
                          required
                          placeholder="House/Flat No, Street, Area"
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-text mb-1">City</label>
                          <input
                            type="text"
                            required
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text mb-1">State / Province</label>
                          <input
                            type="text"
                            required
                            placeholder="State"
                            value={address.state}
                            onChange={(e) => setAddress({ ...address, state: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-text mb-1">Postal Code</label>
                          <input
                            type="text"
                            required
                            placeholder="PIN / ZIP Code"
                            value={address.postalCode}
                            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text mb-1">Country</label>
                          <input
                            type="text"
                            required
                            value={address.country}
                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-text focus:outline-none focus:ring-2 focus:ring-[#5AB8D6] bg-white text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-full bg-[#155E78] text-white text-sm font-semibold hover:bg-[#155E78] transition-all"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(false)}
                          className="px-6 py-2.5 rounded-full bg-[#F4F1EB] text-text text-sm font-semibold hover:bg-gray-200 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : savedAddress ? (
                    <div className="p-6 rounded-2xl bg-[#FBF7EC] border border-[#155E78]/10 max-w-xl">
                      <div className="flex items-center gap-2 mb-2 text-text font-bold text-xs uppercase tracking-wider">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Default Shipping Address
                      </div>
                      <p className="font-semibold text-text text-base mb-1">{fullName}</p>
                      <p className="text-sm text-text/80">{savedAddress.street}</p>
                      <p className="text-sm text-text/80">
                        {savedAddress.city}, {savedAddress.state} - {savedAddress.postalCode}
                      </p>
                      <p className="text-sm text-text/80">{savedAddress.country}</p>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-text/60 text-sm">
                      No address saved yet. Click &quot;+ Add Address&quot; above to save one.
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: SETTINGS */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] border border-[#155E78]/10"
                >
                  <div className="pb-6 mb-6 border-b border-[#155E78]/10">
                    <h2 className="text-xl font-heading font-semibold text-text">Account Preferences</h2>
                    <p className="text-sm text-text/70">Manage notifications, communications, and privacy.</p>
                  </div>

                  <div className="space-y-6 max-w-xl">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FBF7EC] border border-[#155E78]/10">
                      <div>
                        <p className="font-semibold text-sm text-text">Order Status Emails</p>
                        <p className="text-xs text-text/70">Receive real-time tracking updates for your orders.</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 text-text rounded accent-[#155E78] cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FBF7EC] border border-[#155E78]/10">
                      <div>
                        <p className="font-semibold text-sm text-text">Promotions & New Line Releases</p>
                        <p className="text-xs text-text/70">Be the first to hear about product launches and exclusive discounts.</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 text-text rounded accent-[#155E78] cursor-pointer"
                      />
                    </div>

                    <div className="pt-4 border-t border-[#155E78]/10">
                      <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-sm"
                      >
                        Sign Out of All Devices
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
